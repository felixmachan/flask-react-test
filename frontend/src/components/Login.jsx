import React, { useState } from "react";
import "../Login.css";
import { Link } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginButton from "./LoginWithGoogle";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // megakadályozza az alapértelmezett form submit-et (oldalfrissítés)
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        const errorMessage = data.error || "Hiba a bejelentkezés során";
        console.log(errorMessage);
        throw new Error(errorMessage || "Hiba a bejelentkezés során");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token); // token tárolása a helyi tárolóban
      console.log(data.message);
      console.log("Sikeres bejelentkezés:", data);
      navigate("/");
      window.location.reload(); // újratöltés a frissített állapotért
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Hero
        title="Belépés"
        body="Lépj be a fiókodba!"
        icon={<IoIosLogIn className="hero-icon" />}
      />
      <div className="form-wrapper-outer">
        <div className="form-wrapper d-flex justify-content-center align-items-center">
          <main className="form-signin formmain mb-3">
            <form onSubmit={handleSubmit}>
              <img
                className="mb-4 mx-auto d-block"
                src="/logo.png"
                alt=""
                width="100"
                height="100"
              />
              <h1 className="h3 mb-3 fw-normal text-center">
                Kérlek jelentkezz be!
              </h1>
              <div className="form-floating my-2">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput">Email cím</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">Jelszó</label>
              </div>
              <div className="form-check text-start my-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value="remember-me"
                  id="checkDefault"
                />
                <label className="form-check-label" htmlFor="checkDefault">
                  Emlékezz rám
                </label>
                {error && (
                  <div className="alert alert-danger text-center" role="alert">
                    {error}
                  </div>
                )}
              </div>
              <button
                className="btn btn-primary w-100 py-2 login"
                type="submit"
                disabled={loading}
              >
                {loading ? "Bejelentkezés..." : "Bejelentkezés"}
              </button>
              <Link to="/register">
                <button
                  className="btn btn-primary w-100 py-2 my-2 regist"
                  type="submit"
                >
                  Regisztráció
                </button>
              </Link>
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <GoogleLoginButton
                  mode="login"
                  className="btn btn-primary w-100 py-2 login"
                  text="Lépj be Google fiókkal"
                  setError={setError}
                />
              </GoogleOAuthProvider>
            </form>
            <div className="text-center mt-3">
              <Link to="/forgot-password">Elfelejtetted a jelszavad?</Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
