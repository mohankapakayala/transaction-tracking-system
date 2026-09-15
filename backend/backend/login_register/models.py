from django.db import models



class login(models.Model):
    email=models.EmailField(unique=True)
    password=models.CharField(max_length=10)

    def __str__(self):
        return self.email

class Profile(models.Model):
    """The account details that do not belong on `auth.User`.

    Created on demand rather than by a signal: every read goes through
    `ProfileView`, which uses `get_or_create`, so accounts registered before
    this model existed pick one up on their first visit.
    """

    user = models.OneToOneField(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="profile",
    )
    work_phone = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return f"Profile for {self.user.username}"
