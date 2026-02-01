from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView
from django.contrib.auth import get_user_model, authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Booking, Photographer, Portfolio, Service, Contact
from .serializers import (
    PhotographerSerializer, PortfolioSerializer, ServiceSerializer,
    ContactSerializer, BookingSerializer, BookingCreateSerializer
)
User = get_user_model()

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

class BaseRoleLoginView(APIView):
    permission_classes = [AllowAny]
    role = None

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {'error': 'Имя пользователя и пароль обязательны'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = authenticate(username=username, password=password)
        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            print(f"Ошибка аутентификации: {str(e)}")
            print(f"Детали: {error_details}")
            return Response(
                {'error': f'Ошибка аутентификации: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        if not user:
            return Response(
                {'error': 'Неверные учетные данные'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_active:
            return Response(
                {'error': 'Аккаунт неактивен'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Безопасное получение роли пользователя
        # Если пользователь является superuser, он автоматически админ
        if user.is_superuser or user.is_staff:
            user_role = 'admin'
            # Обновляем поле role для консистентности
            if getattr(user, 'role', None) != 'admin':
                user.role = 'admin'
                user.save(update_fields=['role'])
        else:
            user_role = getattr(user, 'role', None) or 'user'
            # Если роль NULL в базе, устанавливаем значение по умолчанию
            if not user_role or user_role not in ['user', 'admin']:
                user_role = 'user'
                user.role = 'user'
                user.save(update_fields=['role'])
        
        # Проверка прав доступа:
        # - superuser/staff может входить в любой раздел
        # - админы могут входить в user раздел (так как админ может всё, что может user)
        # - обычные пользователи могут входить только в user раздел
        if self.role == 'admin' and user_role != 'admin' and not (user.is_superuser or user.is_staff):
            # Только админы могут входить в admin раздел
            return Response(
                {'error': 'Недостаточно прав для входа в этот раздел'},
                status=status.HTTP_403_FORBIDDEN
            )
        # Для user раздела: superuser, staff и админы могут входить, обычные пользователи тоже

        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'role': user_role
        })


class BaseRoleRegisterView(APIView):
    permission_classes = [AllowAny]
    role = None

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
                password=password,
                role=self.role or 'user'
            )
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Пользователь успешно создан',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {'error': f'Ошибка создания пользователя: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class UserLoginView(BaseRoleLoginView):
    role = 'user'


class AdminLoginView(BaseRoleLoginView):
    role = 'admin'


class UserRegisterView(BaseRoleRegisterView):
    role = 'user'


class AdminRegisterView(BaseRoleRegisterView):
    role = 'admin'
    permission_classes = [IsAdminUser]


# API Views для фронтенда
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
    serializer_class = BookingSerializer
    pagination_class = None  # Отключаем пагинацию
    
    def get_queryset(self):
        user = self.request.user
        # Если пользователь аутентифицирован и не админ, показываем только его бронирования
        if user.is_authenticated and hasattr(user, 'role') and user.role != 'admin':
            # Ищем бронирования по полю user ИЛИ по email (для бронирований, созданных до регистрации)
            # Email более надежный идентификатор, так как обычно совпадает при регистрации
            from django.db.models import Q
            return Booking.objects.filter(
                Q(user=user) | Q(email=user.email)
            ).distinct()
        # Админы видят все бронирования
        elif user.is_authenticated and hasattr(user, 'role') and user.role == 'admin':
            return Booking.objects.all()
        # Неаутентифицированные пользователи не видят бронирования
        return Booking.objects.none()


class BookingCreateAPIView(CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Если пользователь аутентифицирован, связываем бронирование с ним
            booking = serializer.save()
            if request.user.is_authenticated:
                booking.user = request.user
                booking.save()
            return Response({
                'message': 'Бронирование успешно создано',
                'booking_id': booking.id
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingDeleteAPIView(APIView):
    def delete(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            user = request.user
            
            # Проверка прав: пользователь может удалять только свои бронирования, админ - любые
            if not user.is_authenticated:
                return Response({
                    'error': 'Требуется аутентификация'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            if hasattr(user, 'role') and user.role != 'admin' and booking.user != user:
                return Response({
                    'error': 'Недостаточно прав для удаления этого бронирования'
                }, status=status.HTTP_403_FORBIDDEN)
            
            booking.delete()
            return Response({
                'message': 'Бронирование успешно удалено'
            }, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({
                'error': 'Бронирование не найдено'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': f'Ошибка удаления: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# CRUD операции для портфолио
class PortfolioUpdateAPIView(UpdateAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAdminUser]

class PortfolioDeleteAPIView(DestroyAPIView):
    queryset = Portfolio.objects.all()
    serializer_class = PortfolioSerializer
    permission_classes = [IsAdminUser]

# CRUD операции для услуг
class ServiceUpdateAPIView(UpdateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class ServiceDeleteAPIView(DestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

# CRUD операции для контактов
class ContactUpdateAPIView(UpdateAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUser]

class ContactDeleteAPIView(DestroyAPIView):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [IsAdminUser]


@api_view(['GET'])
def api_info(request):
    """Информация о доступных API endpoints"""
    return Response({
        'message': 'API для сайта фотографа',
        'endpoints': {
            'portfolio': '/api/portfolio/',
            'services': '/api/services/',
            'contacts': '/api/contacts/',
            'bookings': '/api/bookings/',
            'booked-slots': '/api/booked-slots/',
            'login_user': '/api/login/user/',
            'login_admin': '/api/login/admin/',
            'register_user': '/api/register/user/',
            'register_admin': '/api/register/admin/',
        }
    })

@api_view(['GET'])
def current_user(request):
    """Получить информацию о текущем пользователе"""
    if not request.user.is_authenticated:
        return Response({
            'error': 'Пользователь не аутентифицирован'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    from .serializers import UserSerializer
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
