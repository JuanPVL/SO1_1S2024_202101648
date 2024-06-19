import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function BarraSup() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">SO1 PY1</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/livecharts">TiempoReal</Nav.Link>
            <Nav.Link href="/historico">Historico</Nav.Link>
            <Nav.Link href="/arbolprocesos">Arbol</Nav.Link>
            <Nav.Link href="/simulacionp">Simulacion</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default BarraSup;