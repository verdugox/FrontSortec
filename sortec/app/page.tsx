"use client";

import { useState, useEffect, useRef } from "react";
import { Carousel, Modal, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Login from "./components/Login";
import ClientForm from "./components/ClientForm"; // Adjust the path as necessary
import JuegosPage from "./juegos/page";
import '../css/home/inicio.css';
import Menu from "./components/Menu";
import Footer from "./components/Footer";



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

interface Payment {
  id: string;
  estado: string;
  dni: string;
  fechaPago: string;
  monto: number;
}


export default function HomePage() {
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);


  const [client, setClient] = useState<Perfil | null>(null);
  const sliderRef = useRef(null);
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);

  const [miniCarouselData, setMiniCarouselData] = useState<{ img: string; titulo: string; description: string; fecha: string }[]>([]);
  const [loadingSorteos, setLoadingSorteos] = useState(false);

  const [showModalViewSorteo, setShowModalViewSorteo] = useState(false);
  const [selectedSorteo, setSelectedSorteo] = useState<{ img: string; titulo:string; description: string; fecha: string } | null>(null);

  const [winnersData, setWinnersData] = useState<{ img: string; title: string }[]>([]);


  useEffect(() => {
    // Cargar cliente desde localStorage
    const storedClient = localStorage.getItem("client");
    if (storedClient) {
      setClient(JSON.parse(storedClient));
    }
  
    // Hacer scroll automático si hay hash en la URL
    if (typeof window !== "undefined") {
      const targetId = window.location.hash;
      if (targetId) {
        const element = document.querySelector(targetId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 300);
            }
          }
        }
      }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("client");
    setClient(null);
    router.push("/");
  };

  const handleOpenModalSorteo = (sorteo: { img: string; titulo: string; description: string; fecha: string }) => {
    setSelectedSorteo(sorteo);
    setShowModalViewSorteo(true);
};


  const handleLoginSuccess = (clientData: Perfil, token: string) => {
    localStorage.setItem("token", `Bearer ${token}`);
    localStorage.setItem("client", JSON.stringify(clientData));
    setClient(clientData);

    if (clientData.rol === "ADMINISTRADOR") {
      router.push("/dashboard");
    } else if (clientData.rol === "PARTICIPANTE") {
      setShowLogin(false); // Close the login modal after successful login
      router.push("/");
    }
  };

  useEffect(() => {
    const slider = sliderRef.current as HTMLDivElement | null;
    let animationId: number;
    let position = 0;

    const moveSlider = () => {
      if (slider) {
        position -= 1;
        if (Math.abs(position) >= (slider.scrollWidth / 2)) {
          position = 0;
        }
        (slider as HTMLDivElement).style.transform = `translateX(${position}px)`;
      }
      animationId = requestAnimationFrame(moveSlider);
    };

    animationId = requestAnimationFrame(moveSlider);

    return () => cancelAnimationFrame(animationId);
  }, []);


useEffect(() => {
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Validar que haya un cliente y un ID válido antes de hacer la petición
      if (!token) {
        console.warn("🔒 No se obtuvo el token, omitiendo la carga de pagos.");
        return;
      }
      if (!client?.dni) {
        console.warn("⚠ No se obtuvo el ID del cliente, omitiendo la carga de pagos.");
        return;
      }

      const response = await fetch(`/api/payments/dni/${client.dni}`, {

        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json",
        },
      });
      

      if (response.status === 401) {
        console.warn("🔴 Usuario no autorizado para obtener pagos. Omitting fetch.");
        return;
      }

      if (!response.ok) {
        console.error(`❌ Error al obtener los pagos: ${response.status} - ${response.statusText}`);
        return;
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("⚠ No hay pagos registrados para este cliente.");
        setPayments([]);
        return;
      }

      setPayments(data);
    } catch (error) {
      console.error("❌ Error en la solicitud de pagos:", error);
    }
  };

  fetchPayments();
}, [client?.dni]); // ✅ Se ejecutará cuando el ID del cliente esté disponible
  
  useEffect(() => {
    const fetchGanadores = async () => {
      try {
        const response = await fetch(`/api/ganadores`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
  
        if (!response.ok) throw new Error("Error al obtener los ganadores");
  
        const data = await response.json();
        
        // Mapear la respuesta a la estructura esperada
        const formattedWinners = data.map((ganador: { imagenUrl: string; titulo: string }) => ({
          img: ganador.imagenUrl,
          title: ganador.titulo
        }));
  
        setWinnersData(formattedWinners);
      } catch (error) {
        console.error("Error al cargar ganadores:", error);
      } 
    };
  
    fetchGanadores();
  }, []);
  



  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };




useEffect(() => {
    const fetchSorteos = async () => {
        setLoadingSorteos(true);
        try {
            const response = await fetch(`/api/sorteos`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) throw new Error("Error al obtener los sorteos");

            const data = await response.json();
            interface Sorteo {
                imagenUrl: string;
                titulo: string;
                descripcion:string;
                fechaSorteo: string;
            }

            const sorteosData = data.map((sorteo: Sorteo) => ({
                img: sorteo.imagenUrl,
                titulo: `🎁 ${sorteo.titulo} - ${sorteo.fechaSorteo}`,
                fecha: sorteo.fechaSorteo,
                description: sorteo.descripcion
            }));

            setMiniCarouselData(sorteosData);
        } catch (error) {
            console.error("Error al cargar sorteos:", error);
        } finally {
            setLoadingSorteos(false);
        }
    };

    fetchSorteos();
}, []);


  const totalSlides = Math.ceil(miniCarouselData.length / 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 3000);

    return () => clearInterval(timer);
  }, [totalSlides]);
  
  const benefits = [
    { title: "Eventos presenciales", img: "/images/eventos.jpeg", description: "Participa en nuestros eventos exclusivos." },
    { title: "Entradas para el cine", img: "/images/cine.jpeg", description: "Disfruta de funciones de cine gratuitas." },
    { title: "Reunión de suscriptores", img: "/images/reunion.jpeg", description: "Conéctate con otros suscriptores en eventos privados." },
    { title: "Merchandise exclusivo", img: "/images/merch.jpeg", description: "Accede a productos únicos y personalizados." }
  ];

  return (
    
    <div className="main-container">
      <section>
      <Menu 
          client={client} 
          onLogout={handleLogout} 
          onLoginClick={() => setShowLogin(true)} 
          scrollToTop={scrollToTop}
          setShowLogin={setShowLogin}
       />
      </section>
      
      {!client ? (
        <section id="carousel" className="mt-4 pt-5 position-relative">

         <Carousel>
          {["/images/5.png","/images/4.png","/images/3.png","/images/2.png","/images/1.png" ].map((src, index) => (
            <Carousel.Item key={index} style={{ maxHeight: "800px" }}>
              <img className="d-block w-100" src={src} alt={`Slide ${index + 1}`} style={{ opacity: 5.0 }} />
              <div className="overlay"></div>
            </Carousel.Item>
          ))}
        </Carousel>

        {/* ✅ Versión Escritorio - Texto y botón sobre el slide */}
        <div className="carousel-caption d-none d-md-block">
          <h1 className="animated-title">¡Obtén tus beneficios aquí!</h1>
          <button className="btn btn-primary btn-lg" onClick={() => setShowRegister(true)}>¡Quiero ser suscriptor!</button>
        </div>

        {/* ✅ Versión Móvil - Texto y botón debajo del slide */}
        <div className="d-block d-md-none text-center mt-3">
          <h2 style={{color: '#007bff'}} className="mobile-title">¡Obtén tus beneficios aquí!</h2>
          <button style={{color: '#ffffff'}} className="btn btn-primary btn-lg mt-2" onClick={() => setShowRegister(true)}>¡Quiero ser suscriptor!</button>
        </div>

        {/* Imágenes de personajes */}
        {/*<img className="man-pointing" src="/images/hombre01.png" alt="Man Pointing" />
        <img className="woman-pointing" src="/images/mujer01.png" alt="Woman Pointing" />*/}

        </section>

      ) : (
        <section className="user-info my-5 my-4 position-relative">
        <br />
        <br />
        <br />
        <Container >
          
        <div className="animated-welcome-container">
        <div className="scroll-wrapper">
          <div className="scroll-track">
            <div className="scroll-content">
              <h2>🎉 Bienvenido, {client.nombres?.split(' ')[0]} {client.apellidos?.split(' ')[0]}!</h2>
              <p style={{ color: "#ffffff" }}>
                🌟 Disfruta de todos tus beneficios como <span className="highlighted-role">{client.rol}</span> | 
                🔍 Explora <strong>sorteos</strong> 🎁 | descubre <strong>juegos</strong> 🎮 | revisa a los <strong>ganadores</strong> 🏆 | nuevos <strong>premios</strong> 💥 en <strong>SORTEC</strong> 🚀
              </p>
            </div>
            <div className="scroll-content"> {/* ⬅ segunda copia */}
              <h2>🎉 Bienvenido, {client.nombres?.split(' ')[0]} {client.apellidos?.split(' ')[0]}!</h2>
              <p style={{ color: "#ffffff" }}>
                🌟 Disfruta de todos tus beneficios como <span className="highlighted-role">{client.rol}</span> | 
                🔍 Explora <strong>sorteos</strong> 🎁 | descubre <strong>juegos</strong> 🎮 | revisa a los <strong>ganadores</strong> 🏆 | nuevos <strong>premios</strong> 💥 en <strong>SORTEC</strong> 🚀
              </p>
            </div>
          </div>
        </div>
      </div>





          {(client.rol === "PARTICIPANTE" || client.rol === "ADMINISTRADOR") && (() => {
                  // ✅ Función para convertir una fecha en formato dd/mm/yyyy HH:MM:SS a un objeto Date
                  const parseFechaRegistro = (fechaString: string) => {
                    if (!fechaString) return null;
                    const partes = fechaString.split(/[/ :]/); // Ajustado para manejo correcto
                    if (partes.length >= 6) {
                        const [dia, mes, anio, horas, minutos, segundos] = partes.map(Number);
                        return new Date(anio, mes - 1, dia, horas, minutos, segundos);
                    }
                    return null;
                };
                
                const getLastPaymentDate = (payments: Payment[]) => {
                    if (payments.length === 0) return null;  
                    // ✅ Ordenamos los pagos por fecha de menor a mayor
                    const sortedPayments = [...payments].sort((a, b) => new Date(a.fechaPago).getTime() - new Date(b.fechaPago).getTime());
                    // ✅ Tomamos el último registro del array ordenado
                    const lastPayment = sortedPayments[sortedPayments.length - 1];
                    return parseFechaRegistro(lastPayment.fechaPago);
                };
                
                // ✅ Obtener la fecha de registro
                const registrationDate = parseFechaRegistro(client.fechaRegistro);
                const currentDate = new Date();

               // ✅ Cálculo preciso de días transcurridos
                let daysDifference = 0;
                if (registrationDate) {
                    // ✅ Normalizar las fechas eliminando la hora, minutos y segundos
                    const normalizedRegistrationDate = new Date(registrationDate);
                    normalizedRegistrationDate.setHours(0, 0, 0, 0);
                    
                    const normalizedCurrentDate = new Date();
                    normalizedCurrentDate.setHours(0, 0, 0, 0);

                    // ✅ Calcular la diferencia en días asegurando que sea exacta
                    const diffTime = normalizedCurrentDate.getTime() - normalizedRegistrationDate.getTime();
                    daysDifference = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                }

                
                // ✅ Cálculo del nivel del suscriptor
                const monthsDifference = registrationDate
                    ? (currentDate.getFullYear() - registrationDate.getFullYear()) * 12 +
                      (currentDate.getMonth() - registrationDate.getMonth())
                    : 0;
                
                // ✅ Ahora level se calcula correctamente
                const level = Math.min(1 + Math.floor(monthsDifference / 6), 10);
                
                // ✅ Cálculo de la fecha de vencimiento sumando 1 mes
                let subscriptionEndDate = "Fecha inválida";
                
                const lastPaymentDate = getLastPaymentDate(payments);
                if (lastPaymentDate) {
                    const endDate = new Date(lastPaymentDate);
                    const originalDay = endDate.getDate(); // Tomamos el día exacto del último pago
                    endDate.setMonth(endDate.getMonth() + 1);
                
                    // ✅ Si el mes siguiente no tiene el mismo día, ajustar al último día del mes
                    if (endDate.getDate() !== originalDay) {
                        endDate.setDate(0);
                    }
                
                    subscriptionEndDate = endDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
                }
                

                  return (
                    <div className="subscription-info d-flex flex-wrap" style={{ background: "#6a0dad", borderRadius: "15px", padding: "20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "20px", flex: "1 1 50%" }}>
                      <div className="profile-image-container">
                          <img 
                              src={
                                  !client?.sexo ? "/images/perfilrobot.gif" :
                                  client.sexo === "Masculino" ? "/images/perfilman.gif" :
                                  client.sexo === "Femenino" ? "/images/perfilwoman.gif" :
                                  "/images/perfilrobot.gif"
                              } 
                              alt="Profile Icon" 
                              className="profile-image"
                          />
                      </div>
                      <div className="subscription-info-text" style={{ display: "flex", flexDirection: "column" }}>

                          <p><strong>Estado:</strong> <span style={{ backgroundColor: "#4CAF50", color: "#fff", padding: "2px 8px", borderRadius: "5px" }}>{client.estado}</span></p>
                          <p><strong>Codigo Subscriptor:</strong> {client.codigoSortec}</p>

                          {/* ✅ Corrección de la fecha de suscripción */}
                          <p><strong>Suscriptor desde:</strong> {registrationDate ? registrationDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }) : "Fecha inválida"}</p>

                          {/* ✅ Cálculo dinámico de la fecha de vencimiento */}
                          <p><strong>Suscripción vence:</strong> {subscriptionEndDate}</p>

                          <p><strong>Ubicación:</strong> {client.provincia}, {client.pais}</p>
                        </div>
                      </div>
                      <div className="subscription-info-text" style={{ display: "flex", alignItems: "center", gap: "10px", flex: "1 1 40%", justifyContent: "center" }}>
                        <img 
                          src={`/images/Level${level}.jpeg`} 
                          alt={`Suscriptor Nivel ${level}`} 
                          style={{ 
                            width: "100px", 
                            height: "100px", 
                            borderRadius: "50%", 
                            boxShadow: "0 0 20px 5px rgba(255, 255, 0, 0.8)", 
                            transition: "transform 0.3s ease, box-shadow 0.3s ease" 
                          }} 
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 0 30px 10px rgba(255, 255, 0, 1)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 0 20px 5px rgba(255, 255, 0, 0.8)';
                          }}
                        />
                        <div style={{ textAlign: "left" }}>
                          <p><strong>Suscriptor Nivel {level}</strong></p>
                          <p>{daysDifference} días</p>
                        </div>
                      </div>
                    </div>
                  );
                })()
              }
              <div style={{ marginTop: "20px", display: "flex", gap: "15px", justifyContent: "center" }}>
                    <button 
                      style={{ backgroundColor: "#FFD700", color: "#000", padding: "8px 16px", border: "none", borderRadius: "8px", transition: "box-shadow 0.3s ease" }}
                      onClick={() => router.push('/suscripcion')}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(255, 215, 0, 0.8)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      Ver mi suscripción
                    </button>
                    <button 
                      style={{ backgroundColor: "#000", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "8px", transition: "box-shadow 0.3s ease" }}
                      onClick={() => router.push('/perfil')}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 15px 5px rgba(0, 0, 0, 0.8)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                    >
                      Configurar perfil
                    </button>
              </div>
            </Container>
          </section>
        )
      }

      <Modal show={showLogin} onHide={() => setShowLogin(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: '#000', borderBottom: 'none' }}>
          <Modal.Title>
            <img 
              src="/images/LogoSortecQueda2.png" 
              alt="SORTEC Logo" 
              className="img-fluid"
              style={{ 
                maxHeight: '50px', 
                padding: '0px'
              }} 
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onLoginSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
        </Modal.Body>
      </Modal>


      <Modal show={showRegister} onHide={() => setShowRegister(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Formulario de Subscripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ClientForm />
        </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pronto Grandes Novedades - SORTEC</Modal.Title>
        </Modal.Header>
        <Modal.Body dangerouslySetInnerHTML={{ __html: modalContent }}></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModalViewSorteo} onHide={() => setShowModalViewSorteo(false)} centered>
        <Modal.Header closeButton>
            <Modal.Title>Detalle del Sorteo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
            {selectedSorteo && (
                <>
                    <h4 className="mb-3">{selectedSorteo.titulo}</h4>
                    <img 
                        src={selectedSorteo.img} 
                        alt="Sorteo" 
                        className="img-fluid rounded shadow"
                        style={{ maxHeight: "300px", objectFit: "cover" }}
                    />
                    <h4 className="mt-3"><strong>Descripcion del Sorteo:</strong> {selectedSorteo.description}</h4>
                </>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalViewSorteo(false)}>Cerrar</Button>
        </Modal.Footer>
    </Modal>


      <section id="sorteos" className="text-center my-5" style={{ maxHeight: "50%" }}>
            <Container>
                <h2 style={{ color: "#007bff", marginBottom: "20px" }}>Próximos Sorteos</h2>

                <p style={{ color: "#333", fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                    🚀 ¡Explora el futuro de la tecnología con <strong>SORTEC</strong>! 🔥 Aquí descubrirás los <strong>próximos artefactos tecnológicos</strong> que estarán en juego 🎯.
                </p>

                {loadingSorteos ? (
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Carousel
                        activeIndex={carouselIndex}
                        onSelect={(selectedIndex) => setCarouselIndex(selectedIndex)}
                        indicators={true}
                        controls={true}
                        fade
                        interval={3000}
                        wrap={true}
                    >
                        {Array.from({ length: Math.ceil(miniCarouselData.length / 4) }).map((_, slideIndex) => (
                            <Carousel.Item key={slideIndex}>
                                <Row className="justify-content-center">
                                    {miniCarouselData.slice(slideIndex * 4, slideIndex * 4 + 4).map((item, idx) => (
                                        <Col key={idx} md={3} className="p-3">
                                        <div 
                                            style={{
                                                position: "relative",
                                                border: "2px solid #000",
                                                borderRadius: "10px",
                                                overflow: "hidden",
                                                height: "320px",
                                                cursor: "pointer"
                                            }}
                                            onClick={() => handleOpenModalSorteo(item)}
                                        >
                                            <img
                                                className="d-block w-100 img-fluid"
                                                src={item.img}
                                                alt={`Premio ${idx + 1}`}
                                                style={{ height: "280px", objectFit: "cover" }}
                                            />
                                            <div style={{
                                                position: "absolute",
                                                bottom: "0",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                backgroundColor: "#000",
                                                color: "#fff",
                                                padding: "12px",
                                                borderRadius: "0px 0px 10px 10px",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                maxWidth: "100%",
                                                width: "100%",
                                                height: "auto",
                                                fontSize: "16px",
                                                lineHeight: "1.2",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}>
                                                {item.titulo}
                                            </div>
                                        </div>
                                    </Col>
                                    
                                    ))}
                                </Row>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}

                <Button variant="warning" className="mt-4" style={{ fontWeight: "bold", borderRadius: "25px", padding: "10px 20px" }}>
                    Pronto podrás ver todos los premios
                </Button>
            </Container>
        </section>


      <section id="benefits" className="text-center my-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <Row>
                {benefits.slice(0, 2).map((benefit, index) => (
                  <Col md={6} key={index} className="p-3">
                    <img src={benefit.img} alt={benefit.title} className="img-fluid rounded-circle" onClick={() => { setModalContent(benefit.description); setShowModal(true); }} />
                    <h5 style={{ color: "#007bff", marginBottom: "20px" }}>
                      {benefit.title}</h5>
                  </Col>
                ))}
              </Row>
              <Row>
                {benefits.slice(2).map((benefit, index) => (
                  <Col md={6} key={index} className="p-3">
                    <img src={benefit.img} alt={benefit.title} className="img-fluid rounded-circle" onClick={() => { setModalContent(benefit.description); setShowModal(true); }} />
                    <h5 style={{ color: "#007bff", marginBottom: "20px" }}>
                      {benefit.title}</h5>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={6} className="text-left">
              <h2 style={{ color: "#007bff", marginBottom: "20px" }}>
                Grandes beneficios</h2>
              <p style={{ color: "#555", fontSize: "18px", fontStyle: "italic", marginBottom: "20px" }}>
                ¡Ojo! 👀 Pronto gracias al apoyo de todos ustedes podremos brindarle estos grandes beneficios, 
                todo depende de ustedes. Mientras mayor participacion y subscripciones tengamos, podremos 
                aperturar estos beneficios para ustedes en SORTEC. </p>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="store" className="text-center my-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="p-4">
              <h2 style={{ color: "#007bff", marginBottom: "20px" }}>
                Nuestra Tienda</h2>
              <p style={{ color: "#555", fontSize: "18px", fontStyle: "italic", marginBottom: "20px" }}>
                En SORTEC muy pronto abriremos nuestra tienda virtual con increíbles novedades tecnológicas que te sorprenderán. ¡Mantente atento a las innovaciones que tenemos preparadas para ti!</p>
            </Col>
            <Col md={6} className="p-4">
              <img src="/images/tienda.jpeg" alt="Nuestra Tienda" className="img-fluid" />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="games" className="text-center my-5">
        <JuegosPage />
      </section>

      <section id="ganadores" className="text-center my-5">
      <Container>
        <h2 style={{ color: "#007bff", marginBottom: "20px" }}>¡Tú podrías ser el próximo SUERTUDO!</h2>
        <div className="slider-container" style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div
            ref={sliderRef}
            className="slider-track"
            style={{
              display: "inline-flex",
              willChange: "transform"
            }}
          >
            {[...winnersData, ...winnersData].map((winner, index) => (
              <div key={index} className="winner-card" style={{ padding: "10px" }}>
                <img
                  src={winner.img}
                  alt={`Ganador ${index + 1}`}
                  style={{
                    width: "200px",
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    border: "4px solid #fff"
                  }}
                />
                <div style={{
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  marginTop: "5px",
                  fontWeight: "bold"
                }}>
                  🏆 {winner.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>

    <Footer />

      <Modal show={showSubscribe} onHide={() => setShowSubscribe(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Suscripción</Modal.Title>
        </Modal.Header>
        <Modal.Body>Suscríbete para obtener beneficios exclusivos.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubscribe(false)}>Cerrar</Button>
          <Button variant="/components/ClientForm.tsx">Suscribirme</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
