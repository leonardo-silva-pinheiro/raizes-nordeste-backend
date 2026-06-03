from django.db import models


class Unidade(models.Model):

    nome = models.CharField(max_length=100)

    cidade = models.CharField(max_length=100)

    endereco = models.CharField(max_length=255)

    telefone = models.CharField(max_length=20)

    ativa = models.BooleanField(default=True)

    def __str__(self):
        return self.nome