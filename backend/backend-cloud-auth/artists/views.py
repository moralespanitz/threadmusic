from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Artista
from .serializers import ArtistaSerializer

# Create your views here.

class ArtistaViewSet(viewsets.ModelViewSet):
    queryset = Artista.objects.all()
    serializer_class = ArtistaSerializer
    permission_classes = [permissions.AllowAny]
