from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Produto
from .serializers import ProdutoSerializer


class ProdutoViewSet(viewsets.ModelViewSet):

    queryset = Produto.objects.all()

    serializer_class = ProdutoSerializer

    permission_classes = [IsAuthenticated]