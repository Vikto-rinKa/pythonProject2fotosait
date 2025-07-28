import React, { useState } from "react";

export default function LoginModal({ onClose }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok && data.token) {
      setMessage("Вход выполнен!");
      localStorage.setItem("token", data.token);
      setTimeout(onClose, 1000);
    } else {
      setMessage("Ошибка авторизации");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Имя пользователя" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Пароль" onChange={handleChange} required />
          <button type="submit">Войти</button>
        </form>
        <div>{message}</div>
      </div>
    </div>
  );
} 