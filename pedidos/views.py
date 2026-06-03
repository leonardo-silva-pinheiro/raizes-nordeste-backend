from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import Pedido
from .serializers import PedidoSerializer


class PedidoViewSet(viewsets.ModelViewSet):

    serializer_class = PedidoSerializer

    permission_classes = [IsAuthenticated]

    queryset = Pedido.objects.all()

    def get_queryset(self):

        user = self.request.user

        if user.role == 'ADMIN':
            return Pedido.objects.all()

        return Pedido.objects.filter(cliente=user)