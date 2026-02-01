from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

class Photographer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    bio = models.TextField()
    portfolio_image = models.ImageField(upload_to='portfolio/', null=True, blank=True)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class CustomUserManager(UserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('role', 'user')
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'Пользователь'),
        ('admin', 'Администратор'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user', null=True, blank=True)
    
    objects = CustomUserManager()
    
    def get_role(self):
        """Безопасное получение роли с значением по умолчанию"""
        return self.role if self.role else 'user'


class Portfolio(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='portfolio/')
    photographer = models.ForeignKey(Photographer, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Service(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name

class Contact(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, default='default_phone')
    address = models.CharField(max_length=255, default='default_address')
    social_networks = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
    
class Booking(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True, related_name='bookings')
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    service = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    comment = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.name} - {self.service} ({self.date})"
