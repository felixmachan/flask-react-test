import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'; // Router, useNavigate
import { useEffect, useState } from 'react';
import BasicExample from './components/Navbar';
import Hero from './components/Hero';
import Footer from "./components/Footer.jsx";
import Appointments from './components/Appointments.jsx';
import { BsHeartPulseFill } from "react-icons/bs";
import Contact from './components/Contact.jsx';

// 👇 Új komponens, ami Router-en belül lesz, így működik benne a useNavigate
function NavigateButtonWrapper({ children }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/appointments');
  };

  return children(handleClick); // callbackként adja vissza a navigate-es függvényt
}

function App() {
  const [message, setMessage] = useState('Töltés...');

  useEffect(() => {
    fetch('/api/hello')
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
          } />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
