import { useEffect, useState } from 'react';
import BasicExample from './components/Navbar';
import Hero from './components/Hero';
import Footer from "./components/Footer.jsx"


function App() {
  const [message, setMessage] = useState('Töltés...');

  useEffect(() => {
    fetch('/api/hello')  // Ez Vite proxy esetén működik
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Hiba történt az API híváskor.'));
  }, []);

  return (
    <div class="root">
      <BasicExample />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;
