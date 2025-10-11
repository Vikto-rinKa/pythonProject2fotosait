from rest_framework import serializers
from .models import Photographer, Portfolio, Service, Contact, Booking
import re


class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'title', 'description', 'image', 'photographer']


class PhotographerSerializer(serializers.ModelSerializer):
    portfolios = PortfolioSerializer(many=True, read_only=True)

    class Meta:
        model = Photographer
        fields = ['id', 'name', 'email', 'phone', 'bio', 'portfolio_image', 'address', 'portfolios']

    def validate_phone(self, value):
        if not re.match(r'^\+?[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Номер телефона должен быть валидным.")
        return value


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price']


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id', 'name', 'email', 'phone', 'address', 'social_networks']


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['id', 'name', 'phone', 'email', 'service', 'date', 'time', 'comment']

    def validate_phone(self, value):
        if not re.match(r'^\+?[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Номер телефона должен быть валидным.")
        return value

    def validate_email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Email должен быть валидным.")
        return value


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['name', 'phone', 'email', 'service', 'date', 'time', 'comment']

    def validate_phone(self, value):
        if not re.match(r'^\+?[1-9]\d{1,14}$', value):
            raise serializers.ValidationError("Номер телефона должен быть валидным.")
        return value

    def validate_email(self, value):
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError("Email должен быть валидным.")
        return value
