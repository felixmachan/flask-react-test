import React, { useState } from "react";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";
import "../Register.css";
import "react-datepicker/dist/react-datepicker.css";
import "../DatePickerComponent.css";
import makeAnimated from "react-select/animated";
import Creatable from "react-select/creatable";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./LoginWithGoogle";

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

function Register() {
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Példa adat küldése a backendnek
    const dataToSend = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      gender: gender,
      date_of_birth: selectedDate.toISOString().split("T")[0], // yyyy-mm-dd formátum
      complaints: complaints.map((c) => c.value), // csak a value-k kellenek
    };
    console.log("Küldött adatok:", dataToSend);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // EZ KELL a JWT sütikhez!
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const json = await response.json();
        console.log("Sikeres regisztráció:", json);
        // Itt kezelheted a sikeres regisztrációt (pl. átirányítás vagy üzenet)
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Hiba a regisztráció során");
      }
    } catch (error) {
      console.error("Hálózati hiba:", error);
    }
  };

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [complaints, setComplaints] = useState([]);
  const [gender, setGender] = useState("");
  const [showGreeting, setShowGreeting] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
        <form onSubmit={handleSubmit}>
          <div className="row">
            <label htmlFor="validationDefault01">Keresztnév</label>
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
            <label htmlFor="validationDefault02">Vezetéknév</label>
            <input
              type="text"
              className="form-control reg"
              id="validationDefault02"
              placeholder="Vezetéknév"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="row">
            <label htmlFor="gender">Nem</label>
            <select
              id="gender"
              className="form-control reg custom-select"
              required
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Válassz</option>
              <option value="Férfi">Férfi</option>
              <option value="Nő">Nő</option>
            </select>
          </div>

          <div className="row">
            <label htmlFor="validationDefaultUsername">E-mail cím</label>
            <input
              type="email"
              className="form-control reg"
              id="validationDefaultUsername"
              placeholder="E-mail cím"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="row">
            <label htmlFor="validationDefault03">Jelszó</label>
            <input
              type="password"
              className="form-control reg"
              id="validationDefault03"
              placeholder="Jelszó"
              required
              value={password}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                setIsLengthValid(value.length >= 8);
                setHasNumber(/\d/.test(value));
                setHasUppercase(/[A-Z]/.test(value));
              }}
            />
          </div>

          {isPasswordFocused && (
            <div className="password-hints">
              <p className={isLengthValid ? "valid" : "invalid"}>
                • Minimum 8 karakter
              </p>
              <p className={hasNumber ? "valid" : "invalid"}>
                • Minimum 1 szám karakter
              </p>
              <p className={hasUppercase ? "valid" : "invalid"}>
                • Minimum 1 nagybetű
              </p>
            </div>
          )}

          <div className="row">
            <label htmlFor="validationDefault05">Születési dátum</label>
            <input
              type="date"
              className="form-control reg"
              id="validationDefault05"
              value={selectedDate.toISOString().split("T")[0]} // yyyy-mm-dd
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              required
            />
          </div>

          <div className="row">
            <label htmlFor="complaints">Panaszok (nem kötelező)</label>
            <Creatable
              isMulti
              options={options}
              components={makeAnimated()}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Válassz"
              value={complaints}
              onChange={(selected) => setComplaints(selected)}
            />
            <label
              htmlFor="complaints"
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
              <label className="form-check-label" htmlFor="invalidCheck2">
                Hozzájárulok az adataim kezeléséhez és a felhasználási
                feltételekhez.
              </label>
            </div>
          </div>
          {errorMessage && (
            <div className="alert alert-danger text-center" role="alert">
              {errorMessage}
            </div>
          )}

          <button
            className="btn w-100 mt-3 mb-3 px-4 gap-3 blue-bg"
            type="submit"
            style={{ pointerEvents: "auto" }}
          >
            Regisztráció
          </button>

          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <GoogleLoginButton
              mode="register"
              className="btn btn-primary w-100 py-2 login"
              text="Regisztrálj Google fiókkal"
              setError={setErrorMessage}
            />
          </GoogleOAuthProvider>
        </form>
      </div>
    </div>
  );
}

export default Register;
