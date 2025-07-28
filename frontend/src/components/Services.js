import React from "react";

function Services() {
  const services = [
    {
      id: 1,
      name: "Фотосессии",
      description: "Индивидуальные и семейные фотосессии в студии или на природе",
      price: "от 2000 ₽",
      duration: "1-2 часа"
    },
    {
      id: 2,
      name: "Свадебная съёмка",
      description: "Полный день съемки вашего особенного дня",
      price: "от 15000 ₽",
      duration: "8-12 часов"
    },
    {
      id: 3,
      name: "Портретная съёмка",
      description: "Профессиональные портреты для резюме и социальных сетей",
      price: "от 1500 ₽",
      duration: "30-60 минут"
    },
    {
      id: 4,
      name: "Съёмка мероприятий",
      description: "Корпоративы, дни рождения, выпускные и другие события",
      price: "от 5000 ₽",
      duration: "2-6 часов"
    }
  ];

  return (
    <div className="services-content">
      <h1>Услуги</h1>
      <p>Выберите подходящую услугу для вашего особенного момента</p>
      
      <div className="services-grid">
        {services.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p className="service-description">{service.description}</p>
            <div className="service-details">
              <span className="service-price">{service.price}</span>
              <span className="service-duration">{service.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services; 