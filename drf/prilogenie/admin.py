from django.contrib import admin
from .models import Photographer, Portfolio, Service, Contact, Booking

class PhotographerAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'address')
    search_fields = ('name', 'email')
    list_filter = ('name',)

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('title', 'photographer')
    search_fields = ('title', 'photographer__name')
    list_filter = ('photographer',)

class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')
    search_fields = ('name',)
    list_filter = ('name',)

class ContactAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'address', 'social_networks')
    search_fields = ('name', 'email', 'phone', 'address')
    list_filter = ('name',)

admin.site.register(Photographer, PhotographerAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(Service, ServiceAdmin)
admin.site.register(Contact, ContactAdmin)
admin.site.register(Booking)
