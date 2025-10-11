#!/usr/bin/env python
"""
Создание тестовых данных для бэкенда
"""
import os
import sys
import django

# Добавляем путь к Django проекту
sys.path.append(os.path.join(os.path.dirname(__file__), 'drf'))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf.settings')
django.setup()

from prilogenie.models import Photographer, Service, Contact

def create_test_data():
    print("📊 Создание тестовых данных...")
    
    # Создаем фотографа
    photographer, created = Photographer.objects.get_or_create(
        name="Аня Е",
        defaults={
            'email': 'anya_photoamateur_public@example.com',
            'phone': '+79595700182',
            'bio': 'Профессиональный фотограф с многолетним опытом работы. Специализируюсь на семейных фотосессиях, свадебной съемке и портретах.',
            'address': 'Артёмовский район, г. Луганск'
        }
    )
    print(f"✅ Фотограф {'создан' if created else 'уже существует'}: {photographer.name}")
    
    # Создаем услуги
    services_data = [
        {
            "name": "Фотосессии", 
            "description": "Индивидуальные и семейные фотосессии в студии или на природе", 
            "price": 2000
        },
        {
            "name": "Свадебная съёмка", 
            "description": "Полный день съемки вашего особенного дня", 
            "price": 15000
        },
        {
            "name": "Портретная съёмка", 
            "description": "Профессиональные портреты для резюме и социальных сетей", 
            "price": 1500
        },
        {
            "name": "Съёмка мероприятий", 
            "description": "Корпоративы, дни рождения, выпускные и другие события", 
            "price": 5000
        },
    ]
    
    for service_data in services_data:
        service, created = Service.objects.get_or_create(
            name=service_data["name"],
            defaults=service_data
        )
        print(f"✅ Услуга {'создана' if created else 'уже существует'}: {service.name} - {service.price}₽")
    
    # Создаем контактную информацию
    contact, created = Contact.objects.get_or_create(
        name="Аня Е",
        defaults={
            'email': 'anya_photoamateur_public@example.com',
            'phone': '+79595700182',
            'address': 'Артёмовский район, г. Луганск',
            'social_networks': 'VK: https://vk.com/anya_photoamateur_public\nTelegram: https://t.me/anya_photoamateur_public'
        }
    )
    print(f"✅ Контактная информация {'создана' if created else 'уже существует'}: {contact.name}")
    
    print("\n🎯 Тестовые данные созданы успешно!")
    print("Теперь фронтенд сможет загружать данные с API.")

if __name__ == '__main__':
    create_test_data()
