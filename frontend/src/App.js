import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import Home from "./components/Home";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import LoginModal from "./components/LoginModal";
import LoadingIndicator from "./components/LoadingIndicator";
import Breadcrumbs from "./components/Breadcrumbs";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

// Компонент для плавных переходов между страницами
function PageTransition({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(false);
    setIsLoading(true);
    
    const loadingTimer = setTimeout(() => setIsLoading(false), 300);
    const visibleTimer = setTimeout(() => setIsVisible(true), 350);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(visibleTimer);
    };
  }, [children]);

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={`page-transition ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    // Плавный переход к началу страницы при навигации
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/");
                    }}
                  >Главная</Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className={isActive("/about") ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/about");
                    }}
                  >О себе</Link>
                </li>
                <li>
                  <Link 
                    to="/portfolio" 
                    className={isActive("/portfolio") ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/portfolio");
                    }}
                  >Портфолио</Link>
                </li>
                <li>
                  <Link 
                    to="/services" 
                    className={isActive("/services") ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/services");
                    }}
                  >Услуги</Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className={isActive("/contact") ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation("/contact");
                    }}
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
            <PageTransition>
              <section className="intro">
                <h1>Запечатлейте самые яркие моменты вашей жизни вместе с нами.</h1>
                <h2>Творческий подход и профессионализм гарантированы.</h2>
              </section>
              <main>
                <Home />
                <BookingForm />
              </main>
            </PageTransition>
          } />
          <Route path="/about" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <About />
              </main>
            </PageTransition>
          } />
          <Route path="/portfolio" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <Portfolio />
              </main>
            </PageTransition>
          } />
          <Route path="/services" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <Services />
              </main>
            </PageTransition>
          } />
          <Route path="/contact" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <Contact />
              </main>
            </PageTransition>
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