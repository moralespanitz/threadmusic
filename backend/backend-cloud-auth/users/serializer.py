from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['usuario', 'correo', 'contrasena']
        extra_kwargs = {'contrasena': {'write_only': True}}
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['usuario'],
            usuario=validated_data['usuario'],
            correo=validated_data['correo'],
            contrasena=validated_data['contrasena']
        )
        return user
