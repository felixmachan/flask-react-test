import React from 'react';
import Hero from './Hero';
import { TbMassage } from "react-icons/tb";

function Services() {
    return (
        <Hero 
                title="Szolgáltatások"
                body="Válaszd ki a számodra szükséges kényeztetést, és éld át a megújulást!"
                icon={<TbMassage className='hero-icon'/>}
            />
    );
};

export default Services;