import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function AdminCabinet({ onLogout }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, есть ли токен админа в localStorage
    const adminToken = localStorage.getItem("adminToken");
    const currentUser = apiClient.getCurrentUser();
    
    if (adminToken && currentUser && currentUser.role === 'admin') {
      setIsAuthenticated(true);
      loadData();
    } else if (currentUser && currentUser.role !== 'admin') {
      // Если пользователь не админ, перенаправляем
      navigate('/cabinet');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.loginAdmin(username, password);
      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        setIsAuthenticated(true);
        loadData();
        // Очищаем поля после успешного входа
        setUsername("");
        setPassword("");
      } else {
        setError("Не удалось получить токен авторизации");
      }
    } catch (error) {
      // Показываем детальное сообщение об ошибке
      const errorMessage = error.message || "Неверные учетные данные";
      setError(errorMessage);
      console.error("Ошибка входа:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    // Вызываем callback для обновления состояния (apiClient.logout() вызывается там)
    if (onLogout) {
      onLogout();
    } else {
      // Если callback не передан, вызываем logout напрямую
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      apiClient.logout();
    }
    navigate("/");
  };

  const loadData = async () => {
    try {
      const [bookingsData, servicesData, portfolioData, contactsData] = await Promise.all([
        apiClient.getBookings(),
        apiClient.getServices(),
        apiClient.getPortfolio(),
        apiClient.getContacts()
      ]);

      setBookings(Array.isArray(bookingsData) ? bookingsData : (bookingsData.results || []));
      setServices(Array.isArray(servicesData) ? servicesData : (servicesData.results || []));
      setPortfolio(Array.isArray(portfolioData) ? portfolioData : (portfolioData.results || []));
      setContacts(Array.isArray(contactsData) ? contactsData : (contactsData.results || []));
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить эту заявку?")) {
      try {
        await apiClient.deleteBooking(id);
        setBookings(bookings.filter(b => b.id !== id));
      } catch (error) {
        console.error("Ошибка удаления заявки:", error);
      }
    }
  };

  const startEdit = (item, type) => {
    setEditingItem({ ...item, type });
    setEditForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingItem) return;

    try {
      let updatedItem;
      switch (editingItem.type) {
        case 'portfolio':
          updatedItem = await apiClient.updatePortfolio(editingItem.id, editForm);
          setPortfolio(portfolio.map(p => p.id === editingItem.id ? updatedItem : p));
          break;
        case 'service':
          updatedItem = await apiClient.updateService(editingItem.id, editForm);
          setServices(services.map(s => s.id === editingItem.id ? updatedItem : s));
          break;
        case 'contact':
          updatedItem = await apiClient.updateContact(editingItem.id, editForm);
          setContacts(contacts.map(c => c.id === editingItem.id ? updatedItem : c));
          break;
        default:
          return;
      }
      cancelEdit();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const deleteItem = async (id, type) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот элемент?")) return;

    try {
      switch (type) {
        case 'portfolio':
          await apiClient.deletePortfolio(id);
          setPortfolio(portfolio.filter(p => p.id !== id));
          break;
        case 'service':
          await apiClient.deleteService(id);
          setServices(services.filter(s => s.id !== id));
          break;
        case 'contact':
          await apiClient.deleteContact(id);
          setContacts(contacts.filter(c => c.id !== id));
          break;
      }
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="page-content">
        <div className="admin-login">
          <h1>Панель администратора</h1>
          <form onSubmit={handleLogin} className="admin-form">
            <div className="form-group">
              <label>Имя пользователя:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-field"
              />
            </div>
            <div className="form-group">
              <label>Пароль:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-field"
              />
            </div>
            {error && <div className="message error">{error}</div>}
            <button type="submit" disabled={isLoading} className="form-button">
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <button onClick={handleLogout} className="login-btn">Выйти</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === "bookings" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("bookings")}
        >
          Заявки ({bookings.length})
        </button>
        <button 
          className={activeTab === "services" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("services")}
        >
          Услуги ({services.length})
        </button>
        <button 
          className={activeTab === "portfolio" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("portfolio")}
        >
          Портфолио ({portfolio.length})
        </button>
        <button 
          className={activeTab === "contacts" ? "tab-button active" : "tab-button"}
          onClick={() => setActiveTab("contacts")}
        >
          Контакты ({contacts.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "bookings" && (
          <div className="admin-section">
            <h2>Заявки на бронирование</h2>
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3>{booking.name}</h3>
                    <button 
                      onClick={() => deleteBooking(booking.id)}
                      className="delete-btn"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="booking-details">
                    <p><strong>Услуга:</strong> {booking.service}</p>
                    <p><strong>Дата:</strong> {booking.date}</p>
                    <p><strong>Время:</strong> {booking.time}</p>
                    <p><strong>Телефон:</strong> {booking.phone}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    {booking.comment && <p><strong>Комментарий:</strong> {booking.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "services" && (
          <div className="admin-section">
            <h2>Услуги</h2>
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  {editingItem && editingItem.id === service.id && editingItem.type === 'service' ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Название услуги"
                        className="form-field"
                      />
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        placeholder="Описание услуги"
                        className="form-field"
                        rows="3"
                      />
                      <input
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                        placeholder="Цена"
                        className="form-field"
                      />
                      <div className="edit-buttons">
                        <button onClick={saveEdit} className="save-btn">Сохранить</button>
                        <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-header">
                        <h3>{service.name}</h3>
                        <div className="card-actions">
                          <button onClick={() => startEdit(service, 'service')} className="edit-btn">Редактировать</button>
                          <button onClick={() => deleteItem(service.id, 'service')} className="delete-btn">Удалить</button>
                        </div>
                      </div>
                      <p className="service-description">{service.description}</p>
                      <span className="service-price">{service.price} ₽</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "portfolio" && (
          <div className="admin-section">
            <h2>Портфолио</h2>
            <div className="portfolio-grid">
              {portfolio.map((item) => (
                <div key={item.id} className="portfolio-card">
                  {editingItem && editingItem.id === item.id && editingItem.type === 'portfolio' ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        placeholder="Название работы"
                        className="form-field"
                      />
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        placeholder="Описание работы"
                        className="form-field"
                        rows="3"
                      />
                      <div className="edit-buttons">
                        <button onClick={saveEdit} className="save-btn">Сохранить</button>
                        <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-header">
                        <h3>{item.title}</h3>
                        <div className="card-actions">
                          <button onClick={() => startEdit(item, 'portfolio')} className="edit-btn">Редактировать</button>
                          <button onClick={() => deleteItem(item.id, 'portfolio')} className="delete-btn">Удалить</button>
                        </div>
                      </div>
                      <p>{item.description}</p>
                      {item.image && (
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="portfolio-image"
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === "contacts" && (
          <div className="admin-section">
            <h2>Контакты</h2>
            <div className="contacts-grid">
              {contacts.map((contact) => (
                <div key={contact.id} className="contact-card">
                  {editingItem && editingItem.id === contact.id && editingItem.type === 'contact' ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder="Название контакта"
                        className="form-field"
                      />
                      <input
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                        placeholder="Email"
                        className="form-field"
                      />
                      <input
                        type="text"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        placeholder="Телефон"
                        className="form-field"
                      />
                      <input
                        type="text"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                        placeholder="Адрес"
                        className="form-field"
                      />
                      <textarea
                        value={editForm.social_networks || ''}
                        onChange={(e) => setEditForm({...editForm, social_networks: e.target.value})}
                        placeholder="Социальные сети"
                        className="form-field"
                        rows="2"
                      />
                      <div className="edit-buttons">
                        <button onClick={saveEdit} className="save-btn">Сохранить</button>
                        <button onClick={cancelEdit} className="cancel-btn">Отмена</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-header">
                        <h3>{contact.name}</h3>
                        <div className="card-actions">
                          <button onClick={() => startEdit(contact, 'contact')} className="edit-btn">Редактировать</button>
                          <button onClick={() => deleteItem(contact.id, 'contact')} className="delete-btn">Удалить</button>
                        </div>
                      </div>
                      <p><strong>Email:</strong> {contact.email}</p>
                      <p><strong>Телефон:</strong> {contact.phone}</p>
                      <p><strong>Адрес:</strong> {contact.address}</p>
                      {contact.social_networks && (
                        <p><strong>Социальные сети:</strong> {contact.social_networks}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCabinet;
