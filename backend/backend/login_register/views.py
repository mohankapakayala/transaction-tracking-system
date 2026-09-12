from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer,RegisterSerializer


class LoginView(APIView):

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

        # Invalid credentials
        if user is None:
            return Response(
                {
                    "message": "Invalid username or password"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },

                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK
        )
 


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        # Raises a 400 with per-field errors if anything is invalid.
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        # Same token shape as login, so the user lands signed in.
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Registration successful",

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },

                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED
        )
