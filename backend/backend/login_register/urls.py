from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    ChangePasswordView,
    LoginView,
    LogoutView,
    ProfileView,
    RegisterView,
)

app_name = 'login_register'

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("register/", RegisterView.as_view(), name="register"),
    path("logout/", LogoutView.as_view(), name="logout"),
    # Trades a valid refresh token for a new pair. Rotation is on, so the
    # response carries a new `refresh` that the client must store.
    path("refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("profile/", ProfileView.as_view(), name="profile"),
]
