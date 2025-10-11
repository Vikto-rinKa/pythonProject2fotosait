#!/usr/bin/env python
"""
Скрипт для проверки и исправления бэкенда
"""
import os
import sys
import subprocess

def run_command(command, cwd=None):
    """Выполнение команды с обработкой ошибок"""
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Команда выполнена успешно: {command}")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"❌ Ошибка выполнения команды: {command}")
            if result.stderr:
                print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Исключение при выполнении команды: {e}")
        return False

def main():
    print("🔍 Проверка и исправление бэкенда...")
    
    # Переходим в папку drf
    drf_path = os.path.join(os.getcwd(), "drf")
    if not os.path.exists(drf_path):
        print("❌ Папка drf не найдена!")
        return
    
    print(f"📁 Рабочая директория: {drf_path}")
    
    # Проверяем миграции
    print("\n🔄 Проверка миграций...")
    run_command("python manage.py makemigrations", cwd=drf_path)
    run_command("python manage.py migrate", cwd=drf_path)
    
    # Создаем суперпользователя
    print("\n👤 Создание суперпользователя...")
    run_command("python manage.py createsuperuser --username admin --email admin@example.com --noinput", cwd=drf_path)
    
    # Устанавливаем пароль для суперпользователя
    print("\n🔑 Установка пароля для суперпользователя...")
    create_superuser_script = """
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf.settings')
django.setup()

from django.contrib.auth.models import User
user, created = User.objects.get_or_create(username='admin')
user.set_password('admin123')
user.is_superuser = True
user.is_staff = True
user.save()
print(f"Суперпользователь {'создан' if created else 'обновлен'}: admin/admin123")
"""
    
    with open("temp_setup.py", "w", encoding="utf-8") as f:
        f.write(create_superuser_script)
    
    run_command("python temp_setup.py", cwd=drf_path)
    os.remove("temp_setup.py")
    
    # Создаем тестовые данные
    print("\n📊 Создание тестовых данных...")
    create_data_script = """
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'drf.settings')
django.setup()

from prilogenie.models import Photographer, Service, Contact

# Создаем фотографа
photographer, created = Photographer.objects.get_or_create(
    name="Аня Е",
    defaults={
        'email': 'anya_photoamateur_public@example.com',
        'phone': '+79595700182',
        'bio': 'Профессиональный фотограф с многолетним опытом работы',
        'address': 'Артёмовский район, г. Луганск'
    }
)
print(f"Фотограф {'создан' if created else 'уже существует'}: {photographer.name}")

# Создаем услуги
services_data = [
    {"name": "Фотосессии", "description": "Индивидуальные и семейные фотосессии в студии или на природе", "price": 2000},
    {"name": "Свадебная съёмка", "description": "Полный день съемки вашего особенного дня", "price": 15000},
    {"name": "Портретная съёмка", "description": "Профессиональные портреты для резюме и социальных сетей", "price": 1500},
    {"name": "Съёмка мероприятий", "description": "Корпоративы, дни рождения, выпускные и другие события", "price": 5000},
]

for service_data in services_data:
    service, created = Service.objects.get_or_create(
        name=service_data["name"],
        defaults=service_data
    )
    print(f"Услуга {'создана' if created else 'уже существует'}: {service.name}")

# Создаем контактную информацию
contact, created = Contact.objects.get_or_create(
    name="Аня Е",
    defaults={
        'email': 'anya_photoamateur_public@example.com',
        'phone': '+79595700182',
        'address': 'Артёмовский район, г. Луганск',
        'social_networks': 'VK: https://vk.com/anya_photoamateur_public\\nTelegram: https://t.me/anya_photoamateur_public'
    }
)
print(f"Контактная информация {'создана' if created else 'уже существует'}: {contact.name}")

print("✅ Тестовые данные созданы!")
"""
    
    with open("temp_data.py", "w", encoding="utf-8") as f:
        f.write(create_data_script)
    
    run_command("python temp_data.py", cwd=drf_path)
    os.remove("temp_data.py")
    
    print("\n🚀 Запуск сервера...")
    print("Бэкенд будет доступен по адресу: http://localhost:8000")
    print("API: http://localhost:8000/api/")
    print("Админ панель: http://localhost:8000/admin/ (admin/admin123)")
    print("\nДля остановки сервера нажмите Ctrl+C")
    
    # Запускаем сервер
    run_command("python manage.py runserver 0.0.0.0:8000", cwd=drf_path)

if __name__ == '__main__':
    main()
