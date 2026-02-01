import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../services/api";
import "./Login.css";

export default function Register() {
  const [form, setForm] = useState({ 
    username: "", 
    password: "",
    email: "",
    confirmPassword: ""
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
      if (form.password.length < 8) {
        setMessage("Пароль должен содержать минимум 8 символов");
        setIsLoading(false);
        return;
      }

      if (form.password !== form.confirmPassword) {
        setMessage("Пароли не совпадают");
        setIsLoading(false);
        return;
      }

      const response = await apiClient.registerUser(form.username, form.password, form.email);
      if (response.token) {
        setMessage("Регистрация успешна! Выполняется вход...");
        setTimeout(() => {
          navigate('/cabinet');
        }, 1000);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage(error.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Регистрация</h2>
        
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
            name="email" 
            type="email"
            placeholder="Email" 
            value={form.email}
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
          
          <input 
            name="confirmPassword" 
            type="password"
            placeholder="Подтвердите пароль" 
            value={form.confirmPassword}
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="auth-input"
          />
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            Уже есть аккаунт?{" "}
            <Link to="/login" className="auth-link">
              Войти
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

