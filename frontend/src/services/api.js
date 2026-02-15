// Используем переменную окружения или дефолтное значение для разработки
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const { skipAuth, headers: customHeaders, ...fetchOptions } = options;
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (!skipAuth) {
      const adminToken = localStorage.getItem('adminToken');
      const authToken = localStorage.getItem('authToken');
      const token = adminToken || authToken;

      if (token) {
        headers.Authorization = `Token ${token}`;
      }
    }

    const config = {
      headers,
      ...fetchOptions,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        // Функция для извлечения сообщения об ошибке из разных форматов Django/DRF
        const extractErrorMessage = (errorData) => {
          if (typeof errorData === 'string') {
            return errorData;
          }
          
          if (typeof errorData !== 'object' || errorData === null) {
            return `HTTP error! status: ${response.status}`;
          }

          // Стандартные форматы ошибок
          if (errorData.error) {
            return errorData.error;
          }
          
          if (errorData.detail) {
            return errorData.detail;
          }

          // Ошибки валидации полей (может быть объект с полями)
          const fieldErrors = [];
          for (const key in errorData) {
            if (Array.isArray(errorData[key])) {
              fieldErrors.push(`${key}: ${errorData[key].join(', ')}`);
            } else if (typeof errorData[key] === 'string') {
              fieldErrors.push(`${key}: ${errorData[key]}`);
            }
          }
          
          if (fieldErrors.length > 0) {
            return fieldErrors.join('; ');
          }

          // Если ничего не найдено, возвращаем общее сообщение
          return `HTTP error! status: ${response.status}`;
        };

        const message = isJson ? extractErrorMessage(data) : (typeof data === 'string' ? data : `HTTP error! status: ${response.status}`);
        throw new Error(message);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET запрос
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST запрос
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PUT запрос
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // PATCH запрос
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  // DELETE запрос
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }


  // API методы для портфолио
  async getPortfolio() {
    return this.get('/portfolio/');
  }

  async getPhotographers() {
    return this.get('/photographers/');
  }

  async createPhotographer(data) {
    return this.post('/photographers/create/', data);
  }

  async createPortfolio(formData) {
    const url = `${this.baseURL}/portfolio/create/`;
    const token = localStorage.getItem('adminToken') || localStorage.getItem('authToken');
    const headers = {};
    if (token) headers.Authorization = `Token ${token}`;
    const res = await fetch(url, { method: 'POST', headers, body: formData });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || data.detail || data.image?.[0] || `HTTP ${res.status}`);
    return data;
  }

  // API методы для услуг
  async getServices() {
    return this.get('/services/');
  }

  async createService(data) {
    return this.post('/services/create/', data);
  }

  // API методы для контактов
  async getContacts() {
    return this.get('/contacts/');
  }

  async createContact(data) {
    return this.post('/contacts/create/', data);
  }

  // API методы для бронирования
  async getBookings() {
    return this.get('/bookings/');
  }

  async createBooking(bookingData) {
    return this.post('/bookings/create/', bookingData);
  }

  async deleteBooking(id) {
    return this.delete(`/bookings/${id}/delete/`);
  }

  // Update methods
  async updatePortfolio(id, data) {
    return this.patch(`/portfolio/${id}/update/`, data);
  }

  async updateService(id, data) {
    return this.patch(`/services/${id}/update/`, data);
  }

  async updateContact(id, data) {
    return this.patch(`/contacts/${id}/update/`, data);
  }

  // Delete methods
  async deletePortfolio(id) {
    return this.delete(`/portfolio/${id}/delete/`);
  }

  async deleteService(id) {
    return this.delete(`/services/${id}/delete/`);
  }

  async deleteContact(id) {
    return this.delete(`/contacts/${id}/delete/`);
  }

  async getBookedSlots() {
    return this.get('/booked-slots/');
  }

  /** URL для медиа-файлов с бэкенда (изображения портфолио и т.д.) */
  getMediaUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const base = this.baseURL.replace(/\/api\/?$/, '');
    return `${base}${path}`;
  }

  // Вспомогательная функция для установки данных пользователя в localStorage
  _setAuthDataInLocalStorage(tokenKey, userKey, response) {
    localStorage.setItem(tokenKey, response.token);
    localStorage.setItem(userKey, JSON.stringify({
      id: response.user_id,
      username: response.username,
      role: response.role
    }));
    window.dispatchEvent(new Event('authChanged'));
  }

  // API методы для аутентификации
  async loginUser(username, password) {
    const response = await this.post('/login/user/', { username, password }, { skipAuth: true });
    if (response.token) {
      this._setAuthDataInLocalStorage('authToken', 'user', response);
    }
    return response;
  }

  async registerUser(username, password, email) {
    const response = await this.post('/register/user/', { username, password, email }, { skipAuth: true });
    if (response.token) {
      this._setAuthDataInLocalStorage('authToken', 'user', response);
    }
    return response;
  }

  async loginAdmin(username, password) {
    const response = await this.post('/login/admin/', { username, password }, { skipAuth: true });
    if (response.token) {
      this._setAuthDataInLocalStorage('adminToken', 'adminUser', response);
    }
    return response;
  }

  async registerAdmin(username, password, email) {
    const response = await this.post('/register/admin/', { username, password, email }, { skipAuth: true });
    if (response.token) {
      this._setAuthDataInLocalStorage('adminToken', 'adminUser', response);
    }
    return response;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    // Отправляем событие для обновления UI
    window.dispatchEvent(new Event('authChanged'));
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken') || !!localStorage.getItem('adminToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    const adminUser = localStorage.getItem('adminUser');
    
    // Приоритет админа, если оба токена существуют
    if (adminUser) {
      return JSON.parse(adminUser);
    }
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  async getCurrentUserFromAPI() {
    return this.get('/current-user/');
  }
}

// Создаем единственный экземпляр API клиента
const apiClient = new ApiClient();

export default apiClient;
