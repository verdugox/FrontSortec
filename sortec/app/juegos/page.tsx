"use client";

import { useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const games = [
  { title: "Nintendo", img: "/images/nintendo.jpeg", description: "Juegos clásicos de Nintendo.", video: "/video/VideoNES.mp4", link: "/juegos/nintendo" },
  { title: "Super Nintendo", img: "/images/super-nintendo.jpeg", description: "Revive la nostalgia con Super Nintendo.", video: "/video/VideoSNES.mp4", link: "/juegos/superNintendo" },
  { title: "Nintendo 64", img: "/images/nintendo64.jpeg", description: "Explora juegos en 3D con Nintendo 64.", video: "/video/VideoNintendo64.mp4", link: "/juegos/nintendo64" },
  { title: "Game Boy Advance", img: "/images/gameboy-advance.jpeg", description: "Gráficos mejorados con Game Boy Advance.", video: "/video/VideoGameBoy.mp4", link: "/juegos/gameBoyAdvance" },
  { title: "PlayStation 1", img: "/images/ps1.jpeg", description: "El inicio de la era PlayStation.", video: "/video/VideoOtros.mp4", link: "/juegos/playstation1" },
  { title: "PlayStation 2", img: "/images/ps2.jpeg", description: "Una consola icónica de la historia de los videojuegos.", video: "/video/VideoOtros.mp4", link: "/juegos/playstation2" },
  { title: "PSP", img: "/images/psp.jpeg", description: "Lleva tus juegos favoritos a cualquier parte con PSP.", video: "/video/VideoOtros.mp4", link: "/juegos/psp" },
  { title: "PSP Vita", img: "/images/pspvita.jpeg", description: "Gráficos de alta calidad en la palma de tu mano.", video: "/video/VideoOtros.mp4", link: "/juegos/pspVita" },
  { title: "Nintendo GameCube", img: "/images/gamecube.jpeg", description: "Diversión en cubos con GameCube.", video: "/video/VideoOtros.mp4", link: "/juegos/nintendoGameCube" },
  { title: "Juegos para Nintendo Switch", img: "/images/switch.jpeg", description: "Diversión portátil con Nintendo Switch.", video: "/video/VideoOtros.mp4", link: "/juegos/nintendoSwitch" }
];

export default function JuegosPage() {
  const [modals, setModals] = useState(Array(games.length).fill(false));

  const handleOpenModal = (index: number) => {
    const updatedModals = [...modals];
    updatedModals[index] = true;
    setModals(updatedModals);
  };

  const handleCloseModal = (index: number) => {
    const updatedModals = [...modals];
    updatedModals[index] = false;
    setModals(updatedModals);
  };

  const client = JSON.parse(localStorage.getItem("client") || 'null');
  

  return (
    <Container className="games" id="games"  style={{ color: "#007bff", marginBottom: "20px"}}>
      <h2 style={{ color: "#007bff", marginBottom: "20px" }}>Grandes Juegos Virtuales</h2>
      <p style={{ color: "#555", fontSize: "18px", fontStyle: "italic", marginBottom: "20px" }}>
        🎮 Pronto en SORTEC podrás disfrutar de los mejores juegos virtuales para descargar. 🚀 Sumérgete en un mundo lleno de aventuras, desafíos y diversión sin límites.
      </p>
      <Row>
        {games.map((game, index) => (
          <Col md={4} key={index} className="p-3">
            <motion.div 
              initial={{ opacity: 0, y: 50 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <img 
                src={game.img} 
                alt={game.title} 
                className="img-fluid rounded-circle game-img" 
                style={{ width: "150px", height: "150px", cursor: "pointer" }} 
                onClick={() => handleOpenModal(index)} 
              />
              <h5 style={{ color: "#007bff", marginBottom: "20px" }}>{game.title}</h5>
            </motion.div>

            {/* Modal individual para cada juego */}
            <Modal show={modals[index]} onHide={() => handleCloseModal(index)} centered>
              <Modal.Header closeButton>
                <Modal.Title>{game.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body className="text-center">
                <p style={{ textAlign: "center", fontSize: "18px", color: "#333", lineHeight: "1.6" }}>
                <strong>🎮🔥
                  {game.description}
                </strong>
                </p>
                <p style={{ textAlign: "center", fontSize: "18px", color: "#333", lineHeight: "1.6" }}>
                  <strong>🎮🔥 ¡Accede a más de 10,000 juegos con tu suscripción! 🔥🎮</strong><br />
                  🌟 <strong>¡Bienvenido al futuro del gaming!</strong> 🌟<br />
                  Suscríbete hoy y desbloquea un catálogo de <strong>más de 10,000 juegos</strong> 🎮 disponibles para 
                  <strong> Dispositivos Móviles</strong> 📱💻🎮.<br /><br />
                </p>
                {/* Video con bordes ovalados simulando una pantalla de celular */}
                <div style={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  width: "100%" 
                }}>
                  <video 
                    src={game.video} 
                    controls 
                    style={{ 
                      width: "90%", 
                      maxWidth: "350px", 
                      height: "auto", 
                      borderRadius: "50px", 
                      border: "5px solid #000", 
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
                    }} 
                  />
                </div>
                {/* Mensaje llamativo dentro del modal */}
                <p style={{ textAlign: "center", fontSize: "18px", color: "#333", lineHeight: "1.6" }}>
                  ✅ <strong>Juegos exclusivos de PlayStation, Xbox, Nintendo y PC.</strong> 🕹️<br />
                  ✅ <strong>Emuladores y clásicos de todas las generaciones.</strong> 🏆<br />
                  ✅ <strong>Acceso a eventos, torneos y beneficios especiales.</strong> 🎁🔥<br /><br />

                  🔑 <strong>¡No te quedes fuera!</strong> 🔑<br />
                  Inicia sesión, <strong>haz clic en el botón</strong> y <strong>descubre un universo de entretenimiento sin límites.</strong> 🚀🎮<br /><br />

                  <strong style={{ fontSize: "22px", color: "#007bff" }}>🔽 ¡Inicia Sesión y haz click en el botón para acceder al Portal de Juegos! 🔽</strong>
                </p>

                {/* Botón para ingresar al portal de juegos */}
                {client ? (
                  <Button 
                    variant="primary" 
                    href={game.link} 
                    style={{ marginTop: "15px", width: "100%" }}
                  >
                    Haz Click Aquí para Ingresar al Portal de Juegos - {game.title}
                  </Button>
                ) : null}

              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => handleCloseModal(index)}>Cerrar</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        ))}
      </Row>
      <style jsx>{`



        .game-img {
          transition: all 0.4s ease-in-out;
          box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.5);
        }

        .game-img:hover {
          transform: scale(1.1);
          box-shadow: 0px 0px 20px rgba(0, 123, 255, 0.8);
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




`}</style>

    </Container>

        

  );
}
