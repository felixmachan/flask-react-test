import React from "react";
import { IoIosLogIn } from "react-icons/io";
import Hero from "./Hero";

function Register() {
  return (
    <div>
      <Hero
        title="Regisztráció"
        body="Hozd létre a fiókodat, és foglalj időpontot két kattintással!"
        icon={<IoIosLogIn className="hero-icon" />}
      />
    </div>
  );
}

export default Register;
