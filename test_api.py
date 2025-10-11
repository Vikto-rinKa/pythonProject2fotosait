#!/usr/bin/env python
"""
Тест API endpoints
"""
import requests
import json

def test_api():
    base_url = "http://localhost:8000"
    
    print("🧪 Тестирование API endpoints...")
    
    # Тест корневого URL
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ GET / - Статус: {response.status_code}")
        print(f"   Ответ: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    except Exception as e:
        print(f"❌ GET / - Ошибка: {e}")
    
    # Тест API info
    try:
        response = requests.get(f"{base_url}/api/")
        print(f"✅ GET /api/ - Статус: {response.status_code}")
        print(f"   Ответ: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    except Exception as e:
        print(f"❌ GET /api/ - Ошибка: {e}")
    
    # Тест услуг
    try:
        response = requests.get(f"{base_url}/api/services/")
        print(f"✅ GET /api/services/ - Статус: {response.status_code}")
        data = response.json()
        print(f"   Найдено услуг: {len(data.get('results', data))}")
        if data.get('results') or (isinstance(data, list) and data):
            print(f"   Первая услуга: {data.get('results', data)[0] if data.get('results') else data[0]}")
    except Exception as e:
        print(f"❌ GET /api/services/ - Ошибка: {e}")
    
    # Тест фотографов
    try:
        response = requests.get(f"{base_url}/api/photographers/")
        print(f"✅ GET /api/photographers/ - Статус: {response.status_code}")
        data = response.json()
        print(f"   Найдено фотографов: {len(data.get('results', data))}")
    except Exception as e:
        print(f"❌ GET /api/photographers/ - Ошибка: {e}")
    
    # Тест контактов
    try:
        response = requests.get(f"{base_url}/api/contacts/")
        print(f"✅ GET /api/contacts/ - Статус: {response.status_code}")
        data = response.json()
        print(f"   Найдено контактов: {len(data.get('results', data))}")
    except Exception as e:
        print(f"❌ GET /api/contacts/ - Ошибка: {e}")
    
    # Тест занятых слотов
    try:
        response = requests.get(f"{base_url}/api/booked-slots/")
        print(f"✅ GET /api/booked-slots/ - Статус: {response.status_code}")
        data = response.json()
        print(f"   Найдено занятых слотов: {len(data)}")
    except Exception as e:
        print(f"❌ GET /api/booked-slots/ - Ошибка: {e}")
    
    print("\n🎯 Тестирование завершено!")

if __name__ == '__main__':
    test_api()
