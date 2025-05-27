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
  const URL_MICRO_BACKEND = 'https://api.sorteosc.com/api';

  useEffect(() => {
    if (reloadTrigger > 0) {
      fetchClientes();
    }
  }, [reloadTrigger]); // 🔹 Agregar reloadTrigger como dependencia

  useEffect(() => {
    filterClientes();
  }, [searchTerm, clientes, rowsPerPage, currentPage]);

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
      .filter((cliente) =>
        cliente.estado === "aprobado" &&
        Object.values(cliente).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
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

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("¿Estás seguro de eliminar este participante?")) return;

    try {
      const response = await fetch(`${URL_MICRO_BACKEND}/clients/${id}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar cliente: ${errorData.error}`);
      }
      alert("Participante eliminado correctamente.");
      fetchClientes();
    } catch (error) {
      console.error("❌ Error al eliminar participante:", error);
      if (error instanceof Error) {
        alert(`No se pudo eliminar el participante. ${error.message}`);
      } else {
        alert("No se pudo eliminar el participante. Error desconocido.");
      }
    }
  };

  const handleEdit = async (cliente: Cliente) => {
    try {
      const response = await fetch(`${URL_MICRO_BACKEND}/clients/${cliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar participante: ${errorData.error}`);
      }
      alert("Participante actualizado correctamente.");
      fetchClientes();
    } catch (error) {
      console.error("❌ Error al actualizar cliente:", error);
      if (error instanceof Error) {
        alert(`No se pudo actualizar el cliente. ${error.message}`);
      } else {
        alert("No se pudo actualizar el cliente. Error desconocido.");
      }
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
      <h2>Lista de Participantes Registrados</h2>

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

      {/* Tabla de clientes */}
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente, index) => (
              <tr key={cliente.id}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{cliente.codigoSortec}</td>
                <td>{cliente.nombres.split(" ")[0]}</td>
                <td>{cliente.apellidos.split(" ")[0]}</td>
                <td style={{ color: cliente.estado === "aprobado" ? "green" : "inherit" }}>
                  {cliente.estado ? cliente.estado.charAt(0).toUpperCase() + cliente.estado.slice(1) : ""}
                </td>
                <td className="text-center" style={{ display: "none" }}>
                  {/* Botón de Ver */}
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleView(cliente)}
                  >
                    👁 Ver
                  </button>

                  {/* Botón de Editar */}
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(cliente)}
                  >
                    ✏ Editar
                  </button>

                  {/* Botón de Eliminar */}
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(cliente.id)}
                  >
                    🗑 Eliminar
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