@echo off
chcp 65001 >nul
echo ========================================
echo ЗАПУСК ФРОНТЕНДА (из готовой сборки)
echo ========================================
echo.

cd frontend\build

echo Запуск HTTP сервера на порту 3000...
echo.
echo Фронтенд будет доступен по адресу: http://localhost:3000
echo.
echo Нажмите Ctrl+C для остановки сервера
echo.

REM Используем Python HTTP сервер
python -m http.server 3000

pause

