from django.contrib import admin
from .models import Fidelidade


@admin.register(Fidelidade)
class FidelidadeAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'cliente',
        'pontos'
    )

    search_fields = (
        'cliente__username',
    )

    ordering = (
        '-pontos',
    )