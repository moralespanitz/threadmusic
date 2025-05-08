from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet
from artists.views import ArtistaViewSet
from clients.views import ClienteViewSet
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'artistas', ArtistaViewSet)
router.register(r'clientes', ClienteViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="ThreadMusic API",
        default_version='v1',
        description="API for ThreadMusic platform",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]