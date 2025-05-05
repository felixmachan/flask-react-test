import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importálás
import { useEffect, useState } from 'react';
import BasicExample from './components/Navbar';
import Hero from './components/Hero';
import Footer from "./components/Footer.jsx";
import Appointments from './components/Appointments.jsx'; // Időpontfoglalás oldal
import { BsHeartPulseFill } from "react-icons/bs"; // Ikon importálás

function App() {
  const [message, setMessage] = useState('Töltés...');

  useEffect(() => {
    fetch('/api/hello')  // Ez Vite proxy esetén működik
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Hiba történt az API híváskor.'));
  }, []);

  return (
    <div className="root">
      <Router>
        <BasicExample />
        <Routes>
          <Route path="/" element={
            <><Hero
              title="Kényeztetés a mindennapokban"
              body="A lelki és testi egészség megőrzéséért." 
              icon={<BsHeartPulseFill className="hero-icon" />}
              showButton={true} // Gomb megjelenítése
              buttonText="Időpontot foglalok" // Gomb szövege
            />
            </>
            } />
          <Route path="/appointments" element={<><Appointments /></>} /> {/* Időpontfoglalás */}
        </Routes>
        <Footer /> {/* Footer mindig ott lesz */}
      </Router>
    </div>
  );
}

export default App;
