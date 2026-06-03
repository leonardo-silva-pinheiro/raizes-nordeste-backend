from django.contrib import admin
from .models import Produto


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'nome',
        'preco',
        'ativo'
    )

    search_fields = (
        'nome',
        'descricao'
    )

    list_filter = (
        'ativo',
    )

    ordering = (
        'nome',
    )