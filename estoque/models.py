from django.db import models

from produtos.models import Produto
from unidades.models import Unidade


class Estoque(models.Model):

    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE
    )

    unidade = models.ForeignKey(
        Unidade,
        on_delete=models.CASCADE
    )

    quantidade = models.IntegerField(default=0)

    estoque_minimo = models.IntegerField(default=5)

    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:

        unique_together = ('produto', 'unidade')

    def status_estoque(self):

        if self.quantidade <= 0:
            return 'SEM ESTOQUE'

        if self.quantidade <= self.estoque_minimo:
            return 'ESTOQUE BAIXO'

        return 'OK'

    def __str__(self):

        return f'{self.produto.nome} - {self.unidade.nome}'
    
class MovimentacaoEstoque(models.Model):

    class Tipo(models.TextChoices):

        ENTRADA = 'ENTRADA'
        SAIDA = 'SAIDA'

    estoque = models.ForeignKey(
        Estoque,
        on_delete=models.CASCADE
    )

    tipo = models.CharField(
        max_length=20,
        choices=Tipo.choices
    )

    quantidade = models.IntegerField()

    criado_em = models.DateTimeField(auto_now_add=True)

    observacao = models.TextField(
        blank=True,
        null=True
    )

    def __str__(self):

        return f'{self.tipo} - {self.quantidade}'