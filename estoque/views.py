from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Estoque
from .serializers import EstoqueSerializer


class EstoqueViewSet(viewsets.ModelViewSet):

    queryset = Estoque.objects.all()

    serializer_class = EstoqueSerializer

    permission_classes = [IsAuthenticated]


    def perform_create(self, serializer):

        produto = serializer.validated_data['produto']
        unidade = serializer.validated_data['unidade']
        quantidade = serializer.validated_data['quantidade']

        estoque_existente = Estoque.objects.filter(
            produto=produto,
            unidade=unidade
        ).first()

        if estoque_existente:

            estoque_existente.quantidade += quantidade
            estoque_existente.save()

        else:

            serializer.save()