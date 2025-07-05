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
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    service = models.CharField(max_length=100)
    date = models.DateField()
    time = models.TimeField()
    comment = models.TextField(blank=True)
