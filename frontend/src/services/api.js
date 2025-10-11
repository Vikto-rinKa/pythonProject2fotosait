const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Добавляем токен авторизации если есть
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
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
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT запрос
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE запрос
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // API методы для фотографов
  async getPhotographers() {
    return this.get('/photographers/');
  }

  async getPhotographer(id) {
    return this.get(`/photographers/${id}/`);
  }

  // API методы для портфолио
  async getPortfolio() {
    return this.get('/portfolio/');
  }

  // API методы для услуг
  async getServices() {
    return this.get('/services/');
  }

  // API методы для контактов
  async getContacts() {
    return this.get('/contacts/');
  }

  // API методы для бронирования
  async getBookings() {
    return this.get('/bookings/');
  }

  async createBooking(bookingData) {
    return this.post('/bookings/create/', bookingData);
  }

  async getBookedSlots() {
    return this.get('/booked-slots/');
  }

  // API методы для аутентификации
  async login(username, password) {
    const response = await this.post('/login/', { username, password });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user_id,
        username: response.username
      }));
    }
    return response;
  }

  async register(username, password, email) {
    const response = await this.post('/register/', { username, password, email });
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.user_id,
        username: response.username
      }));
    }
    return response;
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

// Создаем единственный экземпляр API клиента
const apiClient = new ApiClient();

export default apiClient;
