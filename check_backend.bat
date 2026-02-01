@echo off
chcp 65001 >nul
echo ========================================
echo ДИАГНОСТИКА DJANGO BACKEND
echo ========================================
echo.

echo 1. Проверка Python...
python --version
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Python не найден!
    goto :end
) else (
    echo [OK] Python установлен
)
echo.

echo 2. Проверка установки Django...
python -c "import django; print('[OK] Django', django.get_version(), 'установлен')" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Django не установлен
    echo.
    echo Установка зависимостей...
    cd drf
    pip install -r requirements.txt
    cd ..
) else (
    echo [OK] Django найден
)
echo.

echo 3. Проверка директории drf...
cd drf
if not exist "manage.py" (
    echo [ОШИБКА] Файл manage.py не найден!
    cd ..
    goto :end
) else (
    echo [OK] manage.py найден
)
echo.

echo 4. Проверка конфигурации Django...
python manage.py check
if %ERRORLEVEL% NEQ 0 (
    echo [ОШИБКА] Проблемы с конфигурацией
) else (
    echo [OK] Конфигурация в порядке
)
echo.

echo 5. Проверка миграций...
python manage.py showmigrations --list
echo.

:end
echo.
echo ========================================
echo Диагностика завершена
echo ========================================
pause



