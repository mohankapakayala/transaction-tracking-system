from django.urls import path
from .views import LoginView,RegisterView
app_name = 'login_register'

urlpatterns = [
    # Routes are added here as views are implemented, e.g.
    # path('register/', views.RegisterView.as_view(), name='register'),
        path("login/", LoginView.as_view(), name="login"),
        path("register/",RegisterView.as_view(),name="register")
]
