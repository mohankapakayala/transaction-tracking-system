from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Profile
from .serializers import (
    ChangePasswordSerializer,
    LoginSerializer,
    LogoutSerializer,
    ProfileSerializer,
    RegisterSerializer,
)


def issue_session(user, message):
    """The body every endpoint that hands out a new token pair returns."""

    refresh = RefreshToken.for_user(user)

    return {
        "message": message,

        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },

        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


def revoke_all_refresh_tokens(user):
    """Signs the user out everywhere by blacklisting every live refresh token.

    Only tokens issued while the blacklist app has been installed are tracked,
    so anything older simply expires on its own schedule.
    """

    for outstanding in OutstandingToken.objects.filter(user=user):
        BlacklistedToken.objects.get_or_create(token=outstanding)


class LoginView(APIView):

    # Callers have no credentials yet, so this one has to be public.
    permission_classes = [AllowAny]
    # Caps password guessing per IP without locking real users out of an account.
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "login"

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        # Validate request data
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        # Check username and password
        user = authenticate(
            username=username,
            password=password
        )

        # Invalid credentials. The message deliberately does not say which of
        # the two was wrong, so it cannot be used to enumerate usernames.
        if user is None:
            return Response(
                {
                    "message": "Invalid username or password"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        return Response(
            issue_session(user, "Login successful"),
            status=status.HTTP_200_OK
        )


class RegisterView(APIView):

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "register"

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        # Raises a 400 with per-field errors if anything is invalid.
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Same token shape as login, so the user lands signed in.
        return Response(
            issue_session(user, "Registration successful"),
            status=status.HTTP_201_CREATED
        )


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            RefreshToken(serializer.validated_data["refresh"]).blacklist()
        except TokenError:
            # Expired, malformed, or already blacklisted. The session is gone
            # either way, so this is only worth reporting, not recovering from.
            return Response(
                {
                    "message": "That refresh token is no longer valid."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "message": "Logout successful"
            },
            status=status.HTTP_200_OK
        )


class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "change_password"

    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request},
        )

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # A password change has to end every other session: if the change was
        # prompted by a suspected compromise, leaving old refresh tokens live
        # would defeat the point. The caller gets a fresh pair so the device
        # doing the change stays signed in.
        revoke_all_refresh_tokens(user)

        return Response(
            issue_session(user, "Password changed successfully"),
            status=status.HTTP_200_OK
        )


class ProfileView(APIView):
    """Reads and updates the signed-in user's own profile.

    There is no user id in the URL on purpose: the account is taken from the
    token, so one user can never read or edit another's details.
    """

    permission_classes = [IsAuthenticated]

    def get_profile(self, request):
        # Accounts that predate the `Profile` table get one on first read.
        profile, _ = Profile.objects.get_or_create(user=request.user)
        return profile

    def get(self, request):

        serializer = ProfileSerializer(self.get_profile(request))

        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):

        serializer = ProfileSerializer(
            self.get_profile(request),
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
