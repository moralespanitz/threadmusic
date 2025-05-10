from rest_framework import serializers
from .models import Artista
from users.serializer import UserSerializer
from users.models import CustomUser
from django.db import transaction

class ArtistaSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Artista
        fields = ['user', 'nombre_artistico', 'genero_principal']
        
    def create(self, validated_data):
        user_data = validated_data.pop('user')
        
        # Validate user data first without creating the user
        user_serializer = UserSerializer(data=user_data)
        if not user_serializer.is_valid():
            raise serializers.ValidationError({"user": user_serializer.errors})
        
        # Use transaction to ensure we don't create partial records
        with transaction.atomic():
            # Create user
            user = user_serializer.save()
            
            # Create artist with the user instance
            artista = Artista.objects.create(user=user, **validated_data)
            
        return artista
        
    def validate(self, attrs):
        # Additional validation if needed
        return attrs