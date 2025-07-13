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
        setBookedSlots(data);
      });
  }, []);

  const bookedDates = bookedSlots.map(slot => slot.date.split("T")[0]);
  const bookedTimesForDate = bookedSlots
    .filter(slot => slot.date.split("T")[0] === (selectedDate ? selectedDate.toISOString().split("T")[0] : ""))
    .map(slot => slot.time);
  const allTimes = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00"
  ];
  const availableTimes = allTimes.filter(time => !bookedTimesForDate.includes(time));
  const filterDate = date => {
    const dateStr = date.toISOString().split("T")[0];
    return !bookedDates.includes(dateStr);
  };

  return (
    <div className="booking-section">
      <div className="booking-left">
        <h1>Оставьте заявку и<br/>забронируйте фотосессию</h1>
      </div>
      <div className="booking-right">
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
      </div>
    </div>
  );
}

export default BookingForm;
