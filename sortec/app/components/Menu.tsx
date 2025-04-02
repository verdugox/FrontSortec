"use client";
import { useState } from "react";
import { Navbar, Nav, Dropdown } from "react-bootstrap";
import { useRouter, usePathname } from "next/navigation"; // ✅ se agrega usePathname
import '../../css/home/menu.css';

interface ClientData {
  nombres?: string;
  apellidos?: string;
}

interface Props {
  client: ClientData | null;
  onLogout: () => void;
  onLoginClick: () => void;
  scrollToTop: () => void;
  setShowLogin: (val: boolean) => void;
}

export default function Menu({ client, onLogout, onLoginClick, scrollToTop }: Props) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const router = useRouter();
  const pathname = usePathname(); // ✅ detecta la ruta actual

  // ✅ Lógica para navegación o scroll
  const handleNavigation = (hash: string) => {
    if (!hash || hash === "#") {
      if (pathname === "/") {
        scrollToTop(); // Scroll a la parte superior
      } else {
        router.push("/"); // Volver a la página principal
      }
      return;
    }
  
    if (pathname === "/") {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push("/" + hash);
    }
  };
  
  return (
    <Navbar expand="lg" className="navbar navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Navbar.Brand href="#" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
          <img
            src="/images/LogoSortecQueda2.png"
            alt="SORTEC Logo"
            className="img-fluid"
            style={{ maxHeight: '60px' }}
          />
        </Navbar.Brand>
        <div className="d-flex align-items-center">
          <Navbar.Toggle
            aria-controls="navbarNav"
            onClick={() => setIsNavCollapsed(!isNavCollapsed)}
            className="ms-auto"
          />
        </div>
        <Navbar.Collapse id="navbarNav" className={isNavCollapsed ? "collapse" : "show"}>
          <Nav className="mx-auto" id="menuPage">
            <Nav.Link onClick={() => handleNavigation("#")}>Inicio</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#sorteos")}>Sorteos</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#benefits")}>Beneficios</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#store")}>Tienda</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#games")}>Juegos</Nav.Link>
            <Nav.Link onClick={() => handleNavigation("#ganadores")}>Ganadores</Nav.Link>
          </Nav>
          <Nav>
            {!client ? (
              <Nav.Link onClick={onLoginClick} className="login-button">Iniciar Sesión</Nav.Link>
            ) : (
              <Dropdown>
                <Dropdown.Toggle variant="secondary">
                  👤 {client.nombres?.split(" ")[0]} {client.apellidos?.split(" ")[0]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => router.push("/perfil")}>Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={() => router.push("/suscripcion")}>Suscripción</Dropdown.Item>
                  <Dropdown.Item onClick={onLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
