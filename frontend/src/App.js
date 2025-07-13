import React from "react";
import BookingForm from "./components/BookingForm";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

function App() {
  return (
    <div className="App">
      <header className="main-header">
        <div className="header-bg">
          <div className="header-content">
            <div className="header-menu">
              <ul className="menu">
                <li><a href="#">Главная</a></li>
                <li><a href="#">О себе</a></li>
                <li><a href="#">Портфолио</a></li>
                <li><a href="#">Услуги</a></li>
                <li><a href="#">Контакты</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <section className="intro">
        <h1>Запечатлейте самые яркие моменты вашей жизни вместе с нами.</h1>
        <h2>Творческий подход и профессионализм гарантированы.</h2>
      </section>
      <main>
        <BookingForm />
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Мой сайт</p>
      </footer>
    </div>
  );
}

export default App;