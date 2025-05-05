import React from 'react';
import Hero from './Hero'; // Importálás a Hero komponenshez
import { MdMoreTime } from "react-icons/md";
import "../Appointments.css"; // CSS fájl importálása
import DatePickerComponent from './Calendar';


function Appointments() {
    return (
        <div>
            <Hero 
                title="Időpontfoglalás"
                body="Válaszd ki a számodra legmegfelelőbb időpontot és szolgáltatást!"
                icon={<MdMoreTime className='hero-icon'/>}
            />
        <DatePickerComponent />
        </div>
        
    );
}

export default Appointments;