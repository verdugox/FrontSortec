"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaReddit, FaTrash, FaEye } from "react-icons/fa";
import Image from "next/image";

// **Interfaz para los clientes**
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
  vaucher: string;
  referenciaPago: string;
}

export default function Home() {
  const [formData, setFormData] = useState<Cliente>({
    dni: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    pais: "Perú",
    provincia: "",
    distrito: "",
    correo: "",
    telefono: "",
    vaucher: "",
    referenciaPago: "",
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string>("");
  const [showClientes, setShowClientes] = useState<boolean>(false);
  const tableRef = useRef<HTMLTableElement>(null);

  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.vaucher) {
      setError("Debes adjuntar un comprobante de pago (Yape o Plin).");
      return;
    }

    try {
      await axios.post("/api/clients", formData);
      alert("Cliente registrado con éxito!");
      setFormData({
        dni: "",
        nombres: "",
        apellidos: "",
        direccion: "",
        pais: "Perú",
        provincia: "",
        distrito: "",
        correo: "",
        telefono: "",
        vaucher: "",
        referenciaPago: "",
      });
      setError("");
      fetchClientes();
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      setError("Error al registrar cliente. Inténtalo nuevamente.");
    }
  };

  // Obtener clientes desde el API
  const fetchClientes = async () => {
    try {
      const response = await axios.get("/api/clients");
      setClientes(response.data);
      setShowClientes(true);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("No se pudo obtener la lista de clientes.");
    }
  };

  // Cargar jQuery y DataTables dinámicamente en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("jquery").then(($) => {
        import("datatables.net-bs5").then(() => {
          import("datatables.net-responsive-bs5").then(() => {
            if (tableRef.current) {
              $(tableRef.current).DataTable({
                responsive: true,
                paging: true,
                pageLength: 5,
                searching: true,
                ordering: true,
                destroy: true,
                language: {
                  lengthMenu: "Mostrar _MENU_ registros por página",
                  zeroRecords: "No hay clientes registrados",
                  info: "Mostrando _START_ a _END_ de _TOTAL_ clientes",
                  infoEmpty: "No hay clientes disponibles",
                  infoFiltered: "(filtrado de _MAX_ registros totales)",
                  search: "Buscar:",
                  paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior",
                  },
                },
              });
            }
          });
        });
      });
    }
  }, [showClientes]);

  return (
    <div className="container mt-4">
      {/* Banner y Logo */}
      <div className="banner-container">
        <Image src="/images/bannerSORTECOriginal.png" alt="Banner" width={1200} height={180} priority />
        <div className="logo-container">
          <Image src="/images/logoSORTECOriginal.png" alt="SorTect Logo" width={120} height={120} className="rounded-circle border border-white shadow" priority />
        </div>
      </div>

      {/* Título animado */}
      <h1 className="animated-title">REGISTRO DE GANADORES - SORTEC</h1>

      {error && <p className="alert alert-danger">{error}</p>}

      {/* Formulario de Registro */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
        <h4>Datos Personales</h4>
        <div className="row">
          <div className="col-md-6">
            <input type="text" name="dni" placeholder="DNI" className="form-control mb-2" required onChange={handleChange} />
            <input type="text" name="nombres" placeholder="Nombres" className="form-control mb-2" required onChange={handleChange} />
            <input type="text" name="apellidos" placeholder="Apellidos" className="form-control mb-2" required onChange={handleChange} />
            <input type="text" name="direccion" placeholder="Dirección" className="form-control mb-2" required onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <input type="text" name="provincia" placeholder="Provincia" className="form-control mb-2" required onChange={handleChange} />
            <input type="text" name="distrito" placeholder="Distrito" className="form-control mb-2" required onChange={handleChange} />
            <input type="email" name="correo" placeholder="Correo" className="form-control mb-2" required onChange={handleChange} />
            <input type="text" name="telefono" placeholder="Teléfono" className="form-control mb-2" required onChange={handleChange} />
          </div>
        </div>

        <h4>Información de Pago</h4>
        <input type="text" name="referenciaPago" placeholder="Referencia de Pago" className="form-control mb-2" required onChange={handleChange} />
        <input type="file" name="vaucher" className="form-control mb-3" accept="image/png, image/jpeg" required onChange={handleChange} />

        <button type="submit" className="btn btn-success">Registrar Cliente</button>
      </form>

      {/* Botón para mostrar lista de clientes */}
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={fetchClientes}>
          {showClientes ? "Actualizar Lista" : "Cargar Clientes"}
        </button>
      </div>

      {/* Tabla de clientes */}
      {showClientes && (
        <div className="table-responsive p-3 bg-white shadow rounded mt-3">
          <table ref={tableRef} className="table table-hover table-striped table-bordered">
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
              {clientes.map((cliente, index) => (
                <tr key={cliente.id}>
                  <td>{index + 1}</td>
                  <td>{cliente.dni}</td>
                  <td>{cliente.nombres}</td>
                  <td>{cliente.apellidos}</td>
                  <td>{cliente.direccion}</td>
                  <td>{cliente.referenciaPago}</td>
                  <td>
                    <button className="btn btn-sm btn-info mx-1"><FaEye /></button>
                    <button className="btn btn-sm btn-warning mx-1"><FaReddit /></button>
                    <button className="btn btn-sm btn-danger mx-1"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
