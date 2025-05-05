import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom';
import "../Navbar.css";

function CollapsibleExample() {
  const [isOpen, setIsOpen] = useState(false);  // Nyitott/zárt menü állapota
  const location = useLocation();  // Aktuális útvonal lekérése

  // Amikor az oldal változik, zárjuk be a menüt
  useEffect(() => {
    setIsOpen(false);  // Bezárja a menüt új navigáláskor
  }, [location]);

  // Menü toggle (nyit/zár)
  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Navbar className="bg-body-tertiary custom-navbar" collapseOnSelect expand="lg">
      <Container>
        <Navbar.Brand href="#home" className='d-flex align-items-center'>
          <img
            alt=""
            src="../../public/logo.png"
            width="100"
            height="100"
            className="d-inline-block align-top"
          />{' '}
          <span className="brand-text ms-3 talppont">TalpPont</span>
        </Navbar.Brand>
        <Navbar.Toggle 
          aria-controls="responsive-navbar-nav" 
          onClick={handleToggle}  // Toggle akció a menü nyitásához/zárásához
        />
        <Navbar.Collapse id="responsive-navbar-nav" in={isOpen}>  {/* Toggle alapú nyitás/zárás */}
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/">Kezdőlap</Nav.Link>
            <Nav.Link href='#'>Szolgáltatások</Nav.Link>
            <Nav.Link href='#'>Árak</Nav.Link>
            <Nav.Link as={Link} to="/appointments">Időpontfoglalás</Nav.Link>
            <Nav.Link href='#'>Rólam</Nav.Link>
            <Nav.Link as={Link} to="/contact">Kapcsolat</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
