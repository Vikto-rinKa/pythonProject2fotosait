from django.urls import path
from .views import (
    index, BookedSlotsView, LoginView, RegisterView,
    PhotographerListAPIView, PhotographerDetailAPIView, PortfolioListAPIView,
    ServiceListAPIView, ContactListAPIView, BookingListAPIView, BookingCreateAPIView,
    api_info
)

urlpatterns = [
    # Корневой URL
    path('', index, name='index'),
    
    # API Endpoints
    path('api/', api_info, name='api-info'),
    path('api/photographers/', PhotographerListAPIView.as_view(), name='api-photographers'),
    path('api/photographers/<int:pk>/', PhotographerDetailAPIView.as_view(), name='api-photographer-detail'),
    path('api/portfolio/', PortfolioListAPIView.as_view(), name='api-portfolio'),
    path('api/services/', ServiceListAPIView.as_view(), name='api-services'),
    path('api/contacts/', ContactListAPIView.as_view(), name='api-contacts'),
    path('api/bookings/', BookingListAPIView.as_view(), name='api-bookings'),
    path('api/bookings/create/', BookingCreateAPIView.as_view(), name='api-booking-create'),
    path('api/booked-slots/', BookedSlotsView.as_view(), name='booked-slots'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
]