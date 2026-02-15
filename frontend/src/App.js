import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import BookingForm from "./components/BookingForm";
import Home from "./components/Home";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import UserCabinet from "./components/UserCabinet";
import AdminCabinet from "./components/AdminCabinet";
import LoginModal from "./components/LoginModal";
import LoadingIndicator from "./components/LoadingIndicator";
import Breadcrumbs from "./components/Breadcrumbs";
import apiClient from "./services/api";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

// Компонент для плавных переходов между страницами
function PageTransition({ children }) {
  const location = useLocation();
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
  }, [location.pathname]); // Отслеживаем изменение пути вместо children

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className={`page-transition ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

function Navigation({ isAuthenticated, userRole, onAuthChange }) {
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

  const handleLoginSuccess = () => {
    setShowLogin(false);
    // Проверяем состояние аутентификации после входа
    if (onAuthChange) {
      onAuthChange();
    }
  };

  const getCabinetPath = () => {
    return userRole === 'admin' ? '/admin' : '/cabinet';
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
            <div className="header-buttons">
              {!isAuthenticated ? (
                <button className="login-btn" onClick={() => setShowLogin(true)}>
                  Войти / Регистрация
                </button>
              ) : (
                <>
                  <button className="login-btn" onClick={() => handleNavigation(getCabinetPath())}>
                    {userRole === 'admin' ? 'Админ панель' : 'Кабинет'}
                  </button>
                  <button 
                    className="login-btn" 
                    onClick={() => {
                      apiClient.logout();
                      if (onAuthChange) {
                        onAuthChange();
                      }
                      navigate('/');
                    }}
                  >
                    Выйти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
    </header>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Проверяем состояние аутентификации при загрузке и при изменениях
  const checkAuth = () => {
    const authenticated = apiClient.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const currentUser = apiClient.getCurrentUser();
      setUserRole(currentUser ? currentUser.role : null);
    } else {
      setUserRole(null);
    }
  };

  useEffect(() => {
    checkAuth();
    
    // Слушаем изменения в localStorage (для синхронизации между вкладками)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken' || e.key === 'adminToken') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Слушаем кастомное событие для обновления состояния в той же вкладке
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Navigation isAuthenticated={isAuthenticated} userRole={userRole} onAuthChange={checkAuth} />
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
          <Route path="/cabinet" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <UserCabinet onLogout={() => {
                  apiClient.logout();
                  checkAuth();
                }} />
              </main>
            </PageTransition>
          } />
          <Route path="/admin" element={
            <PageTransition>
              <Breadcrumbs />
              <main>
                <AdminCabinet onLogout={() => {
                  apiClient.logout();
                  checkAuth();
                }} />
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