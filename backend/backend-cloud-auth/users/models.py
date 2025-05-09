from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    usuario = models.CharField(max_length=50, unique=True)
    correo = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=100)
    
    def __str__(self):
        return self.usuario