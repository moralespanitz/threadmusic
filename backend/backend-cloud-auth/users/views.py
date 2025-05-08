from django.shortcuts import render
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, schema
from rest_framework.response import Response
from .models import CustomUser
from .serializer import UserSerializer

@api_view(["GET"])
@schema(None)
def hello(request):
    return Response({"Hello" : "World"})

@api_view(["POST"])
@schema(None)
def private_endpoint(request):
    pass

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return super().get_permissions()