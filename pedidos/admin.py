from django.contrib import admin

from .models import Pedido, ItemPedido


class ItemPedidoInline(admin.TabularInline):

    model = ItemPedido

    extra = 1

    readonly_fields = (
        'preco_unitario',
        'subtotal'
    )


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'cliente',
        'unidade',
        'canal_pedido',
        'status',
        'total',
        'criado_em'
    )

    list_filter = (
        'status',
        'canal_pedido',
        'unidade'
    )

    search_fields = (
        'cliente__username',
    )

    inlines = [ItemPedidoInline]

    def save_related(self, request, form, formsets, change):

        super().save_related(
            request,
            form,
            formsets,
            change
        )

        form.instance.atualizar_total()