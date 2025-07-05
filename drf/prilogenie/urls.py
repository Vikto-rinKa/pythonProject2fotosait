from django.urls import path
from .views import HomeView, AboutView, ContactView, PortfolioView, ServicesView, PhotographerList, BookedSlotsView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('about/', AboutView.as_view(), name='about'),
    path('contact/', ContactView.as_view(), name='contact'),
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    path('services/', ServicesView.as_view(), name='services'),
    path('photographers/', PhotographerList.as_view(), name='photographers'),  # Новый путь
    path('api/booked-slots/', BookedSlotsView.as_view(), name='booked-slots'),
]