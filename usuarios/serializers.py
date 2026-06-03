from rest_framework import serializers

from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:

        model = Usuario

        fields = (
            'id',
            'username',
            'email',
            'telefone',
            'password'
        )

    def create(self, validated_data):

        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            telefone=validated_data.get('telefone'),
            password=validated_data['password']
        )

        return user