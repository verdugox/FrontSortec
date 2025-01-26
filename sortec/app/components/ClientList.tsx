"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
}

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [error, setError] = useState<string>("");

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
        throw new Error("Error al eliminar cliente.");
      }
      alert("Cliente eliminado correctamente.");
      fetchClientes();
    } catch (error) {
      console.error("❌ Error al eliminar cliente:", error);
      alert("No se pudo eliminar el cliente.");
    }
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
                    onClick={() => window.open(cliente.voucherUrl, "_blank")}
                  >
                    👁 Ver
                  </button>

                  {/* Botón de Editar (Futuro) */}
                  <button className="btn btn-warning btn-sm me-2" disabled>
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
    </div>
  );
}