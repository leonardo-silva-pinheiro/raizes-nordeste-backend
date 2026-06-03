from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):

    class TipoUsuario(models.TextChoices):

        ADMIN = 'ADMIN'
        CLIENTE = 'CLIENTE'
        FUNCIONARIO = 'FUNCIONARIO'

    telefone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.CLIENTE
    )

    def __str__(self):

        return self.username