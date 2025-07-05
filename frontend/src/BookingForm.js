import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedService, setSelectedService] = useState("");

  // Получаем занятые слоты с бэкенда
  useEffect(() => {
    fetch("http://localhost:8000/api/booked-slots/")
      .then(res => res.json())
      .then(data => {
        console.log("bookedSlots from API:", data);
        setBookedSlots(data);
      });
  }, []);

  // Получаем список занятых дат (обрезаем время, если оно есть)
  const bookedDates = bookedSlots.map(slot => slot.date.split("T")[0]);

  // Получаем список занятых времён для выбранной даты
  const bookedTimesForDate = bookedSlots
    .filter(slot => slot.date.split("T")[0] === (selectedDate ? selectedDate.toISOString().split("T")[0] : ""))
    .map(slot => slot.time);

  // Пример доступных времён (можно сделать динамически)
  const allTimes = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];

  // Оставляем только свободные времена
  const availableTimes = allTimes.filter(time => !bookedTimesForDate.includes(time));

  // Функция для фильтрации дат
  const filterDate = date => {
    const dateStr = date.toISOString().split("T")[0];
    return !bookedDates.includes(dateStr);
  };

  return (
    <form>
      <input className="form-field" type="text" placeholder="Имя" name="name" />
      <input className="form-field" type="tel" placeholder="Телефон" name="phone" />
      <input className="form-field" type="email" placeholder="Email" name="email" />
      <select
        className="form-field"
        name="service"
        value={selectedService}
        onChange={e => setSelectedService(e.target.value)}
      >
        <option value="" disabled>Выберите услугу</option>
        <option value="photosession">Фотосессия</option>
        <option value="wedding">Свадебная съёмка</option>
        <option value="portrait">Портрет</option>
        <option value="event">Мероприятие</option>
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
      />
      <select
        className="form-field"
        name="time"
        value={selectedTime}
        onChange={e => setSelectedTime(e.target.value)}
        disabled={!selectedDate}
      >
        <option value="" disabled>Выберите время</option>
        {availableTimes.map(time => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
      <button className="form-button" type="submit">Записаться</button>
    </form>
  );
}

export default BookingForm;
