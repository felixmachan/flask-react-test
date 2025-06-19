import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ConfirmEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Feldolgozás folyamatban...");
  const [success, setSuccess] = useState(null); // true / false

  useEffect(() => {
    const confirm = async () => {
      try {
        console.log("ConfirmEmail useEffect: token:", token);
        const res = await fetch(`http://localhost:5000/api/confirm/${token}`);
        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setMessage(data.message);
        } else {
          setSuccess(false);
          setMessage(data.error || "Hiba történt az aktiválás során.");
        }
      } catch (err) {
        setSuccess(false);
        setMessage("Hálózati hiba.");
      }
    };

    confirm();
  }, [token]);

  return (
    <div
      className="container text-center mt-5"
      style={{
        padding: "50px",
        borderRadius: "10px",
        backgroundColor: "#f4f6fa",
        color: "#133E87",
        maxWidth: "600px",
        margin: "80px auto",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ fontSize: "64px", marginBottom: "20px" }}>
        {success === null ? "⏳" : success ? "✅" : "❌"}
      </div>
      <h2>{message}</h2>
    </div>
  );
}

export default ConfirmEmail;
