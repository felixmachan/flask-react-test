import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "../Navbar.css"
function CollapsibleExample() {
  return (
    <Navbar  className="bg-body-tertiary custom-navbar" data-bs-theme="" collapseOnSelect expand="lg">
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
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto nav-links">
          <Nav.Link href="#features">Kezdőlap</Nav.Link>
            <Nav.Link href="#features">Szolgáltatások</Nav.Link>
            <Nav.Link href="#pricing">Árak</Nav.Link>
            <Nav.Link href="#pricing">Időpontfoglalás</Nav.Link>
            <Nav.Link href="#pricing">Rólam</Nav.Link>
            <Nav.Link href="#pricing">Kapcsolat</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;