from rest_framework import routers
from django.urls import include, path
from users.auth import urls as auth_urls
from .views import hello
from rest_framework.decorators import api_view

urlpatterns = [
     path('auth/', include(auth_urls)),
]