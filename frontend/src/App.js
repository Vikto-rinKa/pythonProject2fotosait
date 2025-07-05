import React from "react";
import BookingForm from "./BookingForm";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Добро пожаловать на наш сайт!</h1>
        {/* Здесь можно добавить навигацию */}
      </header>
      <main>
        <p>Это ваш новый фронтенд на React.</p>
        {/* Здесь будут ваши компоненты и страницы */}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Все права защищены.</p>
      </footer>
      <BookingForm />
    </div>
  );
}

export default App;