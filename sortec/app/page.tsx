"use client";

import { useState } from "react";
import axios from "axios";

// Definir interfaz para el formulario
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

  const [error, setError] = useState<string>("");
  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await axios.post("/api/clients", formData);
      alert("Cliente registrado con éxito!");
      console.log(response.data);

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
    } catch (error) {
      console.error("Error al registrar cliente:", error);
      setError("Error al registrar cliente. Inténtalo nuevamente.");
    }
  };

  // Obtener clientes desde la API interna de Next.js
  const fetchClientes = async () => {
    try {
      const response = await axios.get("/api/clients");
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setError("No se pudo obtener la lista de clientes.");
    }
  };

  return (
    <div className="container">
      <h1>Registro de Clientes - SorTect</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="dni" placeholder="DNI" required onChange={handleChange} />
        <input type="text" name="nombres" placeholder="Nombres" required onChange={handleChange} />
        <input type="text" name="apellidos" placeholder="Apellidos" required onChange={handleChange} />
        <input type="text" name="direccion" placeholder="Dirección" required onChange={handleChange} />
        <input type="text" name="provincia" placeholder="Provincia" required onChange={handleChange} />
        <input type="text" name="distrito" placeholder="Distrito" required onChange={handleChange} />
        <input type="email" name="correo" placeholder="Correo" required onChange={handleChange} />
        <input type="text" name="telefono" placeholder="Teléfono" required onChange={handleChange} />
        <input type="text" name="referenciaPago" placeholder="Referencia de Pago" required onChange={handleChange} />
        <input type="file" name="vaucher" required onChange={handleChange} />
        <button type="submit">Registrar Cliente</button>
      </form>

      <h2>Lista de Clientes</h2>
      <button onClick={fetchClientes}>Cargar Clientes</button>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            {cliente.nombres} {cliente.apellidos} - {cliente.correo}
          </li>
        ))}
      </ul>
    </div>
  );
}
