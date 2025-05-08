from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    usuario = models.CharField(max_length=50, unique=True)
    correo = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=100)
    
    def __str__(self):
        return self.usuario

    # TODO: Remove if is unnecessary
    company=models.CharField(max_length=100, null=False, blank=False,editable=True)