"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import ClientListPending from "../components/ClientListPending";
import Chat from "../components/Chat";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUsers, FaShoppingCart, FaCog, FaChartLine, FaBars } from "react-icons/fa";

interface Perfil {
  dni: string;
  nombres: string;
  correo: string;
  rol: string;
}

interface MenuItem {
  nombre: string;
  url: string;
}

export default function ParticipantesPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState({ approved: 0, pending: 0, denied: 0 });
  const [menuOpen, setMenuOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const URL_MICRO_BACKEND = 'https://api.sorteosc.com/api';

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
      router.push("/");
      return;
    }

    fetch(`${URL_MICRO_BACKEND}/clients/perfil`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data) {
        setPerfil(data.perfil);
        setMenu(data.menu);
      }
    })
    .catch(() => {
      localStorage.removeItem("token");
      router.push("/");
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Función para asignar iconos dinámicamente al menú
  const getIconForMenu = (menuName: string) => {
    switch (menuName.toLowerCase()) {
      case "inicio":
        return <FaTachometerAlt />;
      case "eventos":
        return <FaUsers />;
      case "tienda":
        return <FaShoppingCart />;
      case "configuración":
        return <FaCog />;
      case "promociones":
        return <FaChartLine />;
      default:
        return <FaBars />;
    }
  };

  return (
    <div className="d-flex flex-column flex-lg-row">
      {/* Navbar superior fijo */}
      <Navbar expand="lg" className="navbar-custom position-fixed w-100 shadow-sm">
        <Container fluid className="d-flex align-items-center justify-content-between">
          {/* Icono de menú a la izquierda + SORTEC */}
          <div className="d-flex align-items-center justify-content-start">
            <button className="me-2 menu-toggle btn-square btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars size={16} />
            </button>
            <Navbar.Brand className="text-white ms-2">SORTEC</Navbar.Brand>
          </div>

          {/* Menú de perfil visible en escritorio */}
          <Nav className="d-none d-lg-flex align-items-center">
            <span className="me-3 badge bg-success">Aprobados: {stats.approved}</span>
            <span className="me-3 badge bg-warning">Pendientes: {stats.pending}</span>
            <span className="me-3 badge bg-danger">Denegados: {stats.denied}</span>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaUserCircle size={20} /> {perfil ? perfil.nombres : "Usuario"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Perfil</Dropdown.Item>
                <Dropdown.Item href="#">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt /> Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

          {/* Ocultar menú del perfil en móviles */}
          <div className="d-flex d-lg-none align-items-center justify-content-end">
            <button className="profile-menu-toggle btn-square btn-sm" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              <FaUserCircle size={16} />
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Sidebar fijo con animación */}
      <nav className={`sidebar ${menuOpen ? "sidebar-open" : "sidebar-closed"} bg-dark text-light vh-100 d-none d-lg-block`}>
        <h4 className="text-center text-white mt-3">SORTEC</h4>
        <ul className="nav flex-column">
          {menu.map((item, index) => (
            <li key={index} className="nav-item">
              <a href={item.url} className="nav-link text-white d-flex align-items-center">
                {getIconForMenu(item.nombre)}
                <span className="ms-2">{item.nombre}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-3">
        {/* Menú de perfil en móviles */}
        {profileMenuOpen && (
          <div className="profile-menu-mobile bg-light p-3 shadow-sm">
            <span className="me-3 badge bg-success">Aprobados: {stats.approved}</span>
            <span className="me-3 badge bg-warning">Pendientes: {stats.pending}</span>
            <span className="me-3 badge bg-danger">Denegados: {stats.denied}</span>
            <Dropdown>
              <Dropdown.Toggle variant="light" id="dropdown-basic">
                <FaUserCircle size={20} /> {perfil ? perfil.nombres : "Usuario"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Perfil</Dropdown.Item>
                <Dropdown.Item href="#">Configuración</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt /> Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}

        {/* Sección de estadísticas */}
        <div className="container mt-5 pt-4">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3">
            <div className="col">
              <div className="card stat-card bg-primary text-white">
                <h5>101.1K Descargas</h5>
                <p>+3% desde el mes pasado</p>
              </div>
            </div>
            <div className="col">
              <div className="card stat-card bg-warning text-white">
                <h5>12.2K Compras</h5>
                <p>+3% desde el mes pasado</p>
              </div>
            </div>
            <div className="col">
              <div className="card stat-card bg-danger text-white">
                <h5>5.3K Clientes</h5>
                <p>+3% desde el mes pasado</p>
              </div>
            </div>
            <div className="col">
              <div className="card stat-card bg-dark text-white">
                <h5>5.3K Clientes</h5>
                <p>+3% desde el mes pasado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de gráficos */}
        <div className="container mt-5 pt-4">
          <div className="row">
            <div className="col-md-6">
              <div className="chart-container">
                <Chat tipo="barras" setStats={setStats} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="chart-container">
                <Chat tipo="dona" setStats={setStats} />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de clientes */}
        <div className="container mt-5">
          <h3>Lista de Participantes Registrados</h3>
          <ClientListPending reloadTrigger={1} />
        </div>
      </div>

      {/* Menú superpuesto en móviles */}
      {menuOpen && (
        <div className="overlay-menu bg-dark text-light p-3 d-lg-none">
          <h4 className="text-center text-white mt-3">SORTEC</h4>
          <ul className="nav flex-column">
            {menu.map((item, index) => (
              <li key={index} className="nav-item">
                <a href={item.url} className="nav-link text-white d-flex align-items-center">
                  {getIconForMenu(item.nombre)}
                  <span className="ms-2">{item.nombre}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Perfil superpuesto en móviles */}
      {profileMenuOpen && (
        <div className="overlay-profile bg-light p-3 shadow-sm d-lg-none">
          <span className="me-3 badge bg-success">Aprobados: {stats.approved}</span>
          <span className="me-3 badge bg-warning">Pendientes: {stats.pending}</span>
          <span className="me-3 badge bg-danger">Denegados: {stats.denied}</span>
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
              <FaUserCircle size={20} /> {perfil ? perfil.nombres : "Usuario"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Perfil</Dropdown.Item>
              <Dropdown.Item href="#">Configuración</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>
                <FaSignOutAlt /> Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </div>
  );
}