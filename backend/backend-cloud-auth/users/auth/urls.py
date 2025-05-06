from rest_framework.urls import urlpatterns
from django.urls import path, include
from rest_framework import routers
from .views import get_token, private_endpoint

urlpatterns = [
    path('token/', get_token, name='token'),
    path('private/', private_endpoint, name='private')
]