from django.contrib import admin
from .models import Estoque


@admin.register(Estoque)
class EstoqueAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'produto',
        'unidade',
        'quantidade',
        'estoque_minimo',
        'status_estoque',
        'atualizado_em'
    )

    search_fields = (
        'produto__nome',
        'unidade__nome'
    )

    list_filter = (
        'unidade',
    )

    ordering = (
        'produto',
    )