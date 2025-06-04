"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface Cliente {
  id?: string;
  codigoSortec: string;
  dni: string;
  nombres: string;
  apellidos: string;
  direccion: string;
  pais: string;
  provincia: string;
  distrito: string;
  correo: string;
  telefono: string;
  voucherUrl: string;
  referenciaPago: string;
  estado?: string;
}

interface ClientListProps {
  reloadTrigger: number; // 🔹 Agregar esta propiedad para evitar el error
}

export default function ListaClientes({ reloadTrigger }: ClientListProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(30);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 🔹 Estado de carga
  const [estadoFiltro, setEstadoFiltro] = useState<string>("todos");
  const URL_MICRO_BACKEND = 'https://api.sorteosc.com/api';


  useEffect(() => {
    if (reloadTrigger > 0) {
      fetchClientes();
    }
  }, [reloadTrigger]); // 🔹 Agregar reloadTrigger como dependencia

  useEffect(() => {
  filterClientes();
}, [searchTerm, clientes, rowsPerPage, currentPage, estadoFiltro]);


  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await fetch(URL_MICRO_BACKEND+"/clients");
      if (!response.ok) {
        throw new Error("Error al obtener clientes.");
      }
      const data = await response.json();
      setClientes(data);
      setFilteredClientes(data.slice(0, rowsPerPage));
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
      setError("No se pudo obtener la lista de participantes.");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelFile = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(excelFile, "Lista_Participantes_2025.xlsx");
  };

    const filterClientes = () => {
    const filtered = clientes
      .filter((cliente) => {
        const coincideEstado =
          estadoFiltro === "todos" || cliente.estado === estadoFiltro;

        const coincideBusqueda = Object.values(cliente).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

        return coincideEstado && coincideBusqueda;
      })
      .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    setFilteredClientes(filtered);
  };



  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleRowsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page on rows per page change
  };

 

  // Función para enviar correo al ganador
  const sendEmailRenovation = async (cliente: Cliente) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Debes iniciar sesión");
      return;
    }

    if (!cliente.codigoSortec) {
      alert("Debes ingresar un código Sortec");
      return;
    }

    const bannerUrl = "https://res.cloudinary.com/dizkdk1te/image/upload/v1748877287/SorteoSortecJunio062025_cmpwk3.jpg";
    

    // ✅ Definir el mensaje antes de usarlo
    // ✅ Mensaje con efectos llamativos y estructura visual mejorada
    const message = `
          <div style="font-family: Arial, sans-serif; text-align: justify; color: #333; padding: 20px; 
              border: 2px solid #ddd; border-radius: 10px; background-color: #f9f9f9; max-width: 600px; 
              margin: auto; box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);">

              <h1 style="color: #d9534f; text-align: center; text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);">
                  🎮💥 ¡${cliente.nombres}, TE EXTRAÑAMOS! 💥🎮
              </h1>

              <p style="font-size: 18px; line-height: 1.6;">
                  🌟 La familia <b>SORTEC</b> no es lo mismo sin ti. Queremos que sigas 
                  disfrutando de nuestros increíbles beneficios. 🎁🎉
              </p>

              <h2 style="color: #28a745; text-align: center; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">
                  🎁 ¡NO TE QUEDES FUERA! 🎁
              </h2>

              <p style="font-size: 18px; line-height: 1.6;">
                  ✅ Sorteos de <b>componentes tecnológicos premium</b> 🖥️🎮<br>
                  ✅ Descargas de <b>videojuegos exclusivos</b> 🎮🚀<br>
                  ✅ Participación en <b>torneos con grandes premios</b> 🏆🎟️
              </p>

              <img src="${bannerUrl}" alt="Banner Renovación" style="width: 100%; border-radius: 10px; margin: 20px 0;" />

              <h3 style="color: #ff5733; text-align: center; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">
                  🔄 ¿CÓMO RENOVAR TU SUSCRIPCIÓN? 🔄
              </h3>

              <p style="font-size: 18px; line-height: 1.6;">
                  1️⃣ <strong>Ingresa a nuestra plataforma:</strong> 
                  <a href="http://sortsortech.azurewebsites.net/" target="_blank"
                      style="color: #007bff; text-decoration: none; font-weight: bold;">
                      🔗 sortsortech.azurewebsites.net
                  </a><br><br>

                  2️⃣ <strong>Inicia sesión con tus credenciales:</strong><br>
                  📌 <b>Usuario:</b> <span style="background-color: #ffcc80; padding: 4px 8px; border-radius: 5px; box-shadow: 0 0 6px #ff9800;">
                    ${cliente.dni}
                  </span><br>
                  🔒 <b>Contraseña:</b> <span style="background-color: #ffcc80; padding: 4px 8px; border-radius: 5px; box-shadow: 0 0 6px #ff9800;">
                    ${cliente.codigoSortec}
          </span><br><br>

                  3️⃣ Dirígete al apartado <b>'Ver Suscripción'</b> 📋<br>
                  4️⃣ Haz clic en <b>'Renovar Suscripción'</b> 🔄<br>
                  5️⃣ Realiza el pago y listo 🎉🙌
              </p>

              <h3 style="color: #ff5733; text-align: center;">
                  📢 ¡RENUEVA AHORA Y SIGUE DISFRUTANDO! 📢
              </h3>

              <div style="text-align: center; margin-top: 20px;">
                  <a href="http://sortsortech.azurewebsites.net/" target="_blank" 
                      style="display: inline-block; padding: 12px 25px; background-color: #007bff; 
                          color: #fff; text-decoration: none; border-radius: 8px; font-size: 18px; 
                          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
                      🔄 RENOVAR AHORA
                  </a>
              </div>

              <p style="font-size: 18px; margin-top: 20px;">
                  🙌 <b>Gracias por formar parte de la familia SORTEC. ¡Sigue participando y mucha suerte! 🍀🎊</b>
              </p>
          </div>
        `;


    setLoading(true);
    try {
      const response = await fetch(`${URL_MICRO_BACKEND}/clients/send-winner-notification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoSortec: cliente.codigoSortec,
          subject: "📢 Renovación de Subscripción - SORTEC 📢",
          message: message

        }),
      });
  
      if (!response.ok) {
        throw new Error("Error en la solicitud al servidor");
      }
  
      alert("📧 Notificación enviada correctamente al usuario.");
    } catch (error) {
      console.error("Error al enviar correo renovación suscripción:", error);
      alert("⚠️ Error al enviar la notificación, inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleView = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const totalPages = Math.ceil(clientes.length / rowsPerPage); // Corregir el cálculo de totalPages

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Participantes Pendientes</h2>

      {loading ? (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Cargando participantes...</p>
        </div>
      ) : (
        <div>{/* Renderizar la tabla de clientes aquí */}</div>
      )}

      {error && <p className="alert alert-danger">{error}</p>}

      {/* Filtros y configuración de tabla */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar participante..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-3">
          <select className="form-control" value={rowsPerPage} onChange={handleRowsChange}>
            <option value={30}>Mostrar 30</option>
            <option value={50}>Mostrar 50</option>
            <option value={70}>Mostrar 70</option>
          </select>
        </div>
        <div className="col-md-3">
          {/* Botón de Exportar a Excel */}
          <div className="text-end mb-3">
            <button className="btn btn-success" onClick={exportToExcel}>
              📥 Exportar a Excel
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <select
          className="form-control"
          value={estadoFiltro}
          onChange={(e) => {
            setEstadoFiltro(e.target.value);
            setCurrentPage(1); // Reinicia a la primera página al cambiar filtro
          }}
        >
          <option value="todos">🔎 Mostrar Todos</option>
          <option value="aprobado">🟢 Aprobados</option>
          <option value="pendiente">🟡 Pendientes</option>
          <option value="inactivo">🔴 Inactivos</option>
        </select>
      </div>


      {/* Tabla de clientes */}
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Codigo</th>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente, index) => (
              <tr key={cliente.id}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{cliente.codigoSortec}</td>
                <td>{cliente.dni}</td>
                <td>{cliente.nombres.split(" ")[0]}</td>
                <td>{cliente.apellidos.split(" ")[0]}</td>
                <td
                  style={{
                      color:
                        cliente.estado === "pendiente"
                          ? "#ffc107" // 🎨 Amarillo mate para Pendiente
                          : cliente.estado === "inactivo"
                          ? "red"
                          : cliente.estado === "aprobado"
                          ? "#28a745" // ✅ Verde para Aprobado
                          : "inherit",
                      fontWeight:
                        cliente.estado === "pendiente" ||
                        cliente.estado === "inactivo" ||
                        cliente.estado === "aprobado"
                          ? "bold"
                          : "normal"
                    }}

                >
                  {cliente.estado
                    ? cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1)
                    : ""}
                </td>


                <td className="text-center">
                  {/* Botón de Ver */}
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleView(cliente)}
                  >
                    👁 Ver
                  </button>
                  {/* Botón de Notificar */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => sendEmailRenovation(cliente)}
                  >
                    📩 Notificar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(1)}>
              Primero
            </button>
          </li>
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Anterior
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Siguiente
            </button>
          </li>
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => handlePageChange(totalPages)}>
              Último
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal para ver participante */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCliente && (
            <div>
              <p><strong>DNI:</strong> {selectedCliente.dni}</p>
              <p><strong>Nombres:</strong> {selectedCliente.nombres}</p>
              <p><strong>Apellidos:</strong> {selectedCliente.apellidos}</p>
              <p><strong>Dirección:</strong> {selectedCliente.direccion}</p>
              <p><strong>Pais:</strong> {selectedCliente.pais}</p>
              <p><strong>Provincia:</strong> {selectedCliente.provincia}</p>
              <p><strong>Distrito:</strong> {selectedCliente.distrito}</p>
              <p><strong>Correo:</strong> {selectedCliente.correo}</p>
              <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>
              <p><strong>Referencia Pago:</strong> {selectedCliente.referenciaPago}</p>
              <p><strong>Comprobante de Pago:</strong></p>
              <img src={selectedCliente.voucherUrl} alt="Comprobante de Pago" className="img-fluid" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
            <button className="btn btn-primary" onClick={() => setShowModal(false)}>
            OK
            </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}