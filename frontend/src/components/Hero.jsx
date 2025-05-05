import React from 'react';
import "../Hero.css"
import { BsHeartPulseFill } from "react-icons/bs";
import Button from './Button';

function Hero(props) {
  const {
    icon,
    title,
    body,
    showButton = false,
    buttonText = "Időpontot foglalok",
    buttonAction = () => {},
    href // <-- ÚJ: href támogatás
  } = props;

  return (
    <div className="px-4 py-5 mb-3 text-center container-fluid hero w-100">
      <div className="d-block mx-auto mb-4 mt-3" style={{ fontSize: "72px"}}>
        {icon}
      </div>
      <h1 className="display-5 fw-bold text-body-emphasis">{title}</h1>
      <div className="col-lg-6 mx-auto">
        <p className="lead mb-5 mt-4">
          {body}
        </p>

        {showButton && (
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            {href ? (
              <a
                href={href}
                className="btn btn-primary btn-lg px-4 gap-3 blue-bg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {buttonText}
              </a>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-lg px-4 gap-3 blue-bg button"
                onClick={buttonAction}
              >
                {buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Hero;
