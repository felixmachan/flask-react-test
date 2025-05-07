import React from "react";
import Hero from "./Hero";
import { TbMassage } from "react-icons/tb";
import Service from "./Service";

function Services() {
  return (
    <div>
      <Hero
        title="Szolgáltatások"
        body="Válaszd ki a számodra szükséges kényeztetést, és éld át a megújulást!"
        icon={<TbMassage className="hero-icon" />}
      />
      <Service
        title="Talpmasszázs"
        p="A talpmasszázs során a talp reflexzónáit stimuláljuk, amelyek összeköttetésben állnak a test különböző szerveivel és rendszereivel. Ezáltal segítünk a feszültség csökkentésében, a vérkeringés javításában és a méregtelenítésben."
      />
      <Service
        title="Reflexológia"
        p="A reflexológia egy holisztikus megközelítés, amely a test különböző részein található reflexzónák stimulálásával segít a testi és lelki egyensúly helyreállításában. A kezelés során a láb, a kéz és a fül reflexzónáira összpontosítunk."
      />
      <Service
        title="Flow Masszázs"
        p="A flow masszázs egy különleges technika, amely a test és lélek harmóniáját célozza meg. A lágy, folyamatos mozdulatok segítenek a stressz csökkentésében, a feszültség oldásában és a mély relaxáció elérésében."
      />
    </div>
  );
}

export default Services;
