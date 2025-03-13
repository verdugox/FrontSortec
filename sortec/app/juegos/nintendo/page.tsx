"use client";

import { useState, useEffect } from "react";
import { Nav, Navbar, Dropdown, Carousel, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";


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
    { title: "Asterik", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884016/Asterix_si0nlz.jpg", description: "Acompaña a Astérix en una aventura llena de acción y desafíos." },
    { title: "BackToTheFutureII", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884009/BackToTheFuitureII_fr1mjb.jpg", description: "Viaja en el tiempo con Marty McFly en esta emocionante adaptación del clásico del cine." },
    { title: "BalloonFight", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884023/BalloonFight_ocucm3.jpg", description: "Un divertido juego arcade donde debes explotar los globos de tus enemigos antes de que lo hagan contigo." },
    { title: "Baseball", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884022/Baseball_tc2sai.jpg", description: "Disfruta del clásico deporte en su versión 8 bits con jugabilidad sencilla y divertida." },
    { title: "Batman", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884011/Batman_qo67or.jpg", description: "Enfréntate al crimen de Gotham en este juego basado en la icónica película de Batman." },
    { title: "Batman&Jocker", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884011/BatmanReturnJocker_etn3ei.jpg", description: "Batman y Joker cara a cara en un juego lleno de acción y plataformas." },
    { title: "BattleToads", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884019/Battletoads_winjow.jpg", description: "Lucha contra hordas de enemigos con los legendarios Battletoads en este desafiante beat ‘em up." },
    { title: "Battle&Dragon", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884019/BattletoadsDoubleDragon_jm6v9r.jpg", description: "Un juego de combate con dragones y guerreros en un mundo de fantasía." },
    { title: "BeetleJuice", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884016/BeetleJuice_vypinc.jpg", description: "Explora el extraño y oscuro mundo de Beetlejuice en este juego de plataformas." },
    { title: "Bill&Teds", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884014/Bill_Teds_hcjsmw.jpg", description: "Viaja por el tiempo con Bill y Ted en esta aventura inspirada en la película." },
    { title: "BugsBunny", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884014/BugsBunny_abcllt.jpg", description: "Acompaña a Bugs Bunny en esta aventura llena de humor y desafíos." },
    { title: "BugsBunnyCastle", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884015/BugsBunnyCrazyCastle_dnhjmj.jpg", description: "Explora un castillo lleno de trampas en este juego protagonizado por Bugs Bunny." },
    { title: "Captain America", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884012/CaptainAmerica_apx9px.jpg", description: "Lucha contra Red Skull y otros villanos con el Capitán América." },
    { title: "Captain Planet", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884014/CaptainPlanet_ijkh64.jpg", description: "Salva el planeta con el Capitán Planeta en este juego de plataformas y acción." },
    { title: "Castlevania", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884012/Castlevania_cocbax.jpg", description: "Caza vampiros en el legendario Castlevania con su jugabilidad desafiante y música épica." },
    { title: "Conan", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884022/Conan_ftb58h.jpg", description: "Domina la espada y vence enemigos en esta aventura inspirada en Conan el Bárbaro." },
    { title: "DieHard", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884019/DieHard_iyyyvp.jpg", description: "Revive la acción de la película en este intenso juego de disparos y estrategia." },
    { title: "DonKeyKong", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884018/DonkeyKong_jy4bgf.jpg", description: "Salva a la princesa enfrentando obstáculos y lanzando barriles con Mario." },
    { title: "HomeAlone", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884010/homeAlone_ie7ljj.jpg", description: "Defiende tu casa de los ladrones en este divertido juego basado en la película." },
    { title: "Contra", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884022/NESContra_w4afgp.jpg", description: "Dispara y derrota alienígenas en uno de los shooters más icónicos de la NES." },
    { title: "NinjaGaiden", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884008/NinjaGaiden_ataczb.jpg", description: "Conviértete en un ninja y lucha contra el crimen con increíbles movimientos de combate." },
    { title: "PowerBlade", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884008/PowerBlade_cwap8g.jpg", description: "Un juego de acción futurista donde debes salvar al mundo con tu poderoso búmeran." },
    { title: "PowerBladeII", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884009/PowerBladeII_kddjjb.jpg", description: "Domina el poder de la hoja y enfréntate a enemigos cibernéticos en esta secuela de acción futurista." },
    { title: "SuperMario3", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884008/SuperMario3_stdc0z.jpg", description: "Una de las mejores aventuras de Mario, con nuevos poderes y niveles sorprendentes." },
    { title: "TheFlinstStones", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884008/theFlinstStones_cmoqvl.jpg", description: "Ayuda a Pedro Picapiedra a rescatar a su familia en la prehistoria." },
    { title: "TheLionKing", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884010/TheLionKing_y5ooo1.jpg", description: "Revive la historia de Simba en este desafiante juego de plataformas." },
    { title: "theSmurfs", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884009/TheSmurfs_jtrypq.jpg", description: "Acompaña a los Pitufos en una aventura llena de desafíos para salvar su aldea." },
    { title: "Yoshi", img: "https://res.cloudinary.com/dizkdk1te/image/upload/v1741884008/Yoshi_nvxe7j.jpg", description: "Un divertido juego de rompecabezas protagonizado por Yoshi." }
];


  
export default function NintendoPage() {
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
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
        const storedClient = localStorage.getItem("client");
        if (storedClient) {
            setClient(JSON.parse(storedClient));
        }
    }, []);

  

    if (!client) return <p>Cargando...</p>;

  return (
    <div className="main-container">
      <Navbar expand="lg" className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Navbar.Brand href="#" onClick={scrollToTop} style={{ cursor: 'pointer' }}>
          <img 
                  src="/images/LogoSortecQueda.png" 
                  alt="SORTEC Logo" 
                  className="img-fluid"
                  style={{ 
                    maxHeight: '50px',
                    padding: '5px'
                  }} 
                />
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Navbar.Toggle aria-controls="navbarNav" onClick={() => setIsNavCollapsed(!isNavCollapsed)} className="ms-auto" />
          </div>
          <Navbar.Collapse id="navbarNav" className={isNavCollapsed ? "collapse" : "show"}>
            <Nav className="mx-auto">
                    <Nav.Link onClick={() => router.push("/")}>Inicio</Nav.Link>
                    <Nav.Link onClick={() => router.push("/")}>Sorteos</Nav.Link>
                    <Nav.Link onClick={() => router.push("/")}>Beneficios</Nav.Link>
                    <Nav.Link onClick={() => router.push("/")}>Tienda</Nav.Link>
                    <Nav.Link onClick={() => router.push("/")}>Juegos</Nav.Link>
                    <Nav.Link onClick={() => router.push("/")}>Ganadores</Nav.Link>
                    {/*<Nav.Link onClick={() => router.push("/")}>Historial Sorteos</Nav.Link>*/}
            </Nav>
            <Nav>
                <Dropdown>
                <Dropdown.Toggle variant="secondary">
                    👤 {client.nombres?.split(" ")[0]} {client.apellidos?.split(" ")[0]}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                  <Dropdown.Item onClick={() => router.push('/perfil')}>Perfil</Dropdown.Item>
                  <Dropdown.Item onClick={() => router.push('/suscripcion')}>Suscripción</Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </div>
      </Navbar>


      <Container fluid className="p-0">
            <div className="position-relative main-container">
                <Carousel>
                    {["/images/SliderNES1.jpeg", "/images/SliderNES2.jpeg", "/images/SliderNES3.jpeg", "/images/SliderNES4.jpeg", "/images/SliderNES5.jpeg"].map((src, index) => (
                        <Carousel.Item key={index} style={{ maxHeight: "800px" }}>
                            <img className="d-block w-100" src={src} alt={`Slide ${index + 1}`} style={{ opacity: 5.0 }} />
                            <div className="overlay"></div>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* ✅ Versión Escritorio - Título y botón alineados a la izquierda */}
                <div className="carousel-caption d-none d-md-block text-left" style={{ left: '5%', textAlign: 'left' }}>
                    <h1 className="animated-title" style={{ left: '5%', textAlign: 'left', color: "white", fontSize: '1.8rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8)',
                    marginBottom: '10px',
                    fontFamily: "book, Handset Sans UI, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji" }}>🎮 Descargar Emulador Nintendo con más de 10 mil juegos</h1>
                  <a 
                    href="https://drive.google.com/uc?export=download&id=1-ez8rK9HtVuL__jEi7J6QwvmI0qV8t8u" 
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
                    href="https://drive.google.com/file/d/1CWJ9rfIYv4VNIig6OGwGTvqOqowteFTd/view?usp=drive_link" 
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
                    ⬇️ Descargar Pack Juegos NES
                  </a>
                </div>

                {/* ✅ Versión Móvil - Texto y botones debajo del slide */}
                  <div className="d-block d-md-none text-center mt-3">
                      <h2 className="animated-title" style={{ color: "white" }}>
                          🎮 Descargar Emulador Nintendo con más de 11 mil juegos
                      </h2>
                      
                      <a 
                        href="https://drive.google.com/uc?export=download&id=1-ez8rK9HtVuL__jEi7J6QwvmI0qV8t8u" 
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
                        href="https://drive.google.com/uc?export=download&id=1CWJ9rfIYv4VNIig6OGwGTvqOqowteFTd" 
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
                          ⬇️ Descargar Pack Juegos NES
                      </a>
                  </div>

            </div>
        </Container>


      {/* Sección de Juegos */}
      <div className="game-section">
        <div className="game-title-container">
          <h1 className="game-section-title">
            📖 Listado de los Juegos Más Emblemáticos de Nintendo NES 📖
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
                    <p>{game.description}</p>
                  </div>
                );
              })}
              </div>
              <FaChevronRight className="nav-arrow right-arrow" onClick={handleNext} />
            </div>
          </div>
        </div>
      )}

            
            {/* Video Tutorial para instalación del aplicativo*/}
            <div className="instruction-section">
                <h2 className="instruction-title">📥 Cómo Descargar e Instalar el APK y los 10785 juegos en tu Android 📲</h2>
                <ul className="instruction-list">
                <ul className="instruction-list">
                      <li>📥 <strong>Paso 1:</strong> Descarga el archivo <strong>APK</strong> desde el botón de descarga que está al inicio de la página.</li>
                      <li>🎮 <strong>Paso 2:</strong> Descarga el <strong>Pack de Juegos NES</strong> desde el botón que dice <strong>“Descargar Pack Juegos NES”</strong> al inicio de la página.</li>
                      <li>📂 <strong>Paso 3:</strong> Descarga esta aplicación para descomprimir el pack de juegos 
                          <a 
                            href="https://drive.google.com/uc?export=download&id=1qOopiusS_MUDuNn2pqrxaO7z8GveS23q" 
                            style={{ color: "#007bff", textDecoration: "underline", fontWeight: "bold" }} 
                            download
                          >
                            haciendo click aquí
                          </a>.  
                      </li>
                      
                      <li>⚙️ <strong>Paso 4:</strong> Ve a <strong>⚙️ Ajustes → Seguridad</strong> y activa la opción <strong>✅ “Fuentes desconocidas”</strong> para permitir la instalación de apps externas.</li>
                      <li>📂 <strong>Paso 5:</strong> Abre la carpeta de <strong>Descargas</strong> o la ruta donde descargaste el <strong>emulador, el pack de juegos y la aplicación para descomprimir archivos.</strong></li>
                      <li>📲 <strong>Paso 6:</strong> Instala el emulador 📦 <strong>Nostalgia.NES-Pro-NES-Emulator.apk</strong> tocando el archivo y seleccionando “Instalar”.</li>
                      <li>⏳ <strong>Paso 7:</strong> Espera a que la instalación finalice.</li>
                      <li>📂 <strong>Paso 8:</strong> Instala la aplicación de descompresión 📦 <strong>rar-7.00-build22.apk</strong> tocando el archivo y seleccionando “Instalar”.</li>
                      <li>⏳ <strong>Paso 9:</strong> Espera a que la instalación finalice.</li>
                      <li>📁 <strong>Paso 10:</strong> Ve a la carpeta donde se descargó el **Pack de Juegos NES** (archivo **.zip**) y ábrelo con la aplicación <strong>RAR 📦</strong>.</li>
                      <li>🔓 <strong>Paso 11:</strong> Dentro de la aplicación **RAR**, toca la opción **“Descomprimir”** y deja la ruta predeterminada donde se extraerán los juegos. ⏳ **Esto tomará unos minutos**.</li>
                      <li>🎮 <strong>Paso 12:</strong> Una vez descomprimidos los juegos, abre la app **NostalgiaPro** y toca los tres puntos **(⋮) en la esquina superior derecha**.</li>
                      <li>🔎 <strong>Paso 13:</strong> Selecciona la opción **“Search ROMs”** y elige **“IMPORT FROM FILE” 📂** en la ventana emergente.</li>
                      <li>📁 <strong>Paso 14:</strong> Busca y selecciona la carpeta donde se descomprimieron los juegos NES.</li>
                      <li>✅ <strong>Paso 15:</strong> Si aparece algún mensaje de confirmación, toca **Aceptar** y espera entre **5 a 8 minutos** hasta que el emulador cargue todos los juegos.</li>
                      <li>🚀 <strong>Paso 16:</strong> ¡Todo listo! 🎉 **Abre la app NostalgiaPro** y verás todos los juegos ya cargados en la lista. **¡Diviértete jugando! 🎮🔥**</li>
                  </ul>

                </ul>
                <h3>📱💡 Video Tutorial: 📥 Instala en tu Móvil Fácilmente! 🔧📲</h3>
                <video 
                    src="/video/VideoNES.mp4"
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
    
      <footer className="bg-dark text-light text-center py-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0">© SORTEC 2025 - Todos los derechos reservados.</p>

        <div className="d-flex align-items-center social-container">
          <a href="https://www.facebook.com/profile.php?id=61571509086893" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/images/facebook.png" alt="Facebook" />
          </a>
          <a href="https://m.me/559373170586306" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/images/mensajero2.png" alt="Messenger" />
          </a>
          {/* Código QR más cerca sin romper el diseño */}
          <img src="/images/qrcode.jpeg" alt="QR Code" className="qr-code" />
        </div>
      </footer>

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
              width: 100%; /* Para ocupar correctamente el espacio del grid */
              display: flex;
              justify-content: center;
            }

            .game-card {
              width: 90%; /* Ajuste para que no ocupe todo el ancho */
            }



      `}</style>
    </div>
  )
};

