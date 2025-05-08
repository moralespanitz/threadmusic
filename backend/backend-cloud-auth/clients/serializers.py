from rest_framework import serializers
from .models import Cliente
from users.serializer import UserSerializer

class ClienteSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Cliente
        fields = ['id', 'user', 'nombre', 'apellido']
    
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = CustomUser.objects.create(**user_data)
        cliente = Cliente.objects.create(user=user, **validated_data)
        return cliente