import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../dick.css"; // ha van saját stílusod
import "../DayPicker.css"; // ha van saját DayPicker stílusod
import Hero from "./Hero.jsx";
import { MdMoreTime } from "react-icons/md";

function DatePickerComponent() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null); // bejelentkezett user
  const [error, setError] = useState(""); // hibakezeléshez

  const [note, setNote] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Lekérjük a user adatokat
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5000/api/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.warn("Token érvénytelen vagy lejárt:", res.status);
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Nem sikerült lekérni a usert:", err);
      }
    };

    fetchUser();
  }, []);

  // Dátum formázás magyarosan
  const formatDate = (date) => {
    return date
      ? new Intl.DateTimeFormat("hu-HU", {
          month: "long",
          day: "numeric",
        }).format(date)
      : "Válassz egy dátumot";
  };

  // Foglalható időpontok lekérése
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await fetch(
        `/api/available-slots?date=${formattedDate}`
      );
      const data = await response.json();
      setAvailableSlots(data);
    };

    fetchSlots();
  }, [selectedDate]);

  // Slotok szétbontása délelőtt/délután
  const morningSlots = availableSlots.filter(
    (t) => parseInt(t.split(":")[0]) < 12
  );
  const afternoonSlots = availableSlots.filter(
    (t) => parseInt(t.split(":")[0]) >= 12
  );

  // Foglalás végpont hívás
  const handleBooking = async () => {
    setError(""); // minden próbálkozás előtt töröljük az előző hibát

    if (!selectedDate || !selectedSlot) {
      setError("Válassz ki egy dátumot és időpontot!");
      return;
    }

    if (!user && (!name.trim() || !email.trim() || !phone.trim())) {
      setError("Kérlek, töltsd ki a nevet, emailt és telefonszámot!");
      return;
    }

    const payload = {
      date: selectedDate.toISOString().split("T")[0],
      time: selectedSlot,
      note,
      ...(user
        ? {}
        : { name: name.trim(), email: email.trim(), phone: phone.trim() }),
    };

    try {
      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setError(""); // siker esetén töröljük a hibát
        setSelectedSlot(null);
        setNote("");
        setName("");
        setEmail("");
        setPhone("");
        // opcionálisan kiírhatsz egy sikerüzenetet is itt, de nem kötelező
      } else {
        setError(data.error || "Hiba történt a foglalás során.");
      }
    } catch (err) {
      console.error("Hiba a foglalásnál:", err);
      setError("Hálózati hiba történt.");
    }
  };

  return (
    <div>
      <Hero
        title="Időpontfoglalás"
        body="Válaszd ki a számodra legmegfelelőbb időpontot!"
        icon={<MdMoreTime className="hero-icon" />}
      />
      <div className="datepicker-container">
        <div className="row wrapper">
          <div className="col-lg-5 col-md-6 datepick-col">
            <div className="daypicker-wrapper">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={{ before: new Date() }}
                locale="hu"
              />
            </div>
          </div>

          <div className="col-lg-7 col-md-6 mb-4 mt-5">
            <h5 className="mb-3">{formatDate(selectedDate)}</h5>

            {availableSlots.length === 0 ? (
              <p>Nincs elérhető időpont erre a napra.</p>
            ) : (
              <>
                {morningSlots.length > 0 && (
                  <>
                    <h6>Délelőtt</h6>
                    <div className="slot-grid mb-3">
                      {morningSlots.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`slot-card ${
                            selectedSlot === slot ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedSlot((prev) =>
                              prev === slot ? null : slot
                            )
                          }
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {afternoonSlots.length > 0 && (
                  <>
                    <h6>Délután</h6>
                    <div className="slot-grid">
                      {afternoonSlots.map((slot, idx) => (
                        <div
                          key={idx}
                          className={`slot-card ${
                            selectedSlot === slot ? "selected" : ""
                          }`}
                          onClick={() =>
                            setSelectedSlot((prev) =>
                              prev === slot ? null : slot
                            )
                          }
                        >
                          {slot}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          {/* Foglalási űrlap kiválasztott időpont után */}
          {selectedSlot && (
            <div className="booking-form mt-4 p-3 border rounded bg-light">
              <h6>Foglalás összefoglaló</h6>
              <p>
                <strong>Dátum:</strong> {formatDate(selectedDate)}
              </p>
              <p>
                <strong>Időpont:</strong> {selectedSlot}
              </p>

              {!user && (
                <>
                  <div className="mb-2">
                    <label>Név</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ width: "40%" }}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ width: "40%" }}
                    />
                  </div>
                  <div className="mb-2">
                    <label>Telefonszám</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ width: "40%" }}
                    />
                  </div>
                </>
              )}

              <div className="mb-2">
                <label>Megjegyzés</label>
                <textarea
                  className="form-control"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  style={{ width: "40%" }}
                />
              </div>

              <button className="btn btn-primary" onClick={handleBooking}>
                Foglalás megerősítése
              </button>

              {/* Hibaszöveg piros színnel */}
              {error && (
                <div
                  className="alert alert-danger text-center mt-3"
                  role="alert"
                  style={{ width: "30%" }}
                >
                  {error}
                </div>
              )}

              {!user && (
                <div className="mt-3">
                  <small>
                    Már van fiókod? <a href="/login">Jelentkezz be</a> vagy{" "}
                    <a href="/register">regisztrálj</a>.
                  </small>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DatePickerComponent;
