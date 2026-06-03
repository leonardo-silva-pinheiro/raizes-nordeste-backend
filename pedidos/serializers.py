from rest_framework import serializers

from .models import Pedido, ItemPedido

from estoque.models import Estoque


class ItemPedidoSerializer(serializers.ModelSerializer):

    class Meta:

        model = ItemPedido

        fields = (
            'id',
            'produto',
            'quantidade',
            'preco_unitario',
            'subtotal'
        )

        read_only_fields = (
            'preco_unitario',
            'subtotal'
        )


class PedidoSerializer(serializers.ModelSerializer):

    itens = ItemPedidoSerializer(many=True)

    class Meta:

        model = Pedido

        fields = '__all__'

    def create(self, validated_data):

        itens_data = validated_data.pop('itens')

        pedido = Pedido.objects.create(**validated_data)

        total = 0

        for item_data in itens_data:

            produto = item_data['produto']

            quantidade = item_data['quantidade']

            estoque = Estoque.objects.filter(
                produto=produto,
                unidade=pedido.unidade
            ).first()

            if not estoque:

                raise serializers.ValidationError(
                    f'Sem estoque para {produto.nome}'
                )

            if estoque.quantidade < quantidade:

                raise serializers.ValidationError(
                    f'Estoque insuficiente para {produto.nome}'
                )

            estoque.quantidade -= quantidade

            estoque.save()

            preco_unitario = produto.preco

            subtotal = preco_unitario * quantidade

            ItemPedido.objects.create(
                pedido=pedido,
                produto=produto,
                quantidade=quantidade,
                preco_unitario=preco_unitario,
                subtotal=subtotal
            )

            total += subtotal

        pedido.total = total

        pedido.save()

        return pedido

    def update(self, instance, validated_data):

        status_anterior = instance.status

        novo_status = validated_data.get(
            'status',
            instance.status
        )

        pedido = super().update(
            instance,
            validated_data
        )

        if (
            status_anterior != 'CANCELADO'
            and novo_status == 'CANCELADO'
        ):

            for item in pedido.itens.all():

                estoque = Estoque.objects.filter(
                    produto=item.produto,
                    unidade=pedido.unidade
                ).first()

                if estoque:

                    estoque.quantidade += item.quantidade

                    estoque.save()

        return pedido