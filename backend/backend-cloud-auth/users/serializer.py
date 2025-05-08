from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['usuario', 'correo', 'contraseña']
        extra_kwargs = {'contraseña': {'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['usuario'],
            usuario=validated_data['usuario'],
            correo=validated_data['correo'],
            contraseña=validated_data['contraseña']
        )
        return user
