"use client";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
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

  

  const games = [
    { title: "Aladdin", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/k0cc2zsgtuzhhhxpl7go.jpg", description: "Revive la aventura del clásico de Disney en un juego de plataformas lleno de magia." },
    { title: "Batman Forever", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/ldedzl98tpkjbxxvfkv9.jpg", description: "Lucha contra el crimen en Gotham como el Caballero Oscuro en esta entrega llena de acción." },
    { title: "Castlevania IV", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/szqtckq7nf8zopoztusl.jpg", description: "Acompaña a Simon Belmont para enfrentar a Drácula en esta épica aventura gótica." },
    { title: "Darius Twin", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043169/SortecVoucher/Juegos/SuperNintendo/Imagenes/ftryp4srfi2dgedc8fvv.jpg", description: "Dispara a través del espacio en este shoot'em up futurista." },
    { title: "DK Country", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043164/SortecVoucher/Juegos/SuperNintendo/Imagenes/avuej1sczurylibrjtus.jpg", description: "Explora la jungla en la primera entrega de la famosa saga de plataformas." },
    { title: "DK Country 2", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043164/SortecVoucher/Juegos/SuperNintendo/Imagenes/ihnsl3lqyb1bc9bsuivu.jpg", description: "Aventura con Diddy y Dixie Kong para rescatar a Donkey." },
    { title: "DK Country 3", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/bvsarpgwz8ihhm52wsvb.jpg", description: "La aventura final con Dixie y Kiddy en nuevos mundos coloridos." },
    { title: "Doom", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/c1axumvxut6pi0chikvw.jpg", description: "FPS pionero adaptado a SNES, lucha contra demonios en Marte." },
    { title: "DBZ Hyper Dimension", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/pejenm0z8bodzxx2kcvt.jpg", description: "Pelea como Goku, Vegeta y otros en intensos combates del universo DBZ." },
    { title: "FF III", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/nuhtvfnscqtpgjwkgvmw.jpg", description: "Una obra maestra RPG con personajes memorables y una historia profunda." },
    { title: "FF Mystic Quest", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/bfoewqwvl3ivd0i09qqy.jpg", description: "RPG accesible diseñado para jugadores principiantes con buenos gráficos y música." },
    { title: "Final Fight", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/btvhrbxohjmtnduaxtqn.jpg", description: "Clásico beat 'em up callejero con Cody, Guy y Haggar." },
    { title: "Final Fight 2", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/tjlrkqr9kckthpenwmon.jpg", description: "Continúa la lucha contra el crimen con nuevos personajes y escenarios." },
    { title: "Final Fight 3", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043164/SortecVoucher/Juegos/SuperNintendo/Imagenes/irpktcuxarh77mrw2gar.jpg", description: "Más combos y personajes nuevos en esta evolución del beat 'em up." },
    { title: "Home Alone", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/ts5eyxvlubxhbixhjxff.jpg", description: "Defiende tu casa con trampas locas en esta adaptación de la película." },
    { title: "The Simpson", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/vlropnergrnq9snvrev4.jpg", description: "Ayuda a Krusty el payaso a deshacerse de los ratones en su casa." },
    { title: "Mario Missing!", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043165/SortecVoucher/Juegos/SuperNintendo/Imagenes/st0grdhkamlkwxnmcul2.jpg", description: "Juego educativo protagonizado por Luigi en la búsqueda de Mario." },
    { title: "Mega Man X", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/xgxm9w8psadaib8wdpdz.jpg", description: "Versión moderna de Mega Man con nuevos poderes y diseño futurista." },
    { title: "Mega Man X2", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/vfig7vuaecpxq7y8ztib.jpg", description: "Más acción y mejoras tecnológicas en esta gran secuela." },
    { title: "Mega Man X3", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/k5556rmnr6bczuas7lqj.jpg", description: "Enfrenta a los Reploids rebeldes en esta entrega desafiante." },
    { title: "Pac-Man 2", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/nouzqhippsciw6gapxkf.jpg", description: "Una aventura interactiva protagonizada por el clásico Pac-Man." },
    { title: "Pinocchio", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/ssxekb1hj4ivm4nxh9i7.jpg", description: "Revive la historia de Pinocho en este tierno juego de plataformas." },
    { title: "Scooby-Doo", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/c5to7k0deyo7g5jcky25.jpg", description: "Resuelve misterios con Scooby y la pandilla en dos historias completas." },
    { title: "Secret of Mana", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043166/SortecVoucher/Juegos/SuperNintendo/Imagenes/mmcz3ums8r1s8ofd1lyh.jpg", description: "RPG de acción con combate en tiempo real y modo cooperativo." },
    { title: "Spider-Man", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/lvoeqauwvnggaaqqcz6x.jpg", description: "Aventura crossover enfrentando a villanos de Marvel." },
    { title: "Street Fighter II", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/whkud7yc5t6uqdbxyvt1.jpg", description: "Peleas clásicas con Ryu, Ken y más en el juego de lucha más famoso." },
    { title: "Sunset Riders", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/x3np1b7o3rtjb0fxalw4.jpg", description: "Disparos en el lejano oeste en este divertido arcade cooperativo." },
    { title: "Super Double Dragon", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/hwapfaalvsyaxp6n3kff.jpg", description: "Billy y Jimmy regresan a limpiar las calles de enemigos." },
    { title: "Super Mario All-Stars", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/ks07cabshihvk8lmlybt.jpg", description: "Colección remasterizada de los juegos clásicos de Mario." },
    { title: "Super Mario Kart", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/jyld9mjuqdk89xeggqmh.jpg", description: "Carreras con ítems y personajes del universo Mario." },
    { title: "Super Mario World", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/mjtoyzce42rsrza9ejb2.jpg", description: "Mario y Yoshi exploran Dinosaur Land para rescatar a Peach." },
    { title: "Super Metroid", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/l9xzbdunzmqfjs3t4uqz.jpg", description: "Aventura de exploración con Samus Aran en un planeta hostil." },
    { title: "Super Soccer", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/oc0tsn0dvc0idmg18oxh.jpg", description: "Fútbol arcade con equipos nacionales y mecánicas simples." },
    { title: "Super Street Fighter II", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/dojjqi32vdbhzovoap6j.jpg", description: "Versión extendida con más personajes y movimientos especiales." },
    { title: "Super Tennis", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043167/SortecVoucher/Juegos/SuperNintendo/Imagenes/kzhs3clklbiuxjikp24a.jpg", description: "Juego de tenis competitivo con modos de torneo y dobles." },
    { title: "Tetris 2", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/wuonb0iydqjrih68bkye.jpg", description: "Una nueva versión del clásico rompecabezas con bloques de colores." },
    { title: "The Jungle Book", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/cum3shyl4g2ehrwjssfp.jpg", description: "Plataformas basado en la película animada de Disney." },
    { title: "Top Gear 3000", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/sp6o6x9jaa5tn2yfgziw.jpg", description: "Carreras futuristas a alta velocidad por el espacio." },
    { title: "Turtles in Time", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/d9uksrmqohuss9pevnao.jpg", description: "Viajes temporales con las Tortugas Ninja en modo cooperativo." },
    { title: "Yoshi's Island", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1746043168/SortecVoucher/Juegos/SuperNintendo/Imagenes/shx50iore50h5uiy1zkz.jpg", description: "Juego de plataformas colorido con Yoshi y el bebé Mario." }
  ];


  
export default function SuperNintendoPage() {
    const [client, setClient] = useState<Perfil | null>(null); 
    const router = useRouter();
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [modalBg, setModalBg] = useState("");
    const [startX, setStartX] = useState(0);
    const [endX, setEndX] = useState(0);
    
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
      setStartX(e.touches[0].clientX);
    };
    
    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
      setEndX(e.touches[0].clientX);
    };
    
    const handleTouchEnd = () => {
      const diffX = startX - endX;
      if (diffX > 50) {
        handleNext(); // Desliza a la izquierda -> Siguiente tarjeta
      } else if (diffX < -50) {
        handlePrev(); // Desliza a la derecha -> Tarjeta anterior
      }
    };

    
    
    

  // Agregar evento para mover con el mouse y touch
const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
  const x = event.clientX;
  const center = window.innerWidth / 2;
  const difference = center - x;
  const angle = difference / 30;

  (document.querySelector(".carousel") as HTMLElement).style.transform = `rotateY(${angle}deg)`;
};

  const handleNext = () => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex + 1) % games.length;
      setSelectedIndex(newIndex);
      setModalBg(games[newIndex].img);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex - 1 + games.length) % games.length;
      setSelectedIndex(newIndex);
      setModalBg(games[newIndex].img);
    }
  };
  
  const handleCloseModal = () => {
    setSelectedIndex(null);
    setModalBg('');
  };
  


    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("client");
      setClient(null);
      router.push("/");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
      // ✅ Cargar cliente desde localStorage
      const storedClient = localStorage.getItem("client");
      if (storedClient) {
        setClient(JSON.parse(storedClient));
      }
    
      // 🔊 Reproducir video con audio al primer clic
      const video = document.querySelector(".snes-video") as HTMLVideoElement;
      const playWithSound = () => {
        if (video) {
          video.volume = 1;
          video.play().catch(() => {});
        }
        window.removeEventListener("click", playWithSound);
      };
      window.addEventListener("click", playWithSound);
    }, []);
    

  

    if (!client) return <p>Cargando...</p>;

  return (
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


        <Container fluid className="p-0">
                <div className="position-relative main-container">

                {/* 🔄 Video en forma de mando de SNES */}
                <div className="snes-banner-container">
                    <div className="snes-controller" 
                    style={{
                      position: "relative",
                      width: "100%",
                      maxWidth: "100%",
                      height: "89vh",
                      background: "#ffffff",
                      borderRadius: "80px",
                      border: "8px solid #666",
                      boxShadow: "inset 0 0 30px rgba(211, 202, 202, 0.88), 0 10px 40px rgba(247, 239, 239, 0.89)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      overflow: "hidden",
                    }}>
                      <div className="snes-body">
                      <video
                          src="/video/JuegosSuperNintendoPagina.mp4"
                          autoPlay
                          loop
                          className="snes-video"
                          playsInline
                          controls
                          style={{
                            width: "100vw",
                            height: "89vh",
                            display: "block",
                            borderRadius: "0px",
                            margin: "0 auto",
                            border: "none",
                            background: "#ccc"
                          }}                
                          
                        />

                      </div>

                      {/* Botones decorativos */}
                      {/* Botón cruz izquierda */}
                      <div
                        style={{
                          position: "absolute",
                          left: "5%",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: 60,
                          height: 60,
                          background: "#222",
                          clipPath:
                            "polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%)",
                          display: "block",
                        }}
                      />

                      {/* Botones A y B */}
                      <div
                        style={{
                          position: "absolute",
                          right: "5%",
                          top: "50%",
                          transform: "translateY(-50%)",
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            background: "#a00",
                            borderRadius: "50%",
                            boxShadow:
                              "inset 0 0 5px rgba(255, 255, 255, 0.89), 0 2px 5px rgba(255, 255, 255, 0.3)",
                          }}
                        ></span>
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            background: "#a00",
                            borderRadius: "50%",
                            boxShadow:
                              "inset 0 0 5px rgba(255, 255, 255, 0.93), 0 2px 5px rgba(255, 255, 255, 0.83)",
                          }}
                        ></span>
                      </div>

                      {/* Start y Select */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "8%",
                          display: "flex",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "10px",
                            background: "#444",
                            borderRadius: "6px",
                            boxShadow: "inset 0 0 2px #000",
                          }}
                        ></div>
                        <div
                          style={{
                            width: "50px",
                            height: "10px",
                            background: "#444",
                            borderRadius: "6px",
                            boxShadow: "inset 0 0 2px #000",
                          }}
                        ></div>
                      </div>

                    </div>
              </div>




                {/* ✅ Versión Escritorio - Título y botón alineados a la izquierda */}
                <div className="carousel-caption d-none d-md-block text-left" style={{ left: '5%', textAlign: 'left' }}>
                    <h1 className="animated-title" style={{ left: '5%', textAlign: 'left', color: "white", fontSize: '1.8rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                    marginBottom: '10px',
                    fontFamily: "book, Handset Sans UI, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji" }}>🎮 Descargar Emulador SuperNintendo con más de 237 juegos</h1>
                  <a 
                    href="https://drive.google.com/file/d/1OJnobh-5z46DArKnNJ8-lytMNe3TzNLe/view?usp=drive_link" 
                    className="btn btn-primary btn-lg" 
                    style={{
                      left: '5%', 
                      textAlign: 'left', 
                      width: "20%", 
                      background: "#ffcc00",
                      border: "none",
                      padding: "8px 15px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      justifyContent: "center"
                    }}
                    download
                  >
                    ⬇️ Descargar APK
                  </a>
                  <br/>
                  <a 
                    href="https://drive.google.com/file/d/1YY41y5BLy1EKnusrgSSQGQc5LHQI8eSy/view?usp=drive_link" 
                    className="btn btn-primary btn-lg" 
                    style={{
                      left: '5%', 
                      textAlign: 'left', 
                      width: "20%", 
                      background: "#ffcc00",
                      border: "none",
                      padding: "8px 15px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderRadius: "5px",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      textDecoration: "none",
                      justifyContent: "center"
                    }}
                    download
                  >
                    ⬇️ Descargar Pack Juegos SNES
                  </a>
                </div>

                {/* ✅ Versión Móvil - Texto y botones debajo del slide */}
                  <div className="d-block d-md-none text-center mt-3">
                      <h2 className="animated-title" style={{ color: "white" }}>
                          🎮 Descargar Emulador Nintendo con más de 237 juegos
                      </h2>
                      
                      <a 
                        href="https://drive.google.com/file/d/1OJnobh-5z46DArKnNJ8-lytMNe3TzNLe/view?usp=drive_link" 
                        className="btn btn-primary btn-lg" 
                        style={{
                          background: "#ffcc00",
                          border: "none",
                          padding: "10px 15px",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          borderRadius: "5px",
                          color: "black",
                          display: "block",
                          width: "80%",
                          margin: "10px auto",
                          textDecoration: "none"
                        }}
                        download
                      >
                          ⬇️ Descargar APK
                      </a>

                      <a 
                        href="https://drive.google.com/file/d/1YY41y5BLy1EKnusrgSSQGQc5LHQI8eSy/view?usp=drive_link" 
                        className="btn btn-primary btn-lg" 
                        style={{
                          background: "#ffcc00",
                          border: "none",
                          padding: "10px 15px",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          borderRadius: "5px",
                          color: "black",
                          display: "block",
                          width: "80%",
                          margin: "10px auto",
                          textDecoration: "none"
                        }}
                        download
                      >
                          ⬇️ Descargar Pack Juegos SNES
                      </a>
                  </div>

            </div>
        </Container>


      {/* Sección de Juegos */}
      <div className="game-section">
        <div className="game-title-container">
          <h1 className="game-section-title">
            📖 Listado de los Juegos Más Emblemáticos de SuperNintendo 📖
          </h1>
        </div>
        <div className="game-list">
          {games.map((game, index) => (
            <motion.div
              key={index}
              className="game-item"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div
                className="game-card"
                onClick={() => {
                  setSelectedIndex(index);
                  setModalBg(game.img);
                }}
              >
                <img src={game.img} alt={game.title} className="game-img" />
                <h5 className="game-title">{game.title}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal del Carrusel 3D */}
      {selectedIndex !== null && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div
              className="modal-background"
              style={{
                backgroundImage: `url(${modalBg})`,
              }}
            ></div>
            
            <div className="carousel-3d" 
            onMouseMove={handleMouseMove} 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            >
              <FaTimes className="close-icon" onClick={handleCloseModal} style={{
                    paddingBottom: "300px",
                    position: "relative",
                    top: "-210px",
                    right: "10px", 
                    fontSize: "30px",
                    cursor: "pointer",
                    color: "black",
                    backgroundColor: "rgba(0, 0, 0, 0.6)", /* Para hacerlo más visible */
                    padding: "10px",
                    borderRadius: "50%",
                    zIndex: 1100 
              }} />
              <FaChevronLeft className="nav-arrow left-arrow" onClick={handlePrev} />
              <div className="carousel">
              {games.map((game, index) => {
                const isActive = index === selectedIndex;
                const isPrev = index === (selectedIndex - 1 + games.length) % games.length;
                const isNext = index === (selectedIndex + 1) % games.length;

                return (
                  <div
                    key={index}
                    className={`carousel-card ${isActive ? "active" : isPrev ? "prev" : isNext ? "next" : ""}`}
                    style={{
                      transform: isActive
                        ? "scale(1.1) translateZ(200px)"
                        : isPrev
                        ? "rotateY(20deg) translateX(-150px) translateZ(100px)"
                        : isNext
                        ? "rotateY(-20deg) translateX(150px) translateZ(100px)"
                        : "rotateY(0deg) translateZ(0px)"
                    }}
                  >
                    <img src={game.img} alt={game.title} className="carousel-img" />
                    <h4>{game.title}</h4>
                    <p className="game-description">{game.description}</p>
                  </div>
                );
              })}
              </div>
              <FaChevronRight className="nav-arrow right-arrow" onClick={handleNext} />
            </div>
          </div>
        </div>
      )}

            
            {/* Video Tutorial para instalación del aplicativo */}
                <div className="instruction-section">
                    <h2 className="instruction-title">
                        📥 Cómo Descargar e Instalar el APK y los 237 juegos en tu Android 📲
                    </h2>

                    <ul className="instruction-list">
                        <li>
                            <strong>📥 Paso 1:</strong> Descarga el archivo <strong>APK</strong> 
                            desde el botón de descarga al inicio de la página.
                        </li>
                        
                        <li>
                            <strong>🎮 Paso 2:</strong> Descarga el <strong>Pack de Juegos SNES</strong> 
                            desde el botón <strong>Descargar Pack Juegos SNES</strong>.
                        </li>
                        
                        <li>
                            <strong>📂 Paso 3:</strong> Descarga la app para descomprimir el pack de juegos  
                            <a href="https://drive.google.com/file/d/1068XXOWIn3PCcLkPQryZ3PToM6k-XMi1/view?usp=drive_link" 
                                className="download-link" download>
                                haciendo click aquí
                            </a>.
                        </li>

                        <li>
                            <strong>⚙️ Paso 4:</strong> Ve a <strong>⚙️ Ajustes → Seguridad</strong> 
                            y activa la opción <strong>✅ “Fuentes desconocidas”</strong>.
                        </li>

                        <li>
                            <strong>📂 Paso 5:</strong> Abre la carpeta de <strong>Descargas</strong> o 
                            la ubicación donde descargaste los archivos.
                        </li>

                        <li>
                            <strong>📲 Paso 6:</strong> Instala el emulador 📦 
                            <strong>Snes9xEX-Plus-1.5.55-Arm64-v8a(www.farsroid.com).apk</strong>.
                        </li>

                        <li>
                            <strong>⏳ Paso 7:</strong> Espera a que la instalación finalice.
                        </li>

                        <li>
                            <strong>📂 Paso 8:</strong> Instala la aplicación 📦 <strong>rar-7.00-build22.apk</strong>.
                        </li>

                        <li>
                            <strong>📁 Paso 9:</strong> Abre el archivo **Pack de Juegos SNES.zip** con la app <strong>RAR 📦</strong>.
                        </li>

                        <li>
                            <strong>🔓 Paso 10:</strong> En la app **RAR**, toca <strong>“Descomprimir”</strong>. 
                            Deja la ruta predeterminada. ⏳ **Tomará unos minutos**.
                        </li>

                        <li>
                            <strong>🎮 Paso 11:</strong> Abre la app **Snes9xEX-Plus** y toca los **tres puntos (⋮)** 
                            en la esquina superior derecha.
                        </li>

                        <li>
                            <strong>🔎 Paso 12:</strong> Selecciona <strong>“Search ROMs”</strong> y luego <strong>“IMPORT FROM FILE” 📂</strong>.
                        </li>

                        <li>
                            <strong>📁 Paso 13:</strong> Busca y selecciona la carpeta donde se descomprimieron los juegos.
                        </li>

                        <li>
                            <strong>✅ Paso 14:</strong> Si aparece un mensaje, toca **Aceptar** y espera **5 a 8 minutos** 
                            hasta que el emulador cargue los juegos.
                        </li>

                        <li>
                            <strong>🚀 Paso 15:</strong> ¡Listo! 🎉 **Abre la app Snes9xEX-Plus** y disfruta de los juegos. 🎮🔥
                        </li>
                    </ul>

                    <h3 className="video-title">📱💡 Video Tutorial: 📥 Instala en tu Móvil Fácilmente! 🔧📲</h3>

                    <video 
                                    src="/video/VideoSNES.mp4"
                                    controls 
                                    style={{ 
                                      width: "90%", 
                                      maxWidth: "350px", 
                                      height: "auto", 
                                      borderRadius: "50px", 
                                      border: "5px solid #000", 
                                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)"
                                    }} 
                                    className="video-tutorial"
                                  />
                </div>
    
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
                transition: background 1s ease-in-out;
                padding-top: 40px; /* ✅ Este espacio separará el slider del menú */
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

              
@media (max-width: 768px) {
  .snes-controller video {
    display: block !important;
    margin: 0 auto !important;
    width: 100% !important;
    max-width: 100% !important;
    border-radius: 20px;
    align-items: center;
    justify-content: center;
    border-radius: 40px !important;
  }

  .snes-controller {
    height: auto !important;
    border-radius: 70px !important;
    flex-direction: column;
    padding: 10px;
    margin: 0 10px;
  }

  .snes-controller video {
    height: auto !important;
    max-height: 280px;
    aspect-ratio: 16 / 9;
    border-radius: 20px;
  }

  /* Botones decorativos - móvil */
  .snes-controller > div[style*="clipPath"] {
    width: 40px !important;
    height: 40px !important;
    left: 10px !important;
  }

  .snes-controller > div[style*="gap"] span {
    width: 20px !important;
    height: 20px !important;
  }

  .snes-controller > div[style*="gap"] {
    right: 10px !important;
    gap: 10px !important;
  }

  .snes-controller > div[style*="bottom"] div {
    width: 30px !important;
    height: 6px !important;
  }
}




      `}</style>
    </div>
  )
};

