import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../dick.css"; // vagy nevezd át, amit használsz
import { hu } from "date-fns/locale";

function DatePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `/api/available-slots?date=${formattedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    };

    fetchSlots();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <div className="datepicker-container">
        <div className="datepicker-wrapper">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
            minDate={new Date()}
            locale={hu}
          />

          <div className="datepicker-times">
            <h5 className="mb-3">Elérhető időpontok</h5>
            {availableSlots.length === 0 ? (
              <p>Nincs elérhető időpont erre a napra.</p>
            ) : (
              <div className="slot-grid">
                {availableSlots.map((slot, idx) => {
                  const isSelected = selectedSlot === slot;

                  return (
                    <div
                      key={idx}
                      className={`slot-card ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setSelectedSlot(isSelected ? null : slot);
                      }}
                    >
                      {slot}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DatePickerComponent;
