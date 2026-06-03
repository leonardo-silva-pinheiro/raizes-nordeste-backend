from django.contrib import admin
from .models import Unidade


@admin.register(Unidade)
class UnidadeAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'nome',
        'cidade',
        'telefone',
        'ativa'
    )

    search_fields = (
        'nome',
        'cidade'
    )

    list_filter = (
        'ativa',
        'cidade'
    )

    ordering = (
        'nome',
    )