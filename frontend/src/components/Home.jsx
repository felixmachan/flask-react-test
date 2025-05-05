import React from 'react';
import Hero from './Hero.jsx';
import { BsHeartPulseFill } from "react-icons/bs";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Cardcomp from './Cardcomp.jsx';
import "../Home.css";

function Home(){

    function NavigateButtonWrapper({ children }) {
      const navigate = useNavigate();
      const handleClick = () => {
        navigate('/appointments');
      };
    
      return children(handleClick); // callbackként adja vissza a navigate-es függvényt
    }

    return (
        <div>
        <NavigateButtonWrapper>
              {(handleButtonClick) => (
                <Hero
                  title="Kényeztetés a mindennapokban"
                  body="A lelki és testi egészség megőrzéséért." 
                  icon={<BsHeartPulseFill className="hero-icon" />}
                  showButton={true}
                  buttonText="Időpontot foglalok"
                  buttonAction={handleButtonClick}
                />
              )}
            </NavigateButtonWrapper>
            <div className="cards">
                <Cardcomp 
                title="Talpgyógyászat"
                text="A talpgyógyászat a láb és a talp egészségének megőrzésére és helyreállítására összpontosít. A talpgyógyászok különböző technikákat alkalmaznak, mint például a reflexológia, a masszázs és a speciális talpbetétek készítése."
                imgurl="https://gyogymasszazshaz.hu/wp-content/uploads/2016/10/tm.jpg"
                />
            </div>
            </div>
    );
};

export default Home;