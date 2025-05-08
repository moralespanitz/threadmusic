from django.db import models
from users.models import CustomUser

# Create your models here.

class Client(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)

class Cliente(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"

