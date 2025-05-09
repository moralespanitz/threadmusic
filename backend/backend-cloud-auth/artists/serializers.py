from rest_framework import serializers
from .models import Artista
from users.serializer import UserSerializer
from users.models import CustomUser

class ArtistaSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Artista
        fields = ['user', 'nombre_artistico', 'genero_principal']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        # 🔁 Mapeamos el campo 'usuario' al campo real 'username' requerido por AbstractUser
        user_data['username'] = user_data['usuario']

        user = CustomUser.objects.create(**user_data)
        artista = Artista.objects.create(user=user, **validated_data)
        return artista
