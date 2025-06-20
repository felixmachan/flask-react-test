import React, { useState } from "react";
import { HashLoader } from "react-spinners";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    fetch("http://localhost:5000/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMessage(data.message);
        }
      })
      .catch(() => setError("Hiba történt, próbáld újra később."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mt-5 col-md-6">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary">Elfelejtett jelszó</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            required
            placeholder="Add meg az email címed"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit" className="btn blue-bg w-100">
            Visszaállító link küldése
          </button>
        </form>
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
        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default ForgotPassword;
