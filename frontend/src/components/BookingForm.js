import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import apiClient from "../services/api";

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    comment: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Получаем занятые слоты и услуги с бэкенда
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookedSlotsData, servicesData] = await Promise.all([
          apiClient.getBookedSlots(),
          apiClient.getServices()
        ]);
        
        // Обрабатываем пагинированные данные от DRF
        const processedServices = Array.isArray(servicesData) 
          ? servicesData 
          : (servicesData.results || []);
        
        const processedBookedSlots = Array.isArray(bookedSlotsData) 
          ? bookedSlotsData 
          : (bookedSlotsData.results || []);
        
        setBookedSlots(processedBookedSlots);
        setServices(processedServices);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Устанавливаем пустые массивы в случае ошибки
        setBookedSlots([]);
        setServices([]);
      }
    };
    fetchData();
  }, []);

  const bookedDates = bookedSlots && bookedSlots.length > 0 
    ? bookedSlots.map(slot => slot.date.split("T")[0])
    : [];
  const bookedTimesForDate = bookedSlots && bookedSlots.length > 0
    ? bookedSlots
        .filter(slot => slot.date.split("T")[0] === (selectedDate ? selectedDate.toISOString().split("T")[0] : ""))
        .map(slot => slot.time)
    : [];
  const allTimes = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  const availableTimes = allTimes.filter(time => !bookedTimesForDate.includes(time));
  const filterDate = date => {
    const dateStr = date.toISOString().split("T")[0];
    return !bookedDates.includes(dateStr);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const bookingData = {
        ...formData,
        service: selectedService,
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
        time: selectedTime
      };

      const response = await apiClient.createBooking(bookingData);
      setSubmitMessage("Бронирование успешно создано!");
      
      // Очищаем форму
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        date: "",
        time: "",
        comment: ""
      });
      setSelectedDate(null);
      setSelectedTime("");
      setSelectedService("");

      // Обновляем список занятых слотов
      const updatedBookedSlots = await apiClient.getBookedSlots();
      setBookedSlots(updatedBookedSlots);

    } catch (error) {
      setSubmitMessage(`Ошибка: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-section">
      <div className="booking-left">
        <h1>Оставьте заявку и<br/>забронируйте фотосессию</h1>
      </div>
      <div className="booking-right">
        <form onSubmit={handleSubmit}>
          <input 
            className="form-field" 
            type="text" 
            placeholder="Имя" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input 
            className="form-field" 
            type="tel" 
            placeholder="Телефон" 
            name="phone" 
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <input 
            className="form-field" 
            type="email" 
            placeholder="Email" 
            name="email" 
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <select
            className="form-field"
            name="service"
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            required
          >
            <option value="" disabled>Выберите услугу</option>
            {services && services.length > 0 ? (
              services.map(service => (
                <option key={service.id} value={service.name}>
                  {service.name} - {service.price}₽
                </option>
              ))
            ) : (
              <option value="" disabled>Загрузка услуг...</option>
            )}
          </select>
          <DatePicker
            className="form-field"
            selected={selectedDate}
            onChange={date => {
              setSelectedDate(date);
              setSelectedTime("");
            }}
            placeholderText="Выберите дату"
            dateFormat="yyyy-MM-dd"
            filterDate={filterDate}
            minDate={new Date()}
            required
          />
          <select
            className="form-field"
            name="time"
            value={selectedTime}
            onChange={e => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
            required
          >
            <option value="" disabled>Выберите время</option>
            {availableTimes.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <textarea
            className="form-field"
            placeholder="Комментарий (необязательно)"
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            rows="3"
          />
          <button 
            className="form-button" 
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Записаться"}
          </button>
          {submitMessage && (
            <div className={`message ${submitMessage.includes("Ошибка") ? "error" : "success"}`}>
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookingForm;
