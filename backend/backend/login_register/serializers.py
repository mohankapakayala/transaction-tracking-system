from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import RegexValidator

from .models import Profile


def split_full_name(full_name):
    """Splits a display name into the pair `auth.User` stores.

    Everything after the first space is the last name, so "Ada King Lovelace"
    keeps "King Lovelace" together instead of dropping a middle name.
    """

    first_name, _, last_name = full_name.strip().partition(" ")
    return first_name, last_name


def join_full_name(user):
    return f"{user.first_name} {user.last_name}".strip()


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)



class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    # `validate` runs after all the field checks, for rules spanning two fields.
    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return attrs

    # `serializer.save()` calls this. Only runs if validation passed.
    def create(self, validated_data):
        first_name, last_name = split_full_name(validated_data["full_name"])

        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=first_name,
            last_name=last_name,
        )

class LogoutSerializer(serializers.Serializer):
    """Takes the refresh token to revoke. The access token dies on its own."""

    refresh = serializers.CharField(write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        # Proving knowledge of the current password is what stops a stolen
        # access token from being upgraded into a permanent account takeover.
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Your current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )

        if attrs["new_password"] == attrs["current_password"]:
            raise serializers.ValidationError(
                {"new_password": "The new password must differ from the current one."}
            )

        # Passing the user lets the similarity validator compare against the
        # username and email, which the field-level validator cannot do.
        # Re-raised under the field name so the form can show it in place.
        try:
            validate_password(attrs["new_password"], self.context["request"].user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"new_password": exc.messages})

        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class FullNameField(serializers.CharField):
    """Reads the display name off the related user; written back by `update`.

    `Profile` has no name column, so the plain field would look for one and
    fail on read.
    """

    def get_attribute(self, instance):
        return instance.user

    def to_representation(self, user):
        return join_full_name(user)


class ProfileSerializer(serializers.ModelSerializer):
    """The account details shown on the profile screen.

    Spans two tables: the name and email live on `auth.User`, the phone on
    `Profile`. Only `username` is read-only.
    """

    full_name = FullNameField(max_length=150)
    # The username identifies the account and stays put; the email is the
    # user's own contact address and is theirs to change.
    username = serializers.CharField(source="user.username", read_only=True)
    email = serializers.EmailField(source="user.email")

    class Meta:
        model = Profile
        fields = [
            "full_name",
            "username",
            "email",
            "work_phone",
        ]
        extra_kwargs = {
            # Deliberately permissive: numbers are written every which way
            # around the world, and rejecting a valid one is the worse failure.
            "work_phone": {
                "allow_blank": True,
                "validators": [
                    RegexValidator(
                        r"^[\d+()\-.\s]{7,}$",
                        "Enter a phone number using digits, spaces, + - ( ) or .",
                    )
                ],
            },
        }

    def validate_email(self, value):
        # The email doubles as a way to find an account, so it has to stay
        # unique. `exclude` lets the user re-save their own address unchanged.
        taken = (
            User.objects.filter(email__iexact=value)
            .exclude(pk=self.instance.user_id)
            .exists()
        )

        if taken:
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate_full_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Enter your full name.")
        return value

    def update(self, instance, validated_data):
        user = instance.user
        changed = []

        full_name = validated_data.pop("full_name", None)

        if full_name is not None:
            user.first_name, user.last_name = split_full_name(full_name)
            changed += ["first_name", "last_name"]

        # `source="user.email"` nests the value under the relation's name.
        email = validated_data.pop("user", {}).get("email")

        if email is not None:
            user.email = email
            changed.append("email")

        if changed:
            user.save(update_fields=changed)

        return super().update(instance, validated_data)
