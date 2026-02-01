from rest_framework import serializers
from .models import Photographer, Portfolio, Service, Contact, Booking
import re
from django.contrib.auth import authenticate, get_user_model

User = get_user_model()

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
        fields = ['id', 'user', 'name', 'phone', 'email', 'service', 'date', 'time', 'comment']

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

    def validate(self, data):
        """Валидация всего объекта бронирования"""
        from django.utils import timezone
        from datetime import datetime, time as dt_time
        
        date = data.get('date')
        time = data.get('time')
        
        # Проверка на бронирование в прошлом
        if date:
            today = timezone.now().date()
            if date < today:
                raise serializers.ValidationError({
                    'date': 'Нельзя бронировать время в прошлом.'
                })
            
            # Если дата сегодня, проверяем время
            if date == today and time:
                now = timezone.now().time()
                if time < now:
                    raise serializers.ValidationError({
                        'time': 'Нельзя бронировать время в прошлом.'
                    })
        
        # Проверка на дублирование бронирований (одно и то же время)
        if date and time:
            from .models import Booking
            existing_booking = Booking.objects.filter(date=date, time=time).first()
            if existing_booking:
                raise serializers.ValidationError({
                    'time': 'Это время уже занято. Пожалуйста, выберите другое время.'
                })
        
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")