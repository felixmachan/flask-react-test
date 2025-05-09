import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import "../Navbar.css";
import NavDropdown from "react-bootstrap/NavDropdown";

function CollapsibleExample() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Navbar
      className="bg-body-tertiary custom-navbar"
      collapseOnSelect
      expand="lg"
    >
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img
            alt=""
            src="/logo.png"
            width="100"
            height="100"
            className="d-inline-block align-top"
          />
          <span className="brand-text ms-3 talppont">TalpPont</span>
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          onClick={handleToggle}
        />
        <Navbar.Collapse id="responsive-navbar-nav" in={isOpen}>
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/">
              <span className="nav-text">Kezdőlap</span>
            </Nav.Link>
            <NavDropdown
              title={<span className="nav-text">Szolgáltatások</span>}
              className="dropdown"
              id="collapsible-nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/services">
                Kezelések
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Árak</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/appointments">
              <span className="nav-text">Időpontfoglalás</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              <span className="nav-text">Kapcsolat</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              <span className="nav-text login-button">Bejelentkezés</span>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;
