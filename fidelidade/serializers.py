from rest_framework import serializers

from .models import Fidelidade


class FidelidadeSerializer(serializers.ModelSerializer):

    class Meta:

        model = Fidelidade

        fields = '__all__'