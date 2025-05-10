from django.shortcuts import render, get_object_or_404
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, schema, action
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .models import CustomUser
from .serializer import UserSerializer

@swagger_auto_schema(
    method='get',
    operation_description="A simple hello world endpoint",
    responses={
        200: openapi.Response(
            description="Successful response",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'Hello': openapi.Schema(type=openapi.TYPE_STRING, example='World')
                }
            )
        )
    }
)
@api_view(["GET"])
@schema(None)
def hello(request):
    return Response({"Hello" : "World"})

@swagger_auto_schema(
    method='post',
    operation_description="Private endpoint that requires authentication",
    responses={
        200: openapi.Response(description="Successful response"),
        401: openapi.Response(description="Unauthorized")
    }
)
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
    
    @swagger_auto_schema(
        operation_description="Get user by email",
        manual_parameters=[
            openapi.Parameter(
                'email',
                openapi.IN_QUERY,
                description="Email to search for",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            200: UserSerializer,
            400: openapi.Response(description="Email parameter is required"),
            404: openapi.Response(description="User not found")
        }
    )
    @action(detail=False, methods=['get'])
    def get_by_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Email parameter is required"}, status=400)
        user = get_object_or_404(CustomUser, email=email)
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @swagger_auto_schema(
        operation_description="Delete user by email",
        manual_parameters=[
            openapi.Parameter(
                'email',
                openapi.IN_QUERY,
                description="Email of the user to delete",
                type=openapi.TYPE_STRING,
                required=True
            )
        ],
        responses={
            204: openapi.Response(description="User successfully deleted"),
            400: openapi.Response(description="Email parameter is required"),
            404: openapi.Response(description="User not found")
        }
    )
    @action(detail=False, methods=['delete'])
    def delete_by_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({"error": "Email parameter is required"}, status=400)
        user = get_object_or_404(CustomUser, email=email)
        user.delete()
        return Response(status=204)