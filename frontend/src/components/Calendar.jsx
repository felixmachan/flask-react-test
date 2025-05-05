import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DatePickerComponent.css'; // ha külön stílust akarsz
import { hu } from "date-fns/locale"; // Importálás a magyar lokalizációhoz


function DatePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Kiválasztott dátum:', date);
  };

  return (
    <div className="d-flex justify-content-center gap-5 p-4 flex-wrap">
      {/* Bal oldali: Naptár */}
      <div>
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
      <div>
        <h5 className="mb-5">Elérhető időpontok</h5>
        <p>Válassz ki egy dátumot a naptárban!</p>
        {/* Később ide jönnek az időpontok */}
      </div>
    </div>
  );
}

export default DatePickerComponent;
