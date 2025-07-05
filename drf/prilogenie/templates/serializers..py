from rest_framework import serializers
from .models import Photographer, Portfolio,Contact,About,Services
import re


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'image']


class PhotographerSerializer(serializers.ModelSerializer):
    portfolios = PortfolioSerializer(many=True, read_only=True)

    class Meta:
        model = Photographer
        fields = ['id', 'name', 'email', 'phone', 'bio', 'portfolio_image', 'portfolios']

    def validate_phone(self, value):
        if not re.match(r'^\+?[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Номер телефона должен быть валидным.")
        return value
