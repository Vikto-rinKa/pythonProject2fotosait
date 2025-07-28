import React from "react";

function Contact() {
  return (
    <div className="contacts-content">
      <h1>Контакты</h1>
      <p>Свяжитесь со мной для заказа фотосессии или получения дополнительной информации.</p>
      <div className="contact-row">
        <div className="contact-card worktime-block">
          <h3>⏰ Время работы</h3>
          <p>Пн-Пт: 9:00 - 18:00</p>
          <p>Сб-Вс: 10:00 - 16:00</p>
        </div>
        <div className="contact-card">
          <h3>📧 Email</h3>
          <p><a href="mailto:anya_photoamateur_public@example.com">anya_photoamateur_public@example.com</a></p>
        </div>
      </div>
      <div className="contact-row">
        <div className="contact-card">
          <h3>🌐 Социальные сети</h3>
          <div className="social-links">
            <a href="https://vk.com/anya_photoamateur_public" target="_blank" rel="noopener noreferrer" className="social-link">
              VK
            </a>
            <a href="https://t.me/anya_photoamateur_public" target="_blank" rel="noopener noreferrer" className="social-link">
              Telegram
            </a>
          </div>
        </div>
        <div className="contact-card">
          <h3>📱 Телефон</h3>
          <p><a href="tel:+79595700182">+7 959 570-01-82</a></p>
        </div>
        <div className="contact-card">
          <h3>📍 Адрес</h3>
          <p>Артёмовский район, г. Луганск</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
