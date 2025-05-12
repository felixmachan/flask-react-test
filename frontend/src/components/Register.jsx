import React from "react";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";
import "../Register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../DatePickerComponent.css"; // Ha külön stílust akarsz
import { hu } from "date-fns/locale"; // Magyar lokalizáció
import { useState } from "react";

function Register() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div>
      <Hero
        title="Regisztráció"
        body="Hozd létre a fiókodat, és foglalj időpontot két kattintással!"
        icon={<IoIosLogIn className="hero-icon" />}
      />
      <div className="reg-wrapper container-fluid">
        <div>
          <h1 className="text-center mt-2">Regisztráció</h1>
        </div>
        <form>
          <div className="row">
            <label for="validationDefault01">Keresztnév</label>
            <input
              type="text"
              className="form-control reg"
              id="validationDefault01"
              placeholder="Keresztnév"
              value=""
              required
            />
          </div>
          <div className="row">
            <label for="validationDefault02">Vezetéknév</label>
            <input
              type="text"
              className="form-control reg"
              id="validationDefault02"
              placeholder="Vezetéknév"
              value=""
              required
            />
          </div>
          <div className="row">
            <label for="validationDefaultUsername">E-mail cím</label>
            <input
              type="email"
              className="form-control reg"
              id="validationDefaultUsername"
              placeholder="E-mail cím"
              aria-describedby="inputGroupPrepend2"
              required
            />
          </div>

          <div className="row">
            <label for="validationDefault03">Jelszó</label>
            <input
              type="password"
              className="form-control reg"
              id="validationDefault03"
              placeholder="Jelszó"
              required
            />
          </div>
          <div className="row">
            <label for="validationDefault05">Születési dátum</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              locale={hu} // Magyar lokalizáció
              className="form-control reg"
            />
          </div>
          <div className="form-group">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck2"
                required
              />
              <label className="form-check-label" for="invalidCheck2">
                Agree to terms and conditions
              </label>
            </div>
          </div>
          <button
            className="btn btn-primary btn-lg mt-4 px-4 gap-3 blue-bg button"
            type="submit"
          >
            Regisztráció
          </button>
        </form>
        <div></div>
      </div>
    </div>
  );
}

export default Register;
