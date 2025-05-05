import React from 'react';
import "../Hero.css"
import { BsHeartPulseFill } from "react-icons/bs";
import Button from './Button';

function Hero(props) {
  console.log("Hero props:", props);
  
  // Alapértelmezett értékek a props-oknak
  const {
    icon,
    title,
    body,
    showButton = false, // Alapértelmezetten nincs gomb
    buttonText = "Időpontot foglalok", // Alapértelmezett gombszöveg
    buttonAction = () => {}, // Alapértelmezett üres függvény
  } = props;
  
  return (
    <div className="px-4 py-5 my-0 text-center container-fluid hero w-100">
      <div className="d-block mx-auto mb-4 mt-3" style={{ fontSize: "72px"}}>
        {icon}
      </div>
      <h1 className="display-5 fw-bold text-body-emphasis">{title}</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-5 mt-4">
          {body}
        </p>
        
        {/* Gomb feltételes megjelenítése */}
        {showButton && (
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button 
              type="button" 
              className="btn btn-primary btn-lg px-4 gap-3 blue-bg"
              onClick={buttonAction}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;