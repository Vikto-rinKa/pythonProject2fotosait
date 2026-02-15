@echo off
chcp 65001 >nul
echo ========================================
echo ЗАПУСК DJANGO BACKEND СЕРВЕРА
echo ========================================
echo.

REM Проверка наличия Python
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ОШИБКА: Python не найден!
    echo Установите Python и добавьте его в PATH
    pause
    exit /b 1
)

REM Переход в директорию drf
cd /d "%~dp0drf"
if %ERRORLEVEL% NEQ 0 (
    echo ОШИБКА: Не удалось перейти в директорию drf
    pause
    exit /b 1
)

echo Текущая директория: %CD%
echo.

REM Проверка наличия manage.py
if not exist "manage.py" (
    echo ОШИБКА: Файл manage.py не найден!
    echo Убедитесь, что вы находитесь в правильной директории
    pause
    exit /b 1
)

echo Проверка установки Django...
python -c "import django; print('Django', django.get_version())" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ВНИМАНИЕ: Django не установлен или не найден
    echo Попытка установки зависимостей...
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ОШИБКА: Не удалось установить зависимости
        echo Установите их вручную: pip install -r drf\requirements.txt
        pause
        exit /b 1
    )
)

echo.
echo Проверка конфигурации Django...
python manage.py check
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ОШИБКА: Проблемы с конфигурацией Django
    echo Проверьте настройки в drf/drf/settings.py
    pause
    exit /b 1
)

echo.
echo Выполнение миграций...
python manage.py migrate
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ВНИМАНИЕ: Ошибки при выполнении миграций
    echo Попробуйте выполнить: python manage.py makemigrations
    pause
)

echo.
echo ========================================
echo Запуск сервера разработки на порту 8000...
echo ========================================
echo.
echo Backend будет доступен по адресу: http://localhost:8000
echo API будет доступен по адресу: http://localhost:8000/api/
echo Админ-панель: http://localhost:8000/admin/
echo.
echo Нажмите Ctrl+C для остановки сервера
echo.

python manage.py runserver 0.0.0.0:8000

pause

