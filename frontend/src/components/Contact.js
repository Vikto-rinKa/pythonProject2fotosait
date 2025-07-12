import React from "react";

function Contact() {
  return (
    <div className="container">
      <h1>Контакты</h1>
      <p>Свяжитесь со мной для заказа фотосессии.</p>
        <div class="contact-info">
            <p>Email: <a href="mailto:anya_photoamateur_public@example.com">Написать мне на email</a></p>
            <p>Телефон: <a href="tel:+79595700182">+7 959 570-01-82</a></p>
            <p>Адрес: Артёмовский район, г. Луганск</p>
            <p>Социальные сети:</p>
            <ul>
                <li><a href="https://vk.com/anya_photoamateur_public" target="_blank" rel="noopener noreferrer">VK</a></li>
                <li><a href="https://t.me/anya_photoamateur_public" target="_blank" rel="noopener noreferrer">Telegram</a></li>
            </ul>
        </div>
    </div>
  );
}
