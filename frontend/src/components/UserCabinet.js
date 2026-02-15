import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/api";

function UserCabinet() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем аутентификацию
    const currentUser = apiClient.getCurrentUser();
    if (!currentUser || currentUser.role !== 'user') {
      navigate('/');
      return;
    }
    
    setUser(currentUser);
    fetchBookings();
  }, [navigate]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiClient.getBookings();
      const list = Array.isArray(data) ? data : (data.results || []);
      setBookings(list);
    } catch (e) {
      setError(e.message || "Не удалось загрузить записи");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту запись?")) {
      return;
    }

    try {
      await apiClient.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (e) {
      setError(e.message || "Не удалось удалить запись");
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    navigate("/");
  };

  if (!user) {
    return <div className="page-content">Загрузка...</div>;
  }

  return (
    <div className="page-content">
      <div className="cabinet-header">
        <h1>Личный кабинет</h1>
        <div className="cabinet-user-info">
          <p>Добро пожаловать, <strong>{user.username}</strong>!</p>
          <button className="login-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}

      <div className="bookings-section">
        <h2>Мои записи</h2>
        {isLoading ? (
          <div>Загрузка...</div>
        ) : bookings.length === 0 ? (
          <div className="no-bookings">У вас пока нет записей.</div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((b) => (
              <div key={b.id} className="booking-card">
                <div className="booking-header">
                  <h3>{b.service}</h3>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(b.id)}
                  >
                    Удалить
                  </button>
                </div>
                <div className="booking-details">
                  <p><strong>Дата:</strong> {b.date}</p>
                  <p><strong>Время:</strong> {b.time}</p>
                  <p><strong>Имя:</strong> {b.name}</p>
                  <p><strong>Телефон:</strong> {b.phone}</p>
                  <p><strong>Email:</strong> {b.email}</p>
                  {b.comment && <p><strong>Комментарий:</strong> {b.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserCabinet;

