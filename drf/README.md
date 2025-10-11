# Django REST Framework Backend

## Описание
Чистый API бэкенд для сайта фотографа на Django REST Framework. Предоставляет только REST API endpoints для React фронтенда. HTML шаблоны удалены - весь интерфейс реализован в React.

## Установка и запуск

### 1. Установка зависимостей
```bash
pip install -r requirements.txt
```

### 2. Быстрый запуск
```bash
python start_backend.py
```

Этот скрипт автоматически:
- Выполнит миграции
- Создаст суперпользователя (admin/admin123)
- Создаст тестовые данные
- Запустит сервер разработки

### 3. Ручной запуск
```bash
# Миграции
python manage.py makemigrations
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера
python manage.py runserver 0.0.0.0:8000
```

## API Endpoints

### Основные endpoints:
- `GET /` - Информация о сервере и ссылки
- `GET /api/` - Информация о API
- `GET /api/photographers/` - Список фотографов
- `GET /api/photographers/{id}/` - Детали фотографа
- `GET /api/portfolio/` - Портфолио
- `GET /api/services/` - Услуги
- `GET /api/contacts/` - Контактная информация
- `GET /api/bookings/` - Список бронирований
- `POST /api/bookings/create/` - Создание бронирования
- `GET /api/booked-slots/` - Занятые временные слоты

### Аутентификация:
- `POST /api/login/` - Вход в систему
- `POST /api/register/` - Регистрация

## Модели данных

### Photographer
- name (CharField) - Имя фотографа
- email (EmailField) - Email
- phone (CharField) - Телефон
- bio (TextField) - Биография
- portfolio_image (ImageField) - Фото портфолио
- address (CharField) - Адрес

### Service
- name (CharField) - Название услуги
- description (TextField) - Описание
- price (DecimalField) - Цена

### Booking
- name (CharField) - Имя клиента
- phone (CharField) - Телефон
- email (EmailField) - Email
- service (CharField) - Услуга
- date (DateField) - Дата
- time (TimeField) - Время
- comment (TextField) - Комментарий

### Contact
- name (CharField) - Имя
- email (EmailField) - Email
- phone (CharField) - Телефон
- address (CharField) - Адрес
- social_networks (TextField) - Социальные сети

## Настройки CORS

Бэкенд настроен для работы с React фронтендом:
- Разрешены запросы с localhost:3000 и localhost:3001
- Поддержка credentials
- Настроены необходимые заголовки

## Админ панель

Доступна по адресу: http://localhost:8000/admin/
- Логин: admin
- Пароль: admin123

## Структура проекта

```
drf/
├── drf/                 # Основные настройки Django
│   ├── settings.py      # Настройки проекта
│   ├── urls.py         # Главные URL маршруты
│   └── wsgi.py         # WSGI конфигурация
├── prilogenie/         # Основное приложение
│   ├── models.py       # Модели данных
│   ├── views.py        # API представления
│   ├── serializers.py  # Сериализаторы DRF
│   ├── urls.py         # API URL маршруты
│   └── admin.py        # Админ панель
├── requirements.txt    # Зависимости Python
├── start_backend.py    # Скрипт быстрого запуска
└── README.md          # Документация
```

**Примечание:** HTML шаблоны удалены. Весь интерфейс реализован в React фронтенде.

## Технологии

- Django 4.2.7
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- django-filter 23.3
- Pillow 10.1.0
- python-decouple 3.8

## Разработка

Для разработки рекомендуется:
1. Создать виртуальное окружение
2. Установить зависимости
3. Настроить переменные окружения
4. Выполнить миграции
5. Создать тестовые данные
6. Запустить сервер разработки
