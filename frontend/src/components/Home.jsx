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

                <Cardcomp 
                title="Flow Masszázs"
                text="A flow masszázs egy különleges technika, amely a test és az elme közötti harmónia megteremtésére összpontosít. A masszázs során a terapeuta folyamatos mozdulatokat végez, amelyek segítenek a feszültség csökkentésében és a relaxáció elősegítésében."
                imgurl="https://flowheadspa.hu/wp-content/uploads/2023/11/kezeles-flow-1024x683.jpg"
                />

                <Cardcomp
                title="BE〽️ER Terápia"
                text="A BEMER terápia egy innovatív módszer, amely a mikrokeringés javítására összpontosít. A terápia során speciális elektromágneses impulzusokat alkalmaznak, amelyek segítenek a vérkeringés fokozásában és a sejtek oxigénellátottságának javításában."
                imgurl="https://res.cloudinary.com/bemergroup/image/upload/d_fallback_emn3wg.png/ar_1,w_400,dpr_2.625,c_fill,g_auto,q_auto,f_auto/v1/marketing_site_remote_images_europe/39659a36969d34876905f16380f79e2e7c931e78-1031x1031.jpg"
                />
            </div>
            </div>
    );
};

export default Home;