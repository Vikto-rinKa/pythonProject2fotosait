from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Booking, Photographer, Portfolio, Service, Contact
from .serializers import (
    PhotographerSerializer, PortfolioSerializer, ServiceSerializer, 
    ContactSerializer, BookingSerializer, BookingCreateSerializer
)

# Старые TemplateView удалены - теперь используется только React фронтенд

from django.http import JsonResponse

def index(request):
    """Корневой URL - перенаправляет на React приложение"""
    return JsonResponse({
        'message': 'Django REST API для сайта фотографа',
        'frontend': 'http://localhost:3000',
        'api_docs': '/api/',
        'admin': '/admin/'
    })

class BookedSlotsView(APIView):
    pagination_class = None  # Отключаем пагинацию для этого view
    
    def get(self, request):
        bookings = Booking.objects.all()
        data = [{"date": str(b.date), "time": b.time.strftime("%H:%M")} for b in bookings]
        return Response(data)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Имя пользователя и пароль обязательны'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            })
        else:
            return Response(
                {'error': 'Неверные учетные данные'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password or not email:
            return Response(
                {'error': 'Все поля обязательны'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Пользователь с таким именем уже существует'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Пользователь с таким email уже существует'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password
            )
            token = Token.objects.create(user=user)
            return Response({
                'message': 'Пользователь успешно создан',
                'token': token.key,
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Ошибка создания пользователя: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# API Views для фронтенда
class PhotographerListAPIView(ListAPIView):
    queryset = Photographer.objects.all()
    serializer_class = PhotographerSerializer
    pagination_class = None  # Отключаем пагинацию


class PhotographerDetailAPIView(RetrieveAPIView):
    queryset = Photographer.objects.all()
    serializer_class = PhotographerSerializer


class PortfolioListAPIView(ListAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    pagination_class = None  # Отключаем пагинацию


class ServiceListAPIView(ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    pagination_class = None  # Отключаем пагинацию


class ContactListAPIView(ListAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    pagination_class = None  # Отключаем пагинацию


class BookingListAPIView(ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    pagination_class = None  # Отключаем пагинацию


class BookingCreateAPIView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.save()
            return Response({
                'message': 'Бронирование успешно создано',
                'booking_id': booking.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def api_info(request):
    """Информация о доступных API endpoints"""
    return Response({
        'message': 'API для сайта фотографа',
        'endpoints': {
            'photographers': '/api/photographers/',
            'portfolio': '/api/portfolio/',
            'services': '/api/services/',
            'contacts': '/api/contacts/',
            'bookings': '/api/bookings/',
            'booked-slots': '/api/booked-slots/',
            'login': '/api/login/',
            'register': '/api/register/',
        }
    })
