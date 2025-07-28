import React from "react";

function Portfolio() {
  const portfolioImages = [
    { id: 1, src: "/images/phfoto1.png", alt: "Фотосессия 1", title: "Семейная фотосессия" },
    { id: 2, src: "/images/Screenshot_2.png", alt: "Фотосессия 2", title: "Портретная съемка" },
    { id: 3, src: "/images/Logo_vsyo.png", alt: "Логотип", title: "Корпоративная съемка" },
  ];

  return (
    <div className="portfolio-content">
      <h1>Портфолио</h1>
      <p>Здесь вы можете ознакомиться с нашими лучшими работами и вдохновиться для своей фотосессии!</p>
      
      <div className="gallery">
        {portfolioImages.map((image) => (
          <div key={image.id} className="gallery-item">
            <img 
              src={image.src} 
              alt={image.alt} 
              title={image.title}
              onClick={() => window.open(image.src, '_blank')}
              style={{ cursor: 'pointer' }}
            />
            <h3>{image.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Portfolio; 