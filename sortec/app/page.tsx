"use client"; // 🔹 Agregar esta línea en la parte superior

import { useState } from "react";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import Image from "next/image";

export default function Home() {
  const [showClients, setShowClients] = useState(false);

  return (
    <div className="container">

      {/* Banner y Logo */}
      <div className="banner-container">
        <Image src="/images/bannerSORTECOriginal.png" alt="Banner" width={1200} height={180} priority />
        <div className="logo-container">
          <Image src="/images/logoSORTECOriginal.png" alt="SorTect Logo" width={120} height={120} className="rounded-circle border border-white shadow" priority />
        </div>
      </div>

      {/* Título animado */}
      <h1 className="animated-title">FORMULARIO DE REGISTRO PARA EL GRAN SORTEO EN - SORTEC</h1>

      {/* Mantiene el formulario de registro */}
      <ClientForm />

      {/* Botón para mostrar el listado de clientes */}
      <div className="text-center mt-3">
        <button 
          className="btn btn-primary" 
          onClick={() => setShowClients(true)}
        >
          Cargar Participantes
        </button>
      </div>

      <hr />

      {/* Se muestra la lista de clientes solo después de hacer clic en el botón */}
      {showClients && <ClientList />}
    </div>
  );
}
