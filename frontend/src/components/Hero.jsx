import React from 'react';
import "../Hero.css"
import { BsHeartPulseFill } from "react-icons/bs";

function Hero(props) {
  console.log("Hero props:", props)
    return (
      <div className="px-4 py-5 my-0 text-center container-fluid hero w-100">
        <div className="d-block mx-auto mb-4 mt-3" style={{ fontSize: "72px"}}>
          {props.icon}
        </div>
        <h1 className="display-5 fw-bold text-body-emphasis">{props.title}</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-5 mt-4">
            {props.body}
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button type="button" className="btn btn-primary btn-lg px-4 gap-3 blue-bg">Időpontot foglalok</button>
          </div>
        </div>
      </div>
    );
  }

export default Hero;