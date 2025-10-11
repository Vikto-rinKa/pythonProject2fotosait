# Инструкция по запуску проекта

## Описание проекта
Полнофункциональный сайт фотографа с фронтендом на React.js и бэкендом на Django REST Framework.

## Структура проекта
```
project/
├── frontend/          # React.js приложение
├── drf/              # Django REST Framework бэкенд
└── PROJECT_SETUP.md  # Эта инструкция
```

## Быстрый запуск

### 1. Запуск бэкенда (Django)
```bash
cd drf
pip install -r requirements.txt
python start_backend.py
```

Бэкенд будет доступен по адресу: http://localhost:8000

### 2. Запуск фронтенда (React)
```bash
cd frontend
npm install
npm start
```

Фронтенд будет доступен по адресу: http://localhost:3000

## Детальная настройка

### Бэкенд (Django)

#### Установка зависимостей:
```bash
cd drf
pip install -r requirements.txt
```

#### Настройка базы данных:
```bash
python manage.py makemigrations
python manage.py migrate
```

#### Создание суперпользователя:
```bash
python manage.py createsuperuser
```

#### Запуск сервера:
```bash
python manage.py runserver 0.0.0.0:8000
```

### Фронтенд (React)

#### Установка зависимостей:
```bash
cd frontend
npm install
```

#### Запуск в режиме разработки:
```bash
npm start
```

#### Сборка для продакшена:
```bash
npm run build
```

## API Endpoints

### Основные endpoints:
- `GET /api/` - Информация о API
- `GET /api/photographers/` - Список фотографов
- `GET /api/portfolio/` - Портфолио
- `GET /api/services/` - Услуги
- `GET /api/contacts/` - Контактная информация
- `GET /api/bookings/` - Список бронирований
- `POST /api/bookings/create/` - Создание бронирования
- `GET /api/booked-slots/` - Занятые временные слоты

### Аутентификация:
- `POST /api/login/` - Вход в систему
- `POST /api/register/` - Регистрация

## Функциональность

### Фронтенд:
- ✅ Плавная навигация между страницами
- ✅ Анимированные переходы
- ✅ Индикатор загрузки
- ✅ Хлебные крошки
- ✅ Форма бронирования с валидацией
- ✅ Модальное окно входа/регистрации
- ✅ Адаптивный дизайн

### Бэкенд:
- ✅ REST API для всех данных
- ✅ CORS настройки для фронтенда
- ✅ Аутентификация через токены
- ✅ Валидация данных
- ✅ Админ панель
- ✅ Автоматическое создание тестовых данных

## Админ панель

Доступна по адресу: http://localhost:8000/admin/
- Логин: admin
- Пароль: admin123

## Технологии

### Фронтенд:
- React 19.1.0
- React Router DOM 6.30.1
- React DatePicker 8.4.0
- CSS3 с анимациями

### Бэкенд:
- Django 4.2.7
- Django REST Framework 3.14.0
- django-cors-headers 4.3.1
- SQLite (для разработки)

## Возможные проблемы

### CORS ошибки:
Убедитесь, что бэкенд запущен на порту 8000, а фронтенд на порту 3000.

### Ошибки подключения к API:
Проверьте, что бэкенд запущен и доступен по адресу http://localhost:8000

### Проблемы с миграциями:
```bash
cd drf
python manage.py makemigrations
python manage.py migrate
```

## Разработка

### Добавление новых API endpoints:
1. Создайте модель в `drf/prilogenie/models.py`
2. Создайте сериализатор в `drf/prilogenie/serializers.py`
3. Создайте view в `drf/prilogenie/views.py`
4. Добавьте URL в `drf/prilogenie/urls.py`

### Добавление новых компонентов React:
1. Создайте компонент в `frontend/src/components/`
2. Добавьте маршрут в `frontend/src/App.js`
3. Обновите навигацию при необходимости

## Продакшен

### Бэкенд:
- Используйте PostgreSQL вместо SQLite
- Настройте переменные окружения
- Используйте gunicorn для запуска
- Настройте nginx для статических файлов

### Фронтенд:
- Выполните `npm run build`
- Разместите build файлы на веб-сервере
- Настройте прокси для API запросов
