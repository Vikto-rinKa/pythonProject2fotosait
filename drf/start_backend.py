#!/usr/bin/env python
"""
Скрипт для запуска Django бэкенда
"""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_django():
    """Настройка Django окружения"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf.settings')
    django.setup()

def run_migrations():
    """Выполнение миграций"""
    print("Выполняем миграции...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])

def create_superuser():
    """Создание суперпользователя"""
    from django.contrib.auth.models import User
    if not User.objects.filter(username='admin').exists():
        print("Создаем суперпользователя...")
        User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
        print("Суперпользователь создан: admin / admin123")
    else:
        print("Суперпользователь уже существует")

def create_sample_data():
    """Создание тестовых данных"""
    from prilogenie.models import Photographer, Service, Contact
    
    # Создаем фотографа
    if not Photographer.objects.exists():
        photographer = Photographer.objects.create(
            name="Аня Е",
            email="anya_photoamateur_public@example.com",
            phone="+79595700182",
            bio="Профессиональный фотограф с многолетним опытом работы",
            address="Артёмовский район, г. Луганск"
        )
        print("Создан фотограф:", photographer.name)
    
    # Создаем услуги
    if not Service.objects.exists():
        services_data = [
            {"name": "Фотосессии", "description": "Индивидуальные и семейные фотосессии в студии или на природе", "price": 2000},
            {"name": "Свадебная съёмка", "description": "Полный день съемки вашего особенного дня", "price": 15000},
            {"name": "Портретная съёмка", "description": "Профессиональные портреты для резюме и социальных сетей", "price": 1500},
            {"name": "Съёмка мероприятий", "description": "Корпоративы, дни рождения, выпускные и другие события", "price": 5000},
        ]
        
        for service_data in services_data:
            service = Service.objects.create(**service_data)
            print("Создана услуга:", service.name)
    
    # Создаем контактную информацию
    if not Contact.objects.exists():
        contact = Contact.objects.create(
            name="Аня Е",
            email="anya_photoamateur_public@example.com",
            phone="+79595700182",
            address="Артёмовский район, г. Луганск",
            social_networks="VK: https://vk.com/anya_photoamateur_public\nTelegram: https://t.me/anya_photoamateur_public"
        )
        print("Создана контактная информация")

def main():
    """Основная функция"""
    print("Запуск Django бэкенда...")
    
    # Настройка Django
    setup_django()
    
    # Выполнение миграций
    run_migrations()
    
    # Создание суперпользователя
    create_superuser()
    
    # Создание тестовых данных
    create_sample_data()
    
    print("\nБэкенд готов к работе!")
    print("Админ панель: http://localhost:8000/admin/")
    print("API: http://localhost:8000/api/")
    print("\nЗапускаем сервер разработки...")
    
    # Запуск сервера
    execute_from_command_line(['manage.py', 'runserver', '0.0.0.0:8000'])

if __name__ == '__main__':
    main()
