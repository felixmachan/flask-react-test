import React from 'react';
import "../Hero.css"
import { BsHeartPulseFill } from "react-icons/bs";

function Hero() {
    return (
      <div className="px-4 py-5 my-0 text-center container-fluid hero">
        <div className="d-block mx-auto mb-4 mt-3" style={{ fontSize: "72px"}}>
          <BsHeartPulseFill />
        </div>
        <h1 className="display-5 fw-bold text-body-emphasis">Kényeztetés a mindennapokban</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-5 mt-4">
            Kezeléseimet a tudományos alaposság és a személyre szabott megközelítés jellemzi. A tudományos kutatások és a legújabb technológiák felhasználásával biztosítom, hogy a legjobb eredményeket érjük el. Ezeket a lelki- és testi egészség szemelőtt tartása mellet végzem. Foglalj időpontot most, és tapasztald meg a különbséget!
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button type="button" className="btn btn-primary btn-lg px-4 gap-3 blue-bg">Időpontot foglalok</button>
          </div>
        </div>
      </div>
    );
  }

export default Hero;