"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav, Container, Dropdown, Modal, Button, Spinner } from "react-bootstrap";
import { FaUserCircle, FaSignOutAlt, FaTachometerAlt, FaUsers, FaShoppingCart, FaCog, FaChartLine, FaBars } from "react-icons/fa";
import TipTapEditor from "./TipTapEditor"; // Importa el editor correctamente

interface Perfil {
  codigoSortec: string;
  dni: string;
  nombres: string;
  correo: string;
  rol: string;
}

interface MenuItem {
  nombre: string;
  url: string;
}

// Configuración de Cloudinary
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Sortecfiles";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function Notificacion() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const router = useRouter();
  const [massEmailFormData, setMassEmailFormData] = useState({ subject: "", message: "", imagenUrl: "" });
  const [winnerEmailFormData, setWinnerEmailFormData] = useState({ subject: "", message: "", imagenUrl: "" });
  const [massReminderSuscribFormData, setMassReminderSuscribFormData] = useState({ subject: "", message: "", imagenUrl: "" });
  const [codigoSortec, setCodigoSortec] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // Estado para el spinner de carga
  const [showModal, setShowModal] = useState(false); // Estado para el modal de éxito
  const fileInputRefMassEmail = useRef<HTMLInputElement>(null);
  const fileInputRefWinnerEmail = useRef<HTMLInputElement>(null);
  const fileInputRefSuscribEmail = useRef<HTMLInputElement>(null);

  // Manejar cambios en los inputs
  const handleMassEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMassEmailFormData({ ...massEmailFormData, [e.target.name]: e.target.value });
  };

  const handleWinnerEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setWinnerEmailFormData({ ...winnerEmailFormData, [e.target.name]: e.target.value });
  };

  const handleReminderSuscribEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMassReminderSuscribFormData({ ...massReminderSuscribFormData, [e.target.name]: e.target.value });
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
        "Content-Type": "application/json",
      },
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

  // Subir imagen a Cloudinary
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, setFormData: React.Dispatch<React.SetStateAction<{ subject: string; message: string; imagenUrl: string }>>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    const currentMonth = new Date().toLocaleString("es-ES", { month: "long" });
    const folder = `SortecVoucher/Correos/${currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)}`;

    formDataUpload.append("file", file);
    formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formDataUpload.append("folder", folder);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formDataUpload,
      });

      const uploadedImageData = await response.json();
      if (!response.ok) throw new Error("Error al subir la imagen");

      setFormData((prevData) => ({ ...prevData, imagenUrl: uploadedImageData.secure_url }));
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    } finally {
      setUploading(false);
    }
  };

  // Función para enviar correo masivo
  const sendMassEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200000); // ⏳ 20 minutos (1,200,000 ms)

      const response = await fetch(`/api/clients/send-dynamic-mass-email`, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: massEmailFormData.subject,
          message: massEmailFormData.message,
          imageUrls: massEmailFormData.imagenUrl ? [massEmailFormData.imagenUrl] : [],
        }),
        signal: controller.signal, // ✅ Vincula el timeout al fetch
      });

      clearTimeout(timeoutId); // ✅ Evita que se cancele si la respuesta llega antes de los 20 minutos

      if (!response.ok) throw new Error("Error al enviar correos masivos");

      setShowModal(true);
      // Limpiar campos del formulario
      setMassEmailFormData({ subject: "", message: "", imagenUrl: "" });
      if (fileInputRefMassEmail.current) {
        fileInputRefMassEmail.current.value = "";
      }
    } catch (error) {
      console.error("Error al enviar correos:", error);
      if ((error as Error).name === "AbortError") {
        alert("El envío de correos tardó demasiado y fue cancelado después de 20 minutos. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
};


  // Función para enviar correo al ganador
  const sendWinnerEmail = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!codigoSortec) {
      alert("Debes ingresar un código Sortec");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/clients/send-winner-notification`, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoSortec,
          subject: winnerEmailFormData.subject,
          message: winnerEmailFormData.message,
          imageUrls: winnerEmailFormData.imagenUrl ? [winnerEmailFormData.imagenUrl] : [],
        }),
      });

      if (!response.ok) throw new Error("Error al enviar correo al ganador");

      setShowModal(true);
      // Limpiar campos del formulario
      setWinnerEmailFormData({ subject: "", message: "", imagenUrl: "" });
      setCodigoSortec("");
      if (fileInputRefWinnerEmail.current) {
        fileInputRefWinnerEmail.current.value = "";
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMassiveSuscribReminder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    setLoading(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200000); // ⏳ 20 minutos (1,200,000 ms)

      const response = await fetch(`/api/clients/send-manual-subscription-reminder`, {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: massReminderSuscribFormData.subject,
          message: massReminderSuscribFormData.message,
          imageUrls: massReminderSuscribFormData.imagenUrl ? [massReminderSuscribFormData.imagenUrl] : [],
        }),
        signal: controller.signal, // ✅ Vincula el timeout al fetch
      });

      clearTimeout(timeoutId); // ✅ Evita que se cancele si la respuesta llega antes de los 20 minutos

      if (!response.ok) throw new Error("Error al enviar correos masivos");

      setShowModal(true);
      // Limpiar campos del formulario
      setMassReminderSuscribFormData({ subject: "", message: "", imagenUrl: "" });
      if (fileInputRefSuscribEmail.current) {
        fileInputRefSuscribEmail.current.value = "";
      }
    } catch (error) {
      console.error("Error al enviar correos:", error);
      if ((error as Error).name === "AbortError") {
        alert("El envío de correos tardó demasiado y fue cancelado después de 20 minutos. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
};



  // Función para cerrar el modal y limpiar los formularios
  const handleCloseModal = () => {
    setShowModal(false);
    setMassEmailFormData({ subject: "", message: "", imagenUrl: "" });
    setWinnerEmailFormData({ subject: "", message: "", imagenUrl: "" });
    setMassReminderSuscribFormData({ subject: "", message: "", imagenUrl: "" });
    setCodigoSortec("");
    if (fileInputRefMassEmail.current) {
      fileInputRefMassEmail.current.value = "";
    }
    if (fileInputRefWinnerEmail.current) {
      fileInputRefWinnerEmail.current.value = "";
    }
    if (fileInputRefSuscribEmail.current) {
      fileInputRefSuscribEmail.current.value = "";
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

          <div className="container mt-5 pt-4">
            {/* FORMULARIO PARA CORREOS MASIVOS */}
            <div className="mb-4">
              <h3 className="mb-3">Enviar Notificación Masiva</h3>
              <div className="card p-4">
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input type="text" className="form-control" name="subject" value={massEmailFormData.subject} onChange={handleMassEmailChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <div className="editor-container">
                    <TipTapEditor value={massEmailFormData.message} onChange={(value) => setMassEmailFormData({ ...massEmailFormData, message: value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Adjuntar Imagen</label>
                  <input type="file" className="form-control" ref={fileInputRefMassEmail} onChange={(e) => handleFileUpload(e, setMassEmailFormData)} />
                </div>
                {uploading && <p className="text-warning">Subiendo imagen...</p>}
                <button className="btn btn-primary w-100" onClick={sendMassEmail} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Enviar Correos Masivos"}
                </button>
              </div>
            </div>

            {/* FORMULARIO PARA CORREO AL GANADOR */}
            <div className="mb-4">
              <h3 className="mb-3">Enviar Notificación al Ganador</h3>
              <div className="card p-4">
                <div className="mb-3">
                  <label className="form-label">Código Sortec del Ganador</label>
                  <input type="text" className="form-control" value={codigoSortec} onChange={(e) => setCodigoSortec(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input type="text" className="form-control" name="subject" value={winnerEmailFormData.subject} onChange={handleWinnerEmailChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <div className="editor-container">
                    <TipTapEditor value={winnerEmailFormData.message} onChange={(value) => setWinnerEmailFormData({ ...winnerEmailFormData, message: value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Adjuntar Imagen</label>
                  <input type="file" className="form-control" ref={fileInputRefWinnerEmail} onChange={(e) => handleFileUpload(e, setWinnerEmailFormData)} />
                </div>
                {uploading && <p className="text-warning">Subiendo imagen...</p>}
                <button className="btn btn-success w-100" onClick={sendWinnerEmail} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Enviar Notificación al Ganador"}
                </button>
              </div>
            </div>

            {/* FORMULARIO PARA RECORDATORIO DE SUSCRIPCIÓN */}
            <div className="mb-4">
              <h3 className="mb-3">Recordatorio Masivo Sobre Suscripciones por Vencer</h3>
              <div className="card p-4">
                <div className="mb-3">
                  <label className="form-label">Asunto</label>
                  <input type="text" className="form-control" name="subject" value={massReminderSuscribFormData.subject} onChange={handleReminderSuscribEmailChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensaje</label>
                  <div className="editor-container">
                    <TipTapEditor value={massReminderSuscribFormData.message} onChange={(value) => setMassReminderSuscribFormData({ ...massReminderSuscribFormData, message: value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Adjuntar Imagen</label>
                  <input type="file" className="form-control" ref={fileInputRefSuscribEmail} onChange={(e) => handleFileUpload(e, setMassReminderSuscribFormData)} />
                </div>
                {uploading && <p className="text-warning">Subiendo imagen...</p>}
                <button className="btn btn-info w-100" onClick={sendMassiveSuscribReminder} disabled={loading}>
                  {loading ? <Spinner animation="border" size="sm" /> : "Enviar Correos Masivos de Recordatorio"}
                </button>
              </div>
            </div>
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

      {/* Modal de éxito */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Correo Enviado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El correo se ha enviado exitosamente.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .editor-content {
        min-height: 250px;
        border: 1px solid #ccc; /* Agrega un borde */
        padding: 10px;
        font-size: 16px;
        outline: none;
        width: 100%;
        white-space: pre-wrap; /* Asegúrate de que los espacios se mantengan */
        border-radius: 4px; /* Agrega un borde redondeado */
        background-color: #fff; /* Fondo blanco */
      }

      .editor-container {
        border: 1px solid #ccc; /* Agrega un borde */
        border-radius: 8px; /* Agrega un borde redondeado */
        background: white;
        padding: 10px;
        max-width: 100%;
        display: flex;
        flex-direction: column;
      }

      .toolbar {
        display: flex; /* Ahora los botones estarán en una fila */
        flex-wrap: wrap; /* Se ajustan si el espacio es pequeño */
        justify-content: flex-start; /* Alinear a la izquierda */
        gap: 8px; /* Espaciado entre botones */
        padding: 10px;
        background-color: #f1f1f1;
        border-bottom: 1px solid #ccc;
        border-radius: 8px 8px 0 0;
      }

      .toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        padding: 8px;
        transition: background 0.2s;
      }

      .toolbar button:hover {
        background: #ddd;
        border-radius: 5px;
      }

      .editor-wrapper {
        min-height: 300px;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 0 0 8px 8px;
        background: white;
      }

      .emoji-picker {
        position: absolute;
        top: 50px;
        left: 10px;
        z-index: 1000;
        background: white;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        padding: 5px;
      }

      @media (max-width: 768px) {
        .toolbar {
          justify-content: center;
        }

        .toolbar button {
          font-size: 16px;
          padding: 6px;
        }

        .editor-wrapper {
          min-height: 200px;
        }

        .editor-content {
          min-height: 180px;
        }
      }
      `}</style>
    </div>
  );
}