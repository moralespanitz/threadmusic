from django.contrib import admin
from django.urls import path, include
from users import urls as users_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('users/', include(users_urls))
]