import React, { useState } from "react";
import apiClient from "../services/api";
import "./Login.css";

function LoginModal({ onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      if (isLogin) {
        // Логин
        const response = await apiClient.loginUser(form.username, form.password);
        if (response.token) {
          setMessage("Вход выполнен!");
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
            onClose();
          }, 500);
        }
      } else {
        // Регистрация
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

        const response = await apiClient.registerUser(
          form.username,
          form.password,
          form.email
        );
        if (response.token) {
          setMessage("Регистрация успешна! Выполняется вход...");
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess();
            }
            onClose();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Ошибка:", error);
      setMessage(error.message || (isLogin ? "Неверные учетные данные" : "Ошибка регистрации"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isLogin ? "ВХОД" : "РЕГИСТРАЦИЯ"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

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

          {!isLogin && (
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
          )}

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

          {!isLogin && (
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
          )}

          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading
              ? isLogin
                ? "Вход..."
                : "Регистрация..."
              : isLogin
              ? "Войти"
              : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin ? "Нет аккаунта? " : "Уже есть аккаунт? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
                setForm({
                  username: "",
                  password: "",
                  email: "",
                  confirmPassword: ""
                });
              }}
              className="auth-link"
              style={{ background: "none", border: "none", cursor: "pointer" }}
            >
              {isLogin ? "Зарегистрироваться" : "Войти"}
            </button>
          </p>
        </div>

        {message && (
          <div
            className={`auth-message ${
              message.includes("успешн") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;


