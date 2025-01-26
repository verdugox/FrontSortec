"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface Cliente {
  id?: string;
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

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    filterClientes();
  }, [searchTerm, clientes, rowsPerPage, currentPage]);

  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) {
        throw new Error("Error al obtener clientes.");
      }
      const data = await response.json();
      setClientes(data);
      setFilteredClientes(data.slice(0, rowsPerPage));
    } catch (error) {
      console.error("❌ Error al obtener clientes:", error);
      setError("No se pudo obtener la lista de clientes.");
    }
  };

  const filterClientes = () => {
    const filtered = clientes
      .filter((cliente) =>
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
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al eliminar cliente: ${errorData.error}`);
      }
      alert("Cliente eliminado correctamente.");
      fetchClientes();
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
      if (error instanceof Error) {
        alert(`No se pudo eliminar el cliente. ${error.message}`);
      } else {
        alert("No se pudo eliminar el cliente. Error desconocido.");
      }
    }
  };

  const handleEdit = async (cliente: Cliente) => {
    try {
      const response = await fetch(`/api/clients/${cliente.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al actualizar cliente: ${errorData.error}`);
      }
      alert("Cliente actualizado correctamente.");
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

  const totalPages = Math.ceil(clientes.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes Registrados</h2>
      {error && <p className="alert alert-danger">{error}</p>}

      {/* Filtros y configuración de tabla */}
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Buscar cliente..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-3">
          <select className="form-control" value={rowsPerPage} onChange={handleRowsChange}>
            <option value={5}>Mostrar 5</option>
            <option value={10}>Mostrar 10</option>
            <option value={20}>Mostrar 20</option>
          </select>
        </div>
      </div>

      {/* Tabla de clientes */}
      <div className="table-responsive">
        <table className="table table-hover table-striped table-bordered">
          <thead className="table-dark text-center">
            <tr>
              <th>#</th>
              <th>DNI</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Dirección</th>
              <th>Referencia Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClientes.map((cliente, index) => (
              <tr key={cliente.id}>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{cliente.dni}</td>
                <td>{cliente.nombres}</td>
                <td>{cliente.apellidos}</td>
                <td>{cliente.direccion}</td>
                <td>{cliente.referenciaPago}</td>
                <td className="text-center">
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

      {/* Modal para ver cliente */}
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}