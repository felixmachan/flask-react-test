import React from 'react';
import Hero from './Hero'; // Importálás a Hero komponenshez
import { MdMoreTime } from "react-icons/md";
import "../Appointments.css"; // CSS fájl importálása

function Appointments() {
    return (
            <Hero 
                title="Időpontfoglalás"
                body="Válaszd ki a számodra legmegfelelőbb időpontot és szolgáltatást!"
                icon={<MdMoreTime className='hero-icon'/>}
                buttonText="Időpontfoglalás"
            />
        
    );
}

export default Appointments;