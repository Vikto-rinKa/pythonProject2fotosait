#!/usr/bin/env python
"""
Простой тест API без внешних зависимостей
"""
import urllib.request
import json

def test_endpoint(url, name):
    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read().decode())
            print(f"✅ {name}: {response.status}")
            if isinstance(data, list):
                print(f"   Найдено записей: {len(data)}")
            elif isinstance(data, dict) and 'results' in data:
                print(f"   Найдено записей: {len(data['results'])}")
            else:
                print(f"   Данные: {data}")
            return True
    except Exception as e:
        print(f"❌ {name}: {e}")
        return False

def main():
    print("🧪 Тестирование API endpoints...")
    
    base_url = "http://localhost:8000"
    
    # Тестируем основные endpoints
    endpoints = [
        ("/", "Корневой URL"),
        ("/api/", "API Info"),
        ("/api/services/", "Услуги"),
        ("/api/photographers/", "Фотографы"),
        ("/api/contacts/", "Контакты"),
        ("/api/booked-slots/", "Занятые слоты"),
    ]
    
    for endpoint, name in endpoints:
        test_endpoint(f"{base_url}{endpoint}", name)
        print()
    
    print("🎯 Тестирование завершено!")

if __name__ == '__main__':
    main()
