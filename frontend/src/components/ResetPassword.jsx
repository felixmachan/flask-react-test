import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLengthValid, setIsLengthValid] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);

  const [showMatchInfo, setShowMatchInfo] = useState(false);

  const passwordsMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!passwordsMatch) {
      setError("A jelszavak nem egyeznek.");
      return;
    }

    fetch(`http://localhost:5000/api/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        new_password: newPassword,
        confirm_password: confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMessage(data.message);
          setTimeout(() => navigate("/login"), 3000);
        }
      })
      .catch(() => setError("Hiba történt, próbáld újra később."));
  };

  const getInputClass = (value) => {
    if (!value) return "form-control";
    return passwordsMatch ? "form-control is-valid" : "form-control is-invalid";
  };

  return (
    <div className="container mt-5 col-md-6">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4 text-primary">Új jelszó megadása</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Új jelszó"
            className={getInputClass(newPassword)}
            value={newPassword}
            onChange={(e) => {
              const value = e.target.value;
              setNewPassword(value);
              setIsLengthValid(value.length >= 8);
              setHasNumber(/\d/.test(value));
              setHasUppercase(/[A-Z]/.test(value));
            }}
            onFocus={() => {
              setIsPasswordFocused(true);
              setShowMatchInfo(true);
            }}
            onBlur={() => setIsPasswordFocused(false)}
            required
          />
          <input
            type="password"
            placeholder="Jelszó megerősítése"
            className={getInputClass(confirmPassword)}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ marginTop: "10px" }}
          />
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
            <div className="password-hints mt-3">
              <p className={isLengthValid ? "text-success" : "text-danger"}>
                • Minimum 8 karakter
              </p>
              <p className={hasNumber ? "text-success" : "text-danger"}>
                • Legalább 1 szám
              </p>
              <p className={hasUppercase ? "text-success" : "text-danger"}>
                • Legalább 1 nagybetű
              </p>
            </div>
          )}

          <button type="submit" className="btn blue-bg w-100 mt-3">
            Jelszó módosítása
          </button>
        </form>

        {message && <div className="alert alert-success mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </div>
  );
}

export default ResetPassword;
