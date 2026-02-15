from django.urls import path
from .views import (
    index, BookedSlotsView,
    PhotographerListAPIView, PhotographerCreateAPIView,
    PortfolioListAPIView, PortfolioCreateAPIView, ServiceListAPIView, ServiceCreateAPIView,
    ContactListAPIView, ContactCreateAPIView, BookingListAPIView, BookingCreateAPIView,
    BookingDeleteAPIView, PortfolioUpdateAPIView, PortfolioDeleteAPIView, ServiceUpdateAPIView, ServiceDeleteAPIView,
    ContactUpdateAPIView, ContactDeleteAPIView, api_info, UserLoginView, AdminLoginView, UserRegisterView,
    AdminRegisterView, current_user
)

urlpatterns = [
    # Корневой URL
    path('', index, name='index'),
    
    # API Endpoints
    path('api/', api_info, name='api-info'),
    
    # Photographers (для выбора в форме портфолио)
    path('api/photographers/', PhotographerListAPIView.as_view(), name='api-photographers'),
    path('api/photographers/create/', PhotographerCreateAPIView.as_view(), name='api-photographer-create'),
    
    # Portfolio CRUD
    path('api/portfolio/', PortfolioListAPIView.as_view(), name='api-portfolio'),
    path('api/portfolio/create/', PortfolioCreateAPIView.as_view(), name='api-portfolio-create'),
    path('api/portfolio/<int:pk>/update/', PortfolioUpdateAPIView.as_view(), name='api-portfolio-update'),
    path('api/portfolio/<int:pk>/delete/', PortfolioDeleteAPIView.as_view(), name='api-portfolio-delete'),
    
    # Services CRUD
    path('api/services/', ServiceListAPIView.as_view(), name='api-services'),
    path('api/services/create/', ServiceCreateAPIView.as_view(), name='api-service-create'),
    path('api/services/<int:pk>/update/', ServiceUpdateAPIView.as_view(), name='api-service-update'),
    path('api/services/<int:pk>/delete/', ServiceDeleteAPIView.as_view(), name='api-service-delete'),
    
    # Contacts CRUD
    path('api/contacts/', ContactListAPIView.as_view(), name='api-contacts'),
    path('api/contacts/create/', ContactCreateAPIView.as_view(), name='api-contact-create'),
    path('api/contacts/<int:pk>/update/', ContactUpdateAPIView.as_view(), name='api-contact-update'),
    path('api/contacts/<int:pk>/delete/', ContactDeleteAPIView.as_view(), name='api-contact-delete'),
    
    # Bookings CRUD
    path('api/bookings/', BookingListAPIView.as_view(), name='api-bookings'),
    path('api/bookings/create/', BookingCreateAPIView.as_view(), name='api-booking-create'),
    path('api/bookings/<int:pk>/delete/', BookingDeleteAPIView.as_view(), name='api-booking-delete'),
    
    # Other endpoints
    path('api/booked-slots/', BookedSlotsView.as_view(), name='booked-slots'),
    path('api/login/user/', UserLoginView.as_view(), name='login-user'),
    path('api/login/admin/', AdminLoginView.as_view(), name='login-admin'),
    path('api/register/user/', UserRegisterView.as_view(), name='register-user'),
    path('api/register/admin/', AdminRegisterView.as_view(), name='register-admin'),
    path('api/current-user/', current_user, name='current-user'),
]