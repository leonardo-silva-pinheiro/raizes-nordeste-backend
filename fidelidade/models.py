from django.db import models

from usuarios.models import Usuario


class Fidelidade(models.Model):

    cliente = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE
    )

    pontos = models.IntegerField(default=0)

    atualizado_em = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.cliente.username