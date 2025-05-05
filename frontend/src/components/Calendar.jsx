import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DatePickerComponent.css'; // Ha külön stílust akarsz
import { hu } from "date-fns/locale"; // Magyar lokalizáció

function DatePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Kiválasztott dátum:', date);
  };

  return (
    <div className="datepicker-container">
      {/* Bal oldali: Naptár */}
      <div className="datepicker-calendar">
        <h5 className="mb-3">Válassz egy dátumot</h5>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          inline
          minDate={new Date()}
          locale={hu} // Magyar lokalizáció
        />
      </div>

      {/* Jobb oldali: Időpontok (helykitöltő) */}
      <div className="datepicker-times">
        <h5 className="mb-5">Elérhető időpontok</h5>
        <p>Válassz ki egy dátumot a naptárban!</p>
        {/* Később ide jönnek az időpontok */}
      </div>
    </div>
  );
}

export default DatePickerComponent;
