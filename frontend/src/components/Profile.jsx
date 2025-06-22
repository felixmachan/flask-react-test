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
import { useEffect } from "react";
import { HashLoader } from "react-spinners";

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
  const [successMessage, setSuccessMessage] = useState("");

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showMatchInfo, setShowMatchInfo] = useState(false);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const logout = useAuth().logout;
  const { user } = useAuth();

  const token = localStorage.getItem("token");
  useEffect(() => {
    // Csak ha van token, akkor fetch

    if (!token) return;

    fetch("http://localhost:5000/api/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // token küldése a headerben
      },
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Nem sikerült lekérni a profil adatokat");
        return res.json();
      })
      .then((data) => {
        console.log("Profil adatok:", data);
        setFirstName(data.fname || "");
        setLastName(data.lname || "");
        setEmail(data.email || "");
        setSelectedDate(new Date(data.date_of_birth) || new Date());
        setComplaints(
          (data.complaints || []).map((c) => ({
            value: c,
            label: c,
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        // Pl. token lejárt -> kijelentkeztetés
        logout();
      });
  }, [token, logout]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    const token = localStorage.getItem("token");

    const newErrors = [];

    // Validációk
    if (password && password !== confirmPassword) {
      newErrors.push("A jelszavak nem egyeznek.");
    }
    if (password && password.length < 8) {
      newErrors.push("A jelszónak legalább 8 karakter hosszúnak kell lennie.");
    }
    if (password && !/\d/.test(password)) {
      newErrors.push("A jelszónak tartalmaznia kell számot.");
    }
    if (password && !/[A-Z]/.test(password)) {
      newErrors.push("A jelszónak tartalmaznia kell nagybetűt.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    // Ha nincs hiba:
    setErrors([]);

    const payload = {
      fname: firstName,
      lname: lastName,
      date_of_birth: selectedDate.toISOString().split("T")[0],
      complaints: complaints.map((c) => c.value),
    };

    if (password) {
      payload.password = password;
    }

    fetch("http://localhost:5000/api/change-data", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Mentés sikertelen");
        return res.json();
      })
      .then((data) => {
        setPassword("");
        setConfirmPassword("");
        setSuccessMessage("Profil sikeresen frissítve!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => {
        console.error("Hiba a mentés során:", err);
        setErrors(["Hiba történt a profil mentése során."]);
      })
      .finally(() => {
        setLoading(false);
      });
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
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "20px 0",
              }}
            >
              <HashLoader color="#608bc1" size={50} />
            </div>
          )}
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
                value={email}
                disabled
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="row">
              <label htmlFor="validationDefault03">Új jelszó</label>
              <input
                type="password"
                className="form-control reg"
                id="validationDefault03"
                placeholder="Jelszó"
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
            <div className="row">
              <label htmlFor="validationDefault04">Jelszó megerősítése</label>
              <input
                type="password"
                className="form-control reg"
                id="validationDefault04"
                placeholder="Jelszó megerősítése"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setShowMatchInfo(true)}
                onBlur={() => setShowMatchInfo(false)}
              />
            </div>
            {showMatchInfo && (
              <div className="text-center mt-2">
                <strong>Egyezés: </strong>
                {passwordsMatch ? (
                  <span className="text-success">✅</span>
                ) : (
                  <span className="text-danger">❌</span>
                )}
              </div>
            )}

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
                value={selectedDate.toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
            {successMessage && (
              <div className="alert alert-success text-center" role="alert">
                {successMessage}
              </div>
            )}
            {errors.length > 0 && (
              <div className="alert alert-danger" role="alert">
                <ul className="mb-0">
                  {errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="buttonbox">
              <button
                className="btn btn-primary btn-lg mt-4 px-4 gap-3 blue-bg button"
                type="submit"
              >
                Módosítások mentése
              </button>
              <button
                className="btn btn-secondary btn-lg mt-4 px-4 gap-3 button l"
                onClick={logout}
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
