from django.db import models



class login(models.Model):
    email=models.EmailField(unique=True)
    password=models.CharField(max_length=10)

    def __str__(self):
        return self.email