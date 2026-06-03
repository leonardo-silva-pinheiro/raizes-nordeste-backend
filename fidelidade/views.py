from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Fidelidade
from .serializers import FidelidadeSerializer


class FidelidadeViewSet(viewsets.ModelViewSet):

    queryset = Fidelidade.objects.all()

    serializer_class = FidelidadeSerializer

    permission_classes = [IsAuthenticated]