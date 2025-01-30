"use client"; 

import { useState } from "react";
import ClientForm from "./components/ClientForm";
import ClientList from "./components/ClientList";
import Chat from "./components/Chat";
import Image from "next/image";

export default function Home() {
  const [showClients, setShowClients] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleShowClients = () => {
    setShowClients(true);
    setReloadTrigger(prev => prev + 1); // 🔹 Recarga ClientList.tsx al aumentar reloadTrigger
  };

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
          onClick={handleShowClients}
        >
          Cargar Participantes
        </button>
      </div>

      <hr />

      {/* Se muestra la lista de clientes solo después de hacer clic en el botón */}
      {showClients && <ClientList reloadTrigger={reloadTrigger} />}

      {/* Componente de chat para mostrar el conteo de participantes aprobados */}
      {showClients && <Chat />}

      {/* Mensaje destacado */}
      <div className="highlight-message">
        <i className="fas fa-gift"></i>
        
        FECHA DEL PRIMER SORTEO DE SORTEC SE REALIZARA EL DIA 13 DE FEBRERO.
        <i className="fas fa-gift"></i>
      </div>
    </div>
  );
}