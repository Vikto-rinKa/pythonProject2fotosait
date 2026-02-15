import React, { useState, useEffect } from "react";
import apiClient from "../services/api";

const FALLBACK_IMAGES = [
  { id: 1, src: "/images/2.jpg", alt: "Семейная фотосессия", title: "Семейная фотосессия" },
  { id: 2, src: "/images/1.jpg", alt: "Портретная съемка", title: "Портретная съемка" },
  { id: 3, src: "/images/3.jpg", alt: "Пейзажи", title: "Пейзажи" },
  { id: 4, src: "/images/Logo_vsyo.png", alt: "Свадебное фото", title: "Свадебное фото" },
  { id: 5, src: "/images/Logo_vsyo.png", alt: "Мероприятия", title: "Мероприятия" },
];

function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await apiClient.getPortfolio();
        const list = Array.isArray(data) ? data : (data.results || []);
        if (list.length > 0) {
          setItems(list.map((item) => ({
            id: item.id,
            src: apiClient.getMediaUrl(item.image),
            alt: item.title || "",
            title: item.title || item.description || "",
          })));
        } else {
          setUseFallback(true);
        }
      } catch (e) {
        console.error("Ошибка загрузки портфолио:", e);
        setUseFallback(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const displayItems = useFallback || items.length === 0 ? FALLBACK_IMAGES : items;

  return (
    <div className="portfolio-content">
      <h1>Портфолио</h1>
      <p>Здесь вы можете ознакомиться с нашими лучшими работами и вдохновиться для своей фотосессии!</p>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="gallery">
          {displayItems.map((image) => (
            <div key={image.id} className="gallery-item">
              <img
                src={image.src}
                alt={image.alt}
                title={image.title}
                onClick={() => window.open(image.src, "_blank")}
                style={{ cursor: "pointer" }}
              />
              <h3>{image.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Portfolio;
