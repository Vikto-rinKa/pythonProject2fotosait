from django.views.generic import TemplateView
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from .models import Booking

class HomeView(TemplateView):
    template_name = 'prilogenie/home.html'

class AboutView(TemplateView):
    template_name = 'prilogenie/about.html'

class ContactView(TemplateView):
    template_name = 'prilogenie/contact.html'

class PortfolioView(TemplateView):
    template_name = 'prilogenie/portfolio.html'

class ServicesView(TemplateView):
    template_name = 'prilogenie/services.html'

class PhotographerList(TemplateView):
    template_name = 'prilogenie/photographers.html'

def home(request):
    return render(request, 'prilogenie/base.html')

def services(request):
    return render(request, 'prilogenie/services.html')

class BookedSlotsView(APIView):
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
