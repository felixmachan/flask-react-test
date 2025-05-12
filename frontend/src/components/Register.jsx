import React from "react";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";
import "../Register.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../DatePickerComponent.css"; // Ha külön stílust akarsz
import { hu } from "date-fns/locale"; // Magyar lokalizáció
import { useState } from "react";
import makeAnimated from "react-select/animated";
import Creatable, { useCreatable } from "react-select/creatable";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
  { value: "apple", label: "Apple" },
  { value: "orange", label: "Orange" },
  { value: "banana", label: "Banana" },
  { value: "grape", label: "Grape" },
  { value: "watermelon", label: "Watermelon" },
  { value: "kiwi", label: "Kiwi" },
  { value: "mango", label: "Mango" },
];

const MyComponent = () => <Select options={options} />;

function Register() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [firstName, setFirstName] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);

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
          <h1 className="text-center mt-2">
            {showGreeting ? (
              <>
                Szia, <span className="name-highlight">{firstName}</span>!
              </>
            ) : (
              "Regisztráció"
            )}
          </h1>
        </div>
        <form>
          <div className="row">
            <label for="validationDefault01">Keresztnév</label>
            <input
              type="text"
              className="form-control reg"
              id="validationDefault01"
              placeholder="Keresztnév"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={() => {
                if (firstName.trim() !== "") {
                  setShowGreeting(true);
                }
              }}
            />
          </div>
          <div className="row">
            <label for="validationDefault02">Vezetéknév</label>
            <input
              type="text"
              className="form-control reg"
              id="validationDefault02"
              placeholder="Vezetéknév"
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
          <div className="row">
            <label for="validationDefault05">Panaszok (nem kötelező)</label>
            <makeAnimated>
              <Creatable
                closeMenuOnSelect={false}
                components={makeAnimated()}
                isMulti
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Válassz"
                captureMenuScroll
              />
            </makeAnimated>
            <label
              for="validationDefault05"
              style={{ marginTop: "10px", marginBottom: "20px" }}
            >
              Hozzáadhatod a meglévő panaszaidat a fiókodhoz, ezzel megkönnyíted
              számomra a felkészülést a kezelésre.
            </label>
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
