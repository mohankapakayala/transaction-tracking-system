from django.contrib.auth.models import User
from django.core.cache import cache
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken

from .models import Profile

PASSWORD = "correct-horse-battery"
NEW_PASSWORD = "Tr0ubador-Staple!"


class AuthFlowTests(APITestCase):
    """Covers login, refresh, logout and change password end to end."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password=PASSWORD,
        )
        # Throttle counters live in the cache and would otherwise leak between
        # tests, failing whichever one happens to run tenth.
        cache.clear()

    def authenticate(self, access):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    def login(self):
        response = self.client.post(
            reverse("login_register:login"),
            {"username": "tester", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        return response.data

    # --- login -----------------------------------------------------------

    def test_login_returns_a_token_pair_and_the_user(self):
        data = self.login()

        self.assertIn("access", data)
        self.assertIn("refresh", data)
        self.assertEqual(data["user"]["username"], "tester")
        self.assertEqual(data["user"]["email"], "tester@example.com")

    def test_login_rejects_a_wrong_password(self):
        response = self.client.post(
            reverse("login_register:login"),
            {"username": "tester", "password": "not-it"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("access", response.data)

    # --- refresh ---------------------------------------------------------

    def test_refresh_swaps_a_refresh_token_for_a_new_pair(self):
        session = self.login()

        response = self.client.post(
            reverse("login_register:refresh"),
            {"refresh": session["refresh"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        # Rotation is on, so a replacement refresh token comes back too.
        self.assertIn("refresh", response.data)
        self.assertNotEqual(response.data["refresh"], session["refresh"])

    def test_a_rotated_refresh_token_cannot_be_reused(self):
        session = self.login()
        url = reverse("login_register:refresh")

        self.client.post(url, {"refresh": session["refresh"]}, format="json")
        replayed = self.client.post(url, {"refresh": session["refresh"]}, format="json")

        self.assertEqual(replayed.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- logout ----------------------------------------------------------

    def test_logout_blacklists_the_refresh_token(self):
        session = self.login()
        self.authenticate(session["access"])

        response = self.client.post(
            reverse("login_register:logout"),
            {"refresh": session["refresh"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(BlacklistedToken.objects.count(), 1)

        # The token is dead: it can no longer buy a new access token.
        refreshed = self.client.post(
            reverse("login_register:refresh"),
            {"refresh": session["refresh"]},
            format="json",
        )
        self.assertEqual(refreshed.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_requires_authentication(self):
        session = self.login()

        response = self.client.post(
            reverse("login_register:logout"),
            {"refresh": session["refresh"]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_reports_an_unusable_refresh_token(self):
        session = self.login()
        self.authenticate(session["access"])

        response = self.client.post(
            reverse("login_register:logout"),
            {"refresh": "not-a-token"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- change password -------------------------------------------------

    def change_password(self, access, **overrides):
        self.authenticate(access)
        payload = {
            "current_password": PASSWORD,
            "new_password": NEW_PASSWORD,
            "confirm_password": NEW_PASSWORD,
        }
        payload.update(overrides)

        return self.client.post(
            reverse("login_register:change-password"),
            payload,
            format="json",
        )

    def test_change_password_updates_the_password_and_returns_a_new_pair(self):
        session = self.login()

        response = self.change_password(session["access"])

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(NEW_PASSWORD))

    def test_change_password_ends_every_other_session(self):
        first = self.login()
        cache.clear()
        second = self.login()

        self.change_password(second["access"])

        # The other device's refresh token no longer works.
        stale = self.client.post(
            reverse("login_register:refresh"),
            {"refresh": first["refresh"]},
            format="json",
        )
        self.assertEqual(stale.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_the_pair_returned_by_change_password_still_works(self):
        session = self.login()

        response = self.change_password(session["access"])

        refreshed = self.client.post(
            reverse("login_register:refresh"),
            {"refresh": response.data["refresh"]},
            format="json",
        )
        self.assertEqual(refreshed.status_code, status.HTTP_200_OK)

    def test_change_password_rejects_a_wrong_current_password(self):
        session = self.login()

        response = self.change_password(session["access"], current_password="wrong")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("current_password", response.data)

        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(PASSWORD))

    def test_change_password_rejects_a_mismatched_confirmation(self):
        session = self.login()

        response = self.change_password(session["access"], confirm_password="different")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("confirm_password", response.data)

    def test_change_password_rejects_a_weak_new_password(self):
        session = self.login()

        response = self.change_password(
            session["access"],
            new_password="password",
            confirm_password="password",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("new_password", response.data)

    def test_change_password_rejects_reusing_the_current_password(self):
        session = self.login()

        response = self.change_password(
            session["access"],
            new_password=PASSWORD,
            confirm_password=PASSWORD,
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("new_password", response.data)

    def test_change_password_requires_authentication(self):
        response = self.client.post(
            reverse("login_register:change-password"),
            {
                "current_password": PASSWORD,
                "new_password": NEW_PASSWORD,
                "confirm_password": NEW_PASSWORD,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- throttling ------------------------------------------------------

    def test_repeated_failed_logins_are_throttled(self):
        url = reverse("login_register:login")

        for _ in range(10):
            self.client.post(
                url, {"username": "tester", "password": "nope"}, format="json"
            )

        response = self.client.post(
            url, {"username": "tester", "password": "nope"}, format="json"
        )

        self.assertEqual(response.status_code, status.HTTP_429_TOO_MANY_REQUESTS)


class ProfileTests(APITestCase):
    """Covers reading and updating the signed-in user's own profile."""

    def setUp(self):
        self.user = User.objects.create_user(
            username="tester",
            email="tester@example.com",
            password=PASSWORD,
            first_name="Ada",
            last_name="Lovelace",
        )
        cache.clear()
        self.url = reverse("login_register:profile")

    def authenticate(self):
        response = self.client.post(
            reverse("login_register:login"),
            {"username": "tester", "password": PASSWORD},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def patch(self, **fields):
        self.authenticate()
        return self.client.patch(self.url, fields, format="json")

    # --- read ------------------------------------------------------------

    def test_get_creates_the_profile_for_an_older_account(self):
        self.assertFalse(Profile.objects.filter(user=self.user).exists())

        self.authenticate()
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Profile.objects.filter(user=self.user).exists())

    def test_get_returns_the_name_and_the_account_identifiers(self):
        self.authenticate()

        response = self.client.get(self.url)

        self.assertEqual(response.data["full_name"], "Ada Lovelace")
        self.assertEqual(response.data["username"], "tester")
        self.assertEqual(response.data["email"], "tester@example.com")

    def test_profile_requires_authentication(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_one_user_cannot_read_anothers_profile(self):
        other = User.objects.create_user(
            username="other", email="other@example.com", password=PASSWORD
        )
        Profile.objects.create(user=other, work_phone="+1 555 000 1111")

        self.authenticate()
        response = self.client.get(self.url)

        # The account comes from the token, so there is no id to tamper with.
        self.assertNotEqual(response.data["work_phone"], "+1 555 000 1111")

    # --- update ----------------------------------------------------------

    def test_patch_saves_every_editable_field(self):
        response = self.patch(
            full_name="Ada King Lovelace",
            email="ada@example.com",
            work_phone="+1 (555) 012-3456",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, "Ada")
        # Everything after the first space stays together.
        self.assertEqual(self.user.last_name, "King Lovelace")
        self.assertEqual(self.user.email, "ada@example.com")

        profile = Profile.objects.get(user=self.user)
        self.assertEqual(profile.work_phone, "+1 (555) 012-3456")

    def test_patch_leaves_omitted_fields_alone(self):
        self.patch(work_phone="+1 555 012 3456")
        response = self.patch(full_name="Ada Lovelace")

        self.assertEqual(response.data["work_phone"], "+1 555 012 3456")
        self.assertEqual(response.data["email"], "tester@example.com")

    def test_patch_clears_an_optional_field(self):
        self.patch(work_phone="+1 555 012 3456")
        response = self.patch(work_phone="")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["work_phone"], "")

    def test_patch_rejects_a_blank_name(self):
        response = self.patch(full_name="   ")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("full_name", response.data)

    def test_patch_rejects_a_phone_number_that_is_not_one(self):
        response = self.patch(work_phone="call me maybe")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("work_phone", response.data)

    def test_patch_ignores_attempts_to_change_the_username(self):
        response = self.patch(username="someone-else")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "tester")

    def test_patch_rejects_an_email_another_account_already_uses(self):
        User.objects.create_user(
            username="other", email="taken@example.com", password=PASSWORD
        )

        response = self.patch(email="TAKEN@example.com")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

        self.user.refresh_from_db()
        self.assertEqual(self.user.email, "tester@example.com")

    def test_patch_allows_resaving_the_users_own_email(self):
        response = self.patch(email="tester@example.com")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_rejects_a_malformed_email(self):
        response = self.patch(email="not-an-email")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_changing_the_email_does_not_change_the_login_username(self):
        self.patch(email="ada@example.com")

        # The username is what `authenticate` takes, so it must survive.
        signed_in = self.client.post(
            reverse("login_register:login"),
            {"username": "tester", "password": PASSWORD},
            format="json",
        )
        self.assertEqual(signed_in.status_code, status.HTTP_200_OK)
