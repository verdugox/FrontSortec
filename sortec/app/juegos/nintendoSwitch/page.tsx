"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { GiGamepad } from "react-icons/gi";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";

interface Perfil {
  id: string;
  codigoSortec: string;
  dni: string;
  nombres?: string;
  apellidos?: string;
  direccion: string;
  pais?: string;
  provincia: string;
  distrito: string;
  correo?: string;
  telefono?: string;
  estado: string;
  fechaRegistro: string;
  rol: string;
  sexo?: string;
}

export default function NintendoSwitchPage() {
  const [client, setClient] = useState<Perfil | null>(null);
  const router = useRouter();

  useEffect(() => {
          const storedClient = localStorage.getItem("client");
          if (storedClient) {
              setClient(JSON.parse(storedClient));
          }
      }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    setClient(null);
    router.push("/");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};


  if (!client) return <p>Cargando...</p>;

  return (
    <div className="main-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <div className="main-container">
             <section>
                    <Menu 
                        client={client} 
                        onLogout={handleLogout} 
                        scrollToTop={scrollToTop}
                        onLoginClick={() => router.push('/login')} 
                        setShowLogin={(show: boolean) => console.log('Set show login:', show)}
                      />
              </section>
      </div>


      {/* Mensaje de página en construcción */}
      <div className="text-center my-auto" style={{ marginTop: "120px" }}>
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: [1, 1.1, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatType: "mirror" }}>
          <GiGamepad size={150} color="#00e5ff" style={{ filter: "drop-shadow(0 0 20px #00e5ff)" }} />
        </motion.div>

        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            marginTop: "30px",
            color: "#00e5ff",
            textShadow: "0 0 15px #00e5ff",
            fontSize: "2rem",
            fontWeight: "bold",
          }}
        >
          🎮 ¡Estamos trabajando en la página de Juegos! 🎮
        </motion.h2>
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ color: "#ffffff", fontSize: "1.3rem", fontStyle: "italic", textShadow: "0 0 10px #00e5ff" }}
        >
          Muy pronto tendrás acceso a más novedades, juegos emocionantes y mucho más.
        </motion.p>
      </div>

      {/* Footer */}
      <Footer />

      <style jsx>{`
                  /* Contenedor de iconos y QR */
                  .social-container {
                  display: flex;
                  align-items: center;
                  gap: 10px; /* Espaciado entre los iconos */
                  margin-left: auto; /* Mueve los iconos más a la izquierda en desktop */
                  margin-right: 50px; /* Los aleja un poco del borde derecho */
                  }

                  /* Estilos para los iconos de redes sociales */
                  .social-icon img {
                  width: 35px;
                  height: 35px;
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                  filter: drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.5));
                  }

                  .social-icon img:hover {
                  transform: scale(1.1);
                  box-shadow: 0 0 12px rgba(0, 123, 255, 0.8);
                  }

                  /* Estilo para el QR Code */
                  .qr-code {
                  width: 40px;
                  height: 40px;
                  margin-left: 5px; /* Más cerca de los iconos */
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                  filter: drop-shadow(0px 0px 4px rgba(255, 215, 0, 0.8));
                  }

                  .qr-code:hover {
                  transform: scale(1.05);
                  box-shadow: 0 0 12px rgba(255, 215, 0, 1);
                  }

                  /* Responsive para móviles */
                  @media (max-width: 768px) {
                  footer {
                    flex-direction: column;
                    text-align: center;
                  }

                  .social-container {
                    margin-top: 10px;
                    justify-content: center;
                    margin-left: 0;
                    margin-right: 0;
                  }

                  .social-icon img {
                    width: 30px;
                    height: 30px;
                  }

                  .qr-code {
                    width: 35px;
                    height: 35px;
                    margin-left: 3px;
                  }
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


                  /* Contenedor principal */
                  /* 🔹 Ajuste del slider-container para permitir que los juegos sobresalgan */
                  .slider-container {
                  position: relative;
                  width: 100%;
                  margin-bottom: -180px; /* 🔹 Aumenta la superposición de los juegos sobre el slider */
                  z-index: 1;
                  }

                  /* 🔹 Fusión del fondo con el slider y cambio dinámico */
                  .main-container {
                  width: 100%;
                  overflow-x: hidden;
                  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), #111, #002366);
                  transition: background 1s ease-in-out; /* 🔹 Efecto de transición de color */
                  }

                  /* Fondo del slider extendido con fusión */
                  .slider-container {
                  position: relative;
                  width: 100%;
                  margin-bottom: -150px; /* 🔹 Hace que las imágenes de juegos sobresalgan sobre el slider */
                  }

                  /* 🔹 Ajuste del degradado dinámico */
                  .carousel-gradient {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.95) 100%);
                  transition: background 1s ease-in-out; /* 🔹 Degradado dinámico */
                  z-index: 1;
                  }

                  .carousel-slide img {
                  z-index: 0;
                  }

                  .slider-caption {
                  display: flex;
                  align-items: flex-start;
                  justify-content: left;
                  text-align: left;
                  padding-left: 5%;
                  width: 50%;
                  position: absolute;
                  bottom: 20%;
                  z-index: 2;
                  }

                  .slider-text {
                  background: rgba(0, 0, 0, 0.6);
                  padding: 100px;
                  bottom: 80%
                  border-radius: 8px;
                  }

                  .carousel-title {
                  font-size: 3rem;
                  font-weight: bold;
                  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
                  color: #FFD700;
                  }

                  .carousel-description {
                  font-size: 1.2rem;
                  color: white;
                  }

                  /* 🔹 Ajustar la fusión del fondo con los juegos */
                  .game-section {
                      text-align: center;
                      padding-top: 40px;
                      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, #002366 100%);
                  }

                  .game-title-container {
                      padding: 20px;
                  }

                  .game-section-title {
                      color: white;
                      font-size: 1.8rem;
                      font-weight: bold;
                  }

                  .game-list {
                      display: flex;
                      flex-wrap: wrap;
                      justify-content: center;
                      gap: 20px;
                  }


                  .game-item {
                  width: 15%;
                  padding: 15px; /* 🔹 Añade margen interno para mejor distribución */
                  }

                  /* 🔹 Efecto dinámico en los juegos */
                  .game-card {
                  text-align: center;
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                  border-radius: 12px;
                  overflow: hidden;
                  cursor: pointer;
                  margin: 5px;
                  background: rgba(0, 0, 0, 0.7); /* 🔹 Fondo semi-transparente para que resalte */
                  padding: 10px;
                  }

                  .game-card:hover {
                  transform: scale(1.08);
                  box-shadow: 0 0 18px rgba(255, 215, 0, 1);
                  }

                  .game-img {
                  width: 180px;
                  height: 260px;
                  border-radius: 10px;
                  object-fit: cover;
                  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.6);
                  cursor: pointer;
                  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                  }

                  .game-img:hover {
                  box-shadow: 0 0 20px rgba(255, 215, 0, 1);
                  }

                  .game-title {
                  text-align: center;
                  margin-top: 10px;
                  font-size: 1.1rem;
                  color: white;
                  }

                  .instruction-section {
                      text-align: center;
                      padding: 30px;
                      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, #002366 100%);
                      color: white;
                  }

                  .instruction-title {
                      font-size: 1.8rem;
                      font-weight: bold;
                      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
                      margin-bottom: 15px;
                  }

                  .instruction-list {
                      list-style: none;
                      padding: 0;
                      font-size: 1.2rem;
                  }

                  .instruction-list li {
                      margin: 10px 0;
                      display: flex;
                      align-items: center;
                      gap: 10px;
                  }


                  /* Contenedor del modal */
                  /* Modal Overlay */
                  .modal-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: rgba(0, 0, 0, 0.7); /* Oscurece el fondo de la página */
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                  }

                  /* Modal Content */
                  .modal-content {
                  position: relative;
                  width: 80%;
                  max-width: 900px;
                  height: 500px;
                  background: white;
                  border-radius: 10px;
                  padding: 20px;
                  overflow: hidden;
                  }

                  /* Modal Background */
                  .modal-background {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-size: cover;
                  background-position: center;
                  opacity: 0.3; /* Opaco para que no interfiera */
                  }

                  /* Carrusel 3D */
                  .carousel-3d {
                  position: relative;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  perspective: 1000px;
                  }

                  /* Contenedor del Carrusel */
                  .carousel {
                  position: relative;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  transform-style: preserve-3d;
                  width: 100%;
                  }

                  /* Tarjetas del Carrusel */
                  .carousel-card {
                  position: absolute;
                  width: 240px;
                  height: 350px;
                  background: white;
                  border-radius: 15px;
                  padding: 10px;
                  text-align: center;
                  transition: transform 0.5s ease, opacity 0.5s ease;
                  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
                  }

                  /* Tarjeta Activa */
                  .carousel-card.active {
                  transform: scale(1.1);
                  z-index: 10;
                  }

                  /* Imágenes en las tarjetas */
                  .carousel-img {
                  width: 100%;
                  height: 70%;
                  border-radius: 10px;
                  }


                  /* Títulos de las tarjetas */
                  h4 {
                  font-size: 18px;
                  margin-top: 10px;
                  }

                  /* Descripción */
                  p {
                  font-size: 14px;
                  color: gray;
                  }

                  /* Flechas de navegación */
                  .nav-arrow {
                  font-size: 30px;
                  cursor: pointer;
                  position: absolute;
                  top: 50%;
                  transform: translateY(-50%);
                  color: black;
                  }

                  .left-arrow {
                  left: 10px;
                  }

                  .right-arrow {
                  right: 10px;
                  }

                  /* Habilitar movimiento con el mouse */
                  .carousel {
                  cursor: grab;
                  }
                  .carousel:active {
                  cursor: grabbing;
                  }

                  /* Responsividad */
                  @media (max-width: 768px) {
                  .carousel-card {
                  width: 180px;
                  height: 300px;
                  }
                  .carousel-card:nth-child(1) {
                  transform: translateX(-120px) rotateY(20deg) scale(0.9);
                  }
                  .carousel-card:nth-child(3) {
                  transform: translateX(120px) rotateY(-20deg) scale(0.9);
                  }
                  }

                  .close-icon {
                  position: relative;
                  top: 10px; 
                  right: 10px; 
                  font-size: 30px;
                  cursor: pointer;
                  color: white;
                  background-color: rgba(0, 0, 0, 0.6); /* Para hacerlo más visible */
                  padding: 10px;
                  border-radius: 50%;
                  z-index: 1100; 
                  }

                  .close-icon:hover {
                  background-color: rgba(255, 0, 0, 0.8);
                  }

                  /* Ajuste para versión móvil: Mostrar 2 cartillas por fila */
                  @media (max-width: 768px) {
                  .game-list {
                  display: grid;
                  grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas pequeñas */
                  gap: 10px; /* Espacio entre elementos */
                  padding: 10px;
                  }

                  .game-item {
                  width: 90%; /* Para ocupar correctamente el espacio del grid */
                  display: flex;
                  justify-content: center;
                  }

                  .game-card {
                  width: 90%; /* Ajuste para que no ocupe todo el ancho */
                  }

                  .instruction-section {
                    text-align: left;
                    padding: 15px;
                    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 0%, #002366 100%);
                    color: white;
                    border-radius: 10px;
                    margin: 10px;
                  }

                  .instruction-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 10px;
                  }

                  .instruction-list {
                    list-style: none;
                    padding: 0;
                    font-size: 0.9rem;
                    text-align: left;
                  }

                  .instruction-list li {
                    margin: 8px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    line-height: 1.5;
                  }

                  .instruction-list strong {
                    font-size: 1rem;
                  }

                  .download-link {
                    color: #007bff;
                    text-decoration: underline;
                    font-weight: bold;
                  }

                  .video-title {
                    font-size: 1.3rem;
                    font-weight: bold;
                    text-align: center;
                    margin-top: 20px;
                  }

                  .video-tutorial {
                    width: 100%;
                    max-width: 320px;
                    height: auto;
                    border-radius: 15px;
                    border: 3px solid #fff;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
                    display: block;
                    margin: 10px auto;
                  }

                  /* Responsive para móviles */
                  @media (max-width: 768px) {
                    .instruction-title {
                        font-size: 1.3rem;
                    }

                    .instruction-list {
                        font-size: 0.85rem;
                    }

                    .instruction-list li {
                        font-size: 0.85rem;
                        margin: 6px 0;
                    }

                    .video-title {
                        font-size: 1.1rem;
                    }
                  }

                  .game-description {
                  font-size: 16px;
                  color: gray;
                  text-align: center;
                  padding: 0px;
                  }

                  /* 🔹 Estilos para móviles */
                  @media (max-width: 768px) {
                  .game-description {
                    font-size: 11px; /* 🔹 Texto más pequeño para móviles */
                    line-height: 1.2; /* 🔹 Mejor distribución del texto */
                    max-width: 100%; /* 🔹 Evita que sobresalga */
                    margin: 0 auto; /* 🔹 Centra el texto dentro de la tarjeta */
                  }
                  }


                  `}</style>
      </div>
    
  );
}