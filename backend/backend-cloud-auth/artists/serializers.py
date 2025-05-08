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
        user = CustomUser.objects.create(**user_data)
        artista = Artista.objects.create(user=user, **validated_data)
        return artista 