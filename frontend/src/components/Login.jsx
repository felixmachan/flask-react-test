import React from "react";
import "../Login.css";
import { Link } from "react-router-dom";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";

function Login() {
  return (
    <div>
      <Hero
        title="Belépés"
        body="Lépj be a fiókodba!"
        icon={<IoIosLogIn className="hero-icon" />}
      />
      <div className="form-wrapper d-flex justify-content-center align-items-center">
        <main className="form-signin formmain mb-3">
          <form>
            <img
              className="mb-4 mx-auto d-block"
              src="../../public/logo.png"
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
              />
              <label htmlFor="floatingInput">Email cím</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
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
            </div>
            <button className="btn btn-primary w-100 py-2 login" type="submit">
              Bejelentkezés
            </button>
            <Link to="/register">
              <button
                className="btn btn-primary w-100 py-2 my-2 regist"
                type="submit"
              >
                Regisztráció
              </button>
            </Link>
          </form>
          <div className="text-center mt-3">
            <a href="#">Elfelejtetted a jelszavad?</a>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Login;
