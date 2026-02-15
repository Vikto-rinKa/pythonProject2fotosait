import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

const DEFAULT_SERVICES = [
  { id: 1, name: "Фотосессии", description: "Индивидуальные и семейные фотосессии в студии или на природе", price: "2000" },
  { id: 2, name: "Свадебная съёмка", description: "Полный день съемки вашего особенного дня", price: "15000" },
  { id: 3, name: "Портретная съёмка", description: "Профессиональные портреты для резюме и социальных сетей", price: "1500" },
  { id: 4, name: "Съёмка мероприятий", description: "Корпоративы, дни рождения, выпускные и другие события", price: "5000" },
];

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiClient.getServices();
        const list = Array.isArray(data) ? data : (data.results || []);
        setServices(list.length > 0 ? list : DEFAULT_SERVICES);
      } catch (e) {
        console.error("Ошибка загрузки услуг:", e);
        setServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const formatPrice = (item) => {
    if (typeof item.price === "number" || (typeof item.price === "string" && item.price !== "")) {
      const p = Number(item.price);
      return isNaN(p) ? item.price : `от ${p.toLocaleString("ru-RU")} ₽`;
    }
    return item.price || "—";
  };

  return (
    <div className="services-content">
      <h1>Услуги</h1>
      <p>Выберите подходящую услугу для вашего особенного момента</p>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-details">
                <span className="service-price">{formatPrice(service)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Services;
