from django.urls import path
from .views import HomeView, AboutView, ContactView, PortfolioView, ServicesView, PhotographerList, BookedSlotsView, LoginView, RegisterView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    path('services/', ServicesView.as_view(), name='services'),
    path('photographers/', PhotographerList.as_view(), name='photographers'),
    path('api/booked-slots/', BookedSlotsView.as_view(), name='booked-slots'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/register/', RegisterView.as_view(), name='register'),
]