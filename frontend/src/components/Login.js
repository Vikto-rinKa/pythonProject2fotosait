import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../services/api";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({ 
    username: "", 
    password: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      const response = await apiClient.loginUser(form.username, form.password);
      if (response.token) {
        setMessage("Вход выполнен!");
        setTimeout(() => {
          navigate('/cabinet');
        }, 500);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage(error.message || "Неверные учетные данные");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Вход</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <input 
            name="username" 
            placeholder="Имя пользователя" 
            value={form.username}
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="auth-input"
          />
          
          <input 
            name="password" 
            type="password"
            placeholder="Пароль" 
            value={form.password}
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="auth-input"
          />
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            Нет аккаунта?{" "}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
        </div>
        
        {message && (
          <div className={`auth-message ${message.includes('успешн') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

