import React from "react";
import { useState } from "react";
import Hero from "./Hero";
import { IoPersonAdd } from "react-icons/io5";
import "../Register.css";
import "react-datepicker/dist/react-datepicker.css";
import "../DatePickerComponent.css";
import makeAnimated from "react-select/animated";
import Creatable from "react-select/creatable";
import PrevTreatment from "./PrevTreatment";
import "../Profile.css";
import { FaUserEdit } from "react-icons/fa";
import { useAuth } from "./AuthContext";

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

function Profile() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [complaints, setComplaints] = useState([]);
  const [showGreeting, setShowGreeting] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  const logout = useAuth().logout;
  const { user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Keresztnév:", firstName);
    console.log("Vezetéknév:", lastName);
    console.log("Email:", email);
    console.log("Jelszó:", password);
    console.log("Születési dátum:", selectedDate.toLocaleDateString());
    console.log("Panaszok:", complaints.map((c) => c.label).join(", "));
  };

  return (
    <div>
      <Hero
        title="Profil"
        body="Itt tudod megtekinteni és szerkeszteni a profilodat."
        icon={<FaUserEdit className="hero-icon" />}
      />
      <div className="profile-wrapper container-fluid align-items-center">
        <div className="reg-wrapper container-fluid">
          <div>
            <h1 className="text-center mt-2">Profilom</h1>
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
              <label htmlFor="validationDefaultUsername">E-mail cím</label>
              <input
                type="email"
                className="form-control reg"
                id="validationDefaultUsername"
                placeholder="E-mail cím"
                required
                value="example@example.com"
                disabled
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
                Hozzáadhatod a meglévő panaszaidat a fiókodhoz, ezzel
                megkönnyíted számomra a felkészülést a kezelésre.
              </label>
            </div>
            <div className="buttonbox">
              <button
                className="btn btn-primary btn-lg mt-4 px-4 gap-3 blue-bg button"
                type="submit"
              >
                Módosítások mentése
              </button>
              <button
                className="btn btn-secondary btn-lg mt-4 px-4 gap-3 button l"
                type="submit"
              >
                Kijelentkezés
              </button>
            </div>
          </form>
        </div>

        <div className="reg-wrapper container-fluid">
          <div>
            <h1 className="text-center mt-2 mb-5">Korábbi kezeléseim</h1>
          </div>
          <PrevTreatment
            date="2023.01.01"
            description="Hátmasszázs, BEMER terápia 16 perc asdadasd"
          />
          <PrevTreatment
            date="2023.01.01"
            description="Hátmasszázs, BEMER terápia 16 perc asdadasd"
          />
          <PrevTreatment
            date="2023.01.01"
            description="Hátmasszázs, BEMER terápia 16 perc asdadasd"
          />
          <PrevTreatment
            date="2023.01.01"
            description="Hátmasszázs, BEMER terápia 16 perc asdadasd"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
