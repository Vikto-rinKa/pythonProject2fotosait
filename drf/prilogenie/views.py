from django.views.generic import TemplateView
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
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
