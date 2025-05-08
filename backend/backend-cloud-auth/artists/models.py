from django.db import models
from users.models import CustomUser

# Create your models here.

class Artista(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, primary_key=True)
    nombre_artistico = models.CharField(max_length=100)
    genero_principal = models.CharField(max_length=50)
    
    def __str__(self):
        return self.nombre_artistico
