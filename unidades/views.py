from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Unidade
from .serializers import UnidadeSerializer


class UnidadeViewSet(viewsets.ModelViewSet):

    queryset = Unidade.objects.all()

    serializer_class = UnidadeSerializer

    permission_classes = [IsAuthenticated]