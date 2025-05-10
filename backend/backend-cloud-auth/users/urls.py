from rest_framework import routers
from django.urls import include, path
from users.auth import urls as auth_urls
from .views import hello, UserViewSet
from rest_framework.decorators import api_view

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
     path('auth/', include(auth_urls)),
     path('', include(router.urls)),
]