import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import Home from "./components/Home";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LoginModal from "./components/LoginModal";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

function Navigation() {
  const location = useLocation();
  const [showLogin, setShowLogin] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      <div className="header-bg">
        <div className="header-content">
          <div className="header-menu-row">
            <div className="header-menu">
              <ul className="menu">
                <li>
                  <Link 
                    to="/" 
                    className={isActive("/") ? "active" : ""}
                  >Главная</Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className={isActive("/about") ? "active" : ""}
                  >О себе</Link>
                </li>
                <li>
                  <Link 
                    to="/portfolio" 
                    className={isActive("/portfolio") ? "active" : ""}
                  >Портфолио</Link>
                </li>
                <li>
                  <Link 
                    to="/services" 
                    className={isActive("/services") ? "active" : ""}
                  >Услуги</Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className={isActive("/contact") ? "active" : ""}
                  >Контакты</Link>
                </li>
              </ul>
            </div>
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Войти / Регистрация
            </button>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <section className="intro">
                <h1>Запечатлейте самые яркие моменты вашей жизни вместе с нами.</h1>
                <h2>Творческий подход и профессионализм гарантированы.</h2>
              </section>
              <main>
                <Home />
                <BookingForm />
              </main>
            </>
          } />
          <Route path="/about" element={
            <main>
              <About />
            </main>
          } />
          <Route path="/portfolio" element={
            <main>
              <Portfolio />
            </main>
          } />
          <Route path="/services" element={
            <main>
              <Services />
            </main>
          } />
          <Route path="/contact" element={
            <main>
              <Contact />
            </main>
          } />
        </Routes>
        <footer>
          <p>&copy; {new Date().getFullYear()} Мой сайт</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;