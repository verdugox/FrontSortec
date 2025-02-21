"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Dropdown, Modal, Button, Table, Form, Spinner, Pagination  } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUsers, FaShoppingCart, FaCog, FaChartLine, FaBars, FaEdit, FaTrash, FaEye} from "react-icons/fa";


const API_URL = `/api/sorteos`;

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

interface Sorteo {
    id: string;
    titulo: string;
    fechaSorteo: string;
    imagenUrl: string;
    estado: string;
  }
  


// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Sortecfiles";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


export default function Sorteos() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();

  const [sorteos, setSorteos] = useState<Sorteo[]>([]);
  const [filteredSorteos, setFilteredSorteos] = useState<Sorteo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingSorteo, setEditingSorteo] = useState<Sorteo | null>(null);
  const [formData, setFormData] = useState({ titulo: "", fechaSorteo: "", imagenUrl: "", estado: "" });
  const [currentPage, setCurrentPage] = useState(1);

  const [error, setError] = useState<string | null>(null); // Estado para manejar errores
  const [uploading, setUploading] = useState(false); // Estado para el spinner de carga

  const [showViewModal, setShowViewModal] = useState(false); // Estado para el modal de vista
  const [selectedSorteo, setSelectedSorteo] = useState<Sorteo | null>(null); // Sorteo seleccionado para ver

  const [loadingAction, setLoadingAction] = useState(false);

  const itemsPerPage = 15;

    const handleView = (sorteo: Sorteo) => {
        setSelectedSorteo(sorteo);
        setShowViewModal(true);
    };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
      return;
    }

    fetch(`/api/clients/perfil`, {
      method: "GET",
      headers: { 
        "Authorization": token,
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

  useEffect(() => {
    fetchSorteos();
  }, []);

  useEffect(() => {
    const filtered = sorteos.filter((s) =>
      s.titulo.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredSorteos(filtered);
  }, [search, sorteos]);

  const fetchSorteos = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        router.push("/");
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": token,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/");
            return;
        }

        if (!response.ok) throw new Error("Error al obtener sorteos");

        const data = await response.json();
        setSorteos(data);
        setFilteredSorteos(data);
    } catch (error) {
        console.error("Error al obtener sorteos:", error);
    } finally {
        setLoading(false);
    }
};


const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
        setError("Debes adjuntar una imagen del sorteo.");
        return;
    }

    setUploading(true);
    const formDataUpload = new FormData();
    const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });
    const folder = `SortecVoucher/Sorteos/${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`;

    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append("folder", folder);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formDataUpload,
        });

        const uploadedImageData = await response.json();

        if (!response.ok) {
            throw new Error(`Error al subir la imagen: ${uploadedImageData.error?.message || "Desconocido"}`);
        }

        setFormData((prevData) => ({ ...prevData, imagenUrl: uploadedImageData.secure_url }));
        setError(null);
    } catch (error) {
        setError(`Error en el proceso de subida. ${error instanceof Error ? error.message : ""}`);
    } finally {
        setUploading(false);
    }
};



const handleSave = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
      router.push("/");
      return;
  }

  setLoadingAction(true);

  try {
      // Formatear fecha de yyyy-mm-dd a dd/mm/yyyy
      const fechaOriginal = formData.fechaSorteo;
      const fechaFormateada = fechaOriginal.split("-").reverse().join("/");

      const dataToSend = { ...formData, fechaSorteo: fechaFormateada };

      const method = editingSorteo ? "PUT" : "POST";
      const url = editingSorteo ? `${API_URL}/${editingSorteo.id}` : API_URL;

      const response = await fetch(url, {
          method,
          headers: {
              "Authorization": token,
              "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
      });

      if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
      }

      if (!response.ok) throw new Error("Error al guardar sorteo");

      fetchSorteos();
      handleCloseModal();
  } catch (error) {
      console.error("Error al guardar sorteo:", error);
  } finally {
      setLoadingAction(false);
  }
};



  

const handleEdit = (sorteo: Sorteo) => {
  if (!sorteo) return;

  // Convertir fecha de dd/MM/yyyy a yyyy-MM-dd para el input date
  const fechaPartes = sorteo.fechaSorteo.split("/");
  const fechaISO = `${fechaPartes[2]}-${fechaPartes[1]}-${fechaPartes[0]}`;

  setEditingSorteo(sorteo);
  setFormData({
      titulo: sorteo.titulo || "",
      fechaSorteo: fechaISO,  // Convertir al formato compatible con el input
      imagenUrl: sorteo.imagenUrl || "",
      estado: sorteo.estado || "",
  });
  setShowModal(true);
};




const handleDelete = async (id: string) => {
  if (!window.confirm("¿Seguro que deseas eliminar este sorteo?")) return;

  const token = localStorage.getItem("token");
  if (!token) {
      router.push("/");
      return;
  }

  setLoadingAction(true);
  try {
      const response = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: {
              "Authorization": token,
              "Content-Type": "application/json",
          },
      });

      if (response.status === 401) {
          localStorage.removeItem("token");
          router.push("/");
          return;
      }

      if (!response.ok) throw new Error("Error al eliminar sorteo");

      fetchSorteos();
  } catch (error) {
      console.error("Error al eliminar sorteo:", error);
  } finally {
      setLoadingAction(false);
  }
};


  

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSorteo(null);
    setFormData({ titulo: "", fechaSorteo: "", imagenUrl: "", estado: "" });
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > Math.ceil(filteredSorteos.length / itemsPerPage)) return;
    setCurrentPage(page);
  };


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSorteos.slice(indexOfFirstItem, indexOfLastItem);

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

    {/* FORMULARIO PARA REGISTRO Y LISTADO DE SORTEOS */}

    <div className="container mt-5 pt-4">
                <Form className="border p-4 rounded shadow-lg bg-white mb-4">
                <h3 className="text-center text-primary mb-3">{editingSorteo ? "Editar Sorteo" : "Registrar Nuevo Sorteo"}</h3>

                <Form.Group className="mb-3">
                    <Form.Label>Título del Sorteo</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.titulo}
                        onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Fecha del Sorteo</Form.Label>
                    <Form.Control
                        type="date"
                        value={formData.fechaSorteo}
                        onChange={(e) => setFormData({ ...formData, fechaSorteo: e.target.value })}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Imagen del Sorteo</Form.Label>
                    <Form.Control type="file" onChange={handleFileUpload} accept="image/*" />
                    {uploading && <Spinner animation="border" size="sm" />} {/* Spinner mientras sube */}
                    {error && <div className="text-danger">{error}</div>} {/* Error si hay */}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Estado del Registro</Form.Label>
                    <Form.Control
                        type="text"
                        value={formData.estado}
                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                        required
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave} disabled={loadingAction}>
                    {loadingAction ? <Spinner animation="border" size="sm" /> : "Guardar"}
                </Button>

            </Form>

    </div>

    <div className="container mt-5 pt-4">
      <h2 className="text-center text-primary mb-4">Mantenedor de Sorteos</h2>

      {/* Tabla de Sorteos */}
      <div className="mt-4">
        <Form.Control
          type="text"
          placeholder="Buscar sorteo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-3"
        />

        <div className="table-responsive">
          <Table striped bordered hover className="text-center shadow-sm">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Imagen</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((sorteo, index) => (
                <tr key={sorteo.id}>
                  <td>{index + 1}</td>
                  <td>{sorteo.titulo}</td>
                  <td>{sorteo.fechaSorteo}</td>
                  <td><img src={sorteo.imagenUrl} alt="Sorteo" width="50" /></td>
                  <td style={{
                    color: "#00FF00",
                    fontWeight: "bold"
                }}>
                    {sorteo.estado}
                </td>

                  <td>
                    <FaEye 
                        className="text-info mx-2 action-icon"
                        onClick={() => handleView(sorteo)}
                    />
                    <FaEdit 
                        className="text-warning mx-2 action-icon"
                        onClick={() => handleEdit(sorteo)}
                    />
                    <FaTrash 
                        className={`text-danger mx-2 action-icon ${loadingAction ? "disabled" : ""}`} 
                        onClick={() => !loadingAction && handleDelete(sorteo.id)} 
                    />

                </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {/* Paginación */}
            <Pagination className="justify-content-center mt-3">
                <Pagination.Prev 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1} 
                />

                {Array.from({ length: Math.ceil(filteredSorteos.length / itemsPerPage) }, (_, index) => (
                    <Pagination.Item 
                        key={index + 1} 
                        active={index + 1 === currentPage} 
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}

                <Pagination.Next 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === Math.ceil(filteredSorteos.length / itemsPerPage)} 
                />
            </Pagination>
        </div>
      </div>
      {/*Modal para Visualizacion*/}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Detalle del Sorteo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedSorteo && (
                <div>
                    <p><strong>Título:</strong> {selectedSorteo.titulo}</p>
                    <p><strong>Fecha:</strong> {selectedSorteo.fechaSorteo}</p>
                    <p><strong>Imagen:</strong></p>
                    <img src={selectedSorteo.imagenUrl} alt="Sorteo" className="img-fluid rounded shadow" />
                    <p><strong>Estado:</strong> {selectedSorteo.estado}</p>
                </div>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>Cerrar</Button>
        </Modal.Footer>
    </Modal>


      {/* Modal de Edición */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingSorteo ? "Editar Sorteo" : "Nuevo Sorteo"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                value={formData.fechaSorteo}
                onChange={(e) => setFormData({ ...formData, fechaSorteo: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Imagen Actual</Form.Label>
                {formData.imagenUrl && <img src={formData.imagenUrl} alt="Sorteo" className="img-fluid rounded shadow mb-2" />}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Actualizar Imagen</Form.Label>
                <Form.Control type="file" onChange={handleFileUpload} accept="image/*" />
                {uploading && <Spinner animation="border" size="sm" />}
                {error && <div className="text-danger">{error}</div>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                required
              />
            </Form.Group>


            <Button variant="primary" onClick={handleSave} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Guardar"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
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


        <style jsx>{`
            .action-icon {
                cursor: pointer;
                transition: transform 0.2s ease-in-out, text-shadow 0.3s ease-in-out;
            }

            .action-icon:hover {
                transform: scale(1.2);
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            }

            .input, button {
              width: 100%;
              padding: 10px;
              margin: 8px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
            }
            .button {
              width: 100%;
              padding: 10px;
              margin: 8px 0;
              border: 1px solid #ddd;
              border-radius: 4px;
            }

            .button {
              background-color: #0070f3;
              color: white;
              border: none;
              cursor: pointer;
            }

            .button:hover {
              background-color: #005bb5;
            }
        `}</style>


    </div>
    
  );
}