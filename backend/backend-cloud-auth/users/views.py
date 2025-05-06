from django.shortcuts import render
from rest_framework import permissions, viewsets
from rest_framework.decorators import api_view, schema
from rest_framework.response import Response

@api_view(["GET"])
@schema(None)
def hello(request):
    return Response({"Hello" : "World"})

@api_view(["POST"])
@schema(None)
def private_endpoint(request):
    pass