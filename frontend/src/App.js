import React, { useState } from "react";
import BookingForm from "./components/BookingForm";
import Home from "./components/Home";
import About from "./components/About";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import Contact from "./components/Contact";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home />;
      case "about":
        return <About />;
      case "portfolio":
        return <Portfolio />;
      case "services":
        return <Services />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="App">
      <header className="main-header">
        <div className="header-bg">
          <div className="header-content">
            <div className="header-menu">
              <ul className="menu">
                <li><a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleTabClick("home"); }}
                  className={activeTab === "home" ? "active" : ""}
                >Главная</a></li>
                <li><a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleTabClick("about"); }}
                  className={activeTab === "about" ? "active" : ""}
                >О себе</a></li>
                <li><a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleTabClick("portfolio"); }}
                  className={activeTab === "portfolio" ? "active" : ""}
                >Портфолио</a></li>
                <li><a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleTabClick("services"); }}
                  className={activeTab === "services" ? "active" : ""}
                >Услуги</a></li>
                <li><a 
                  href="#" 
                  onClick={(e) => { e.preventDefault(); handleTabClick("contact"); }}
                  className={activeTab === "contact" ? "active" : ""}
                >Контакты</a></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      {activeTab === "home" && (
        <section className="intro">
          <h1>Запечатлейте самые яркие моменты вашей жизни вместе с нами.</h1>
          <h2>Творческий подход и профессионализм гарантированы.</h2>
        </section>
      )}
      <main>
        {renderContent()}
        {activeTab === "home" && <BookingForm />}
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Мой сайт</p>
      </footer>
    </div>
  );
}

export default App;