import React, { useState } from "react";
import apiClient from "../services/api";

export default function LoginModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ 
    username: "", 
    password: "", 
    email: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    try {
      if (!isLogin && form.password !== form.confirmPassword) {
        setMessage("Пароли не совпадают");
        setIsLoading(false);
        return;
      }

      let response;
      if (isLogin) {
        response = await apiClient.login(form.username, form.password);
        setMessage("Вход выполнен!");
        setTimeout(onClose, 1000);
      } else {
        response = await apiClient.register(form.username, form.password, form.email);
        setMessage("Регистрация успешна! Теперь вы можете войти.");
        setTimeout(() => {
          setIsLogin(true);
          setForm({ username: "", password: "", email: "", confirmPassword: "" });
        }, 1500);
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage(error.message || "Ошибка соединения с сервером");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setForm({ username: "", password: "", email: "", confirmPassword: "" });
  };

  return (
    <div className="modal" onClick={(e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>{isLogin ? "Вход" : "Регистрация"}</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            name="username" 
            placeholder="Имя пользователя" 
            value={form.username}
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
          
          {!isLogin && (
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={form.email}
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          )}
          
          <input 
            name="password" 
            type="password" 
            placeholder="Пароль" 
            value={form.password}
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
          
          {!isLogin && (
            <input 
              name="confirmPassword" 
              type="password" 
              placeholder="Подтвердите пароль" 
              value={form.confirmPassword}
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          )}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Загрузка..." : (isLogin ? "Войти" : "Зарегистрироваться")}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>
            {isLogin ? "Нет аккаунта?" : "Уже есть аккаунт?"}
            <button 
              type="button" 
              className="switch-btn" 
              onClick={switchMode}
              disabled={isLoading}
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>
        
        {message && (
          <div className={`message ${message.includes('успешн') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 