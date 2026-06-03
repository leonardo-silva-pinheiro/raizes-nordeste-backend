from django.db import models

from usuarios.models import Usuario
from unidades.models import Unidade
from produtos.models import Produto


class Pedido(models.Model):

    class Status(models.TextChoices):
        AGUARDANDO_PAGAMENTO = 'AGUARDANDO_PAGAMENTO'
        PAGO = 'PAGO'
        CANCELADO = 'CANCELADO'
        EM_PREPARO = 'EM_PREPARO'
        PRONTO = 'PRONTO'
        ENTREGUE = 'ENTREGUE'

    class CanalPedido(models.TextChoices):
        APP = 'APP'
        WEB = 'WEB'
        TOTEM = 'TOTEM'
        BALCAO = 'BALCAO'

    cliente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE
    )

    unidade = models.ForeignKey(
        Unidade,
        on_delete=models.CASCADE
    )

    canal_pedido = models.CharField(
        max_length=20,
        choices=CanalPedido.choices
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.AGUARDANDO_PAGAMENTO
    )

    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    criado_em = models.DateTimeField(auto_now_add=True)

    def atualizar_total(self):

        total = sum(
            item.subtotal for item in self.itens.all()
        )

        self.total = total

        self.save(update_fields=['total'])

    def __str__(self):

        return f'Pedido #{self.id}'


class ItemPedido(models.Model):

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='itens'
    )

    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE
    )

    quantidade = models.IntegerField()

    preco_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def save(self, *args, **kwargs):

        self.preco_unitario = self.produto.preco

        self.subtotal = (
            self.preco_unitario * self.quantidade
        )

        super().save(*args, **kwargs)

    def __str__(self):

        return f'{self.produto.nome}'