"use client";

import { useState, useEffect } from "react";
import Menu from "../components/Menu";
import Footer from "../components/Footer";
import { Container, Form, Button, Row, Col, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

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

export default function PerfilPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [client, setClient] = useState<Perfil | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [genero, setGenero] = useState(client?.sexo || "Masculino");
    const [showProfileBlockingLoader, setShowProfileBlockingLoader] = useState(false);
    const [showProfileSuccessModal, setShowProfileSuccessModal] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClient((prev) => prev ? { ...prev, [name]: value } : null);
    };

    const handleSave = async () => {
      if (client) {
          setShowProfileBlockingLoader(true); // ✅ Bloquear pantalla con loader
          setLoading(true);
          try {
              const token = localStorage.getItem("token");
              const updatedClient = { ...client, sexo: genero }; // ✅ Incluir género en los datos
  
              const response = await fetch(`/api/clients/${client.id}`, {
                  method: "PUT",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": token || ""
                  },
                  body: JSON.stringify(updatedClient),
              });
  
              if (response.ok) {
                  localStorage.setItem("client", JSON.stringify(updatedClient));
                  setShowProfileBlockingLoader(false);
                  setShowProfileSuccessModal(true); // ✅ Mostrar mensaje de éxito
                  setIsEditing(false);
              } else {
                  alert("Error al actualizar la información");
                  setShowProfileBlockingLoader(false);
              }
          } catch (error) {
              console.error("Error al guardar la información:", error);
              setShowProfileBlockingLoader(false);
          } finally {
              setLoading(false);
          }
      }
  };
  

    if (!client) return <p>Cargando...</p>;

  return (
        <div
          className="main-container text-white"
          style={{
            backgroundImage: "url('/images/image.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "100vh",
          }}
        >
        <section>
              <Menu 
                  client={client} 
                  onLogout={handleLogout} 
                  scrollToTop={scrollToTop}
                  onLoginClick={() => router.push('/login')} 
                  setShowLogin={(show: boolean) => console.log('Set show login:', show)}
                />
        </section>
            <br/>
            <br/>
        <section >
        <div className="text-center py-5 bg-dark bg-opacity-75">
              <h1 className="display-4 fw-bold text-warning mb-3 animate__animated animate__pulse animate__infinite">
                ¡Participa y Gana con SORTEC!
              </h1>
              <p className="lead text-light">
                Actualiza tu perfil y prepárate para nuestros increíbles sorteos tecnológicos 🎉
              </p>
              </div>
              {/* Animación superior - cajita */}
              <div className="premio-superior">
                <img src="/images/premio2.png" alt="Premio Cajita" />
              </div>



              <Container
                className="my-5 p-4 bg-dark bg-opacity-75 rounded-4 shadow-lg"
                style={{ backdropFilter: "blur(8px)" }}
              >

                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Información de Usuario</h2>
                        <Button variant="primary" onClick={() => setIsEditing(!isEditing)} className="btn-sm" style={{ boxShadow: "0 0 15px rgba(0, 0, 255, 0.8)", width: "200px" }}>
                            {isEditing ? "Cancelar" : "Editar"}
                        </Button>
                    </div>
                    

                    <Form className="custom-form">
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="input-label">Nombres</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombres"
                                        value={client.nombres}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="input-label">Apellidos</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellidos"
                                        value={client.apellidos}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label className="input-label">Correo Electrónico</Form.Label>
                            <Form.Control
                                type="email"
                                name="correo"
                                value={client.correo}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="custom-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="input-label">Teléfono</Form.Label>
                            <Form.Control
                                type="text"
                                name="telefono"
                                value={client.telefono}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="custom-input"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="input-label">Género</Form.Label>
                            <Form.Select 
                                  name="sexo" 
                                  value={genero} 
                                  onChange={(e) => setGenero(e.target.value)} 
                                  disabled={!isEditing}
                                  className="custom-input"
                              >

                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="No binario">No binario</option>
                                <option value="Prefiero no decir">Prefiero no decir</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="input-label">Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={client.direccion}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="custom-input"
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="input-label">País</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="pais"
                                        value={client.pais}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="input-label">Provincia</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="provincia"
                                        value={client.provincia}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="input-label">Distrito</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="distrito"
                                        value={client.distrito}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="custom-input"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        {isEditing && (
                            <Button variant="success" onClick={handleSave} className="custom-button">
                                {loading ? <Spinner animation="border" size="sm" /> : "Guardar Información"}
                            </Button>
                        )}
                    </Form>


                {/* ✅ Bloqueo de pantalla con spinner mientras se actualiza el perfil */}
                {showProfileBlockingLoader && (
                    <div className="blocking-loader">
                        <div className="blocking-spinner"></div>
                        <p className="loading-text">Actualizando Información...</p>
                    </div>
                )}

                {/* ✅ Ventana emergente de confirmación verde */}
                {showProfileSuccessModal && (
                    <div className="success-modal">
                        <div className="modal-content">
                            <h3>✅ ¡Información Actualizada!</h3>
                            <p>Tu perfil se ha actualizado correctamente.</p>
                            <button onClick={() => setShowProfileSuccessModal(false)} className="modal-button">OK</button>
                        </div>
                    </div>
                )}


                </Container>
          </section>
   
     
    
      <Footer />

      <style jsx>{`

        body {
            background: rgba(0, 0, 0, 0.85);
            background-image: url('/images/banner1.jpeg');
            background-size: cover;
            background-attachment: fixed;
            color: #fff;
          }
        .carousel-caption {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
        }
        .animated-title {
          color: #FFD700;
          font-size: 3rem;
          animation: pulse 2s infinite;
        }
        .man-pointing, .woman-pointing {
          position: absolute;
          top: 69%;
          transform: translateY(-50%);
          max-width: 20%;
          height: auto;
          animation: bounce 2s infinite;
        }
        .man-pointing { left: 2%; }
        .woman-pointing { right: 2%; }

        @media (max-width: 768px) {
          .carousel-caption {
            top: 40%;
          }
          .animated-title {
            font-size: 2rem;
          }
          .btn-lg {
            font-size: 1rem;
          }
          .man-pointing, .woman-pointing {
            max-width: 15%;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(-50%) translateX(0); }
          50% { transform: translateY(-50%) translateX(-10px); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
          .carousel-indicators [data-bs-target] {
            background-color: #007bff;
          }
          .carousel-control-prev-icon,
          .carousel-control-next-icon {
            background-color: #007bff;
          }
          .carousel-item {
            transition: transform 0.8s ease-in-out;
          }

          /*estilos para el calendario*/
           @media (max-width: 768px) {
              .fc-toolbar {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
              }

              .fc-toolbar-chunk {
                display: flex;
                justify-content: center;
                gap: 5px;
                flex-wrap: wrap;
              }

              .fc .fc-toolbar-title {
                color: #000000 !important;
                font-size: 1.2rem !important;
              }

              .fc-button {
                font-size: 0.8rem !important;
                padding: 4px 8px !important;
                background-color: #f4b400 !important;
                color: #000 !important;
                border: none !important;
                border-radius: 8px !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }

              .fc-toolbar-chunk .fc-button {
                background-color: #f4b400 !important;
                color: #000 !important;
                border: none !important;
              }

              .fc-daygrid-day-number, .fc-daygrid-day {
                color: #000000 !important;
                font-weight: bold !important;
              }

              .fc-toolbar-title {
                color: #000000 !important;
              }
            }

            @media (min-width: 769px) {
              .fc-toolbar-title {
                color: #000000 !important;
              }
              .fc-daygrid-day-number, .fc-daygrid-day {
                color: #000000 !important;
                font-weight: bold !important;
              }
            }

            /*ESTILOS PARA EL PERFIL*/
            .subscription-info p {
              margin: 5px 0;
              font-size: 1rem;
            }
            .subscription-info img:hover {
              cursor: pointer;
            }

            @media (max-width: 768px) {
              .subscription-info {
                flex-direction: column;
                text-align: center;
              }
              .subscription-info img {
                margin-bottom: 10px;
              }
              .subscription-info div {
                margin: 0 auto;
              }
            }

            .blocking-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5000;
                flex-direction: column;
            }

            .blocking-spinner {
                width: 80px;
                height: 80px;
                border: 8px solid rgba(255, 255, 255, 0.3);
                border-top: 8px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .loading-text {
                margin-top: 15px;
                color: white;
                font-size: 18px;
                font-weight: bold;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .success-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 5000;
                animation: fadeIn 0.3s ease-in-out;
                padding: 15px;
            }

            .modal-content {
                background: #28a745;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 4px 15px rgba(0, 255, 0, 0.8);
                animation: scaleIn 0.3s ease-in-out;
                color: white;
                font-weight: bold;
                width: 90%;
                max-width: 400px;
            }

            .modal-button {
                margin-top: 15px;
                padding: 10px 20px;
                border: none;
                background: #ffffff;
                color: #28a745;
                font-size: 16px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s, color 0.3s;
                font-weight: bold;
                width: 100%;
            }

            .modal-button:hover {
                background: #45a049;
                color: white;
            }

            .input-label {
                  color: #FFD700;
                  font-weight: bold;
                  text-shadow: 0 0 10px #FFD700;
              }

              .custom-input {
                  background: #0b0f19;
                  color: white;
                  border: 1px solid #FFD700;
                  box-shadow: 0 0 10px #FFD700;
                  padding: 10px;
                  border-radius: 8px;
                  transition: all 0.3s ease-in-out;
              }

              .custom-input:focus {
                  box-shadow: 0 0 20px #FFD700;
                  outline: none;
              }

              .custom-button {
                  background: #28a745;
                  border: none;
                  font-weight: bold;
                  box-shadow: 0 0 15px #28a745;
                  transition: all 0.3s ease-in-out;
                  width: 100%;
              }

              .custom-button:hover {
                  background: #218838;
                  box-shadow: 0 0 20px #28a745;
              }

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

          .bg-dark.bg-opacity-75 {
            background-color: rgba(0, 0, 0, 0.6) !important;
            box-shadow: 0 0 25px #0ff, 0 0 50px #0ff, 0 0 75px #00f;
            border-radius: 16px;
            border: 2px solid #0ff;
            transition: transform 0.5s ease, box-shadow 0.5s ease;
            transform: perspective(1000px) rotateX(0deg);
          }

          .bg-dark.bg-opacity-75:hover {
            transform: perspective(1000px) rotateX(3deg);
            box-shadow: 0 0 30px #0ff, 0 0 60px #0ff;
          }

          .custom-form {
            background: rgba(0, 0, 0, 0.6);
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 0 20px #0ff, 0 0 40px #0ff, 0 0 60px #00f;
            border: 2px solid #0ff;
            transform: perspective(1000px) rotateX(0deg);
            transition: transform 0.5s ease, box-shadow 0.5s ease;
          }

          .custom-form:hover {
            transform: perspective(1000px) rotateX(4deg);
            box-shadow: 0 0 30px #0ff, 0 0 60px #0ff, 0 0 90px #00f;
          }

          .custom-input {
          background: #0b0f19;
          color: white;
          border: 1px solid #0ff;
          box-shadow: 0 0 10px #0ff;
          padding: 10px;
          border-radius: 8px;
          transition: all 0.3s ease-in-out;
        }

        .custom-input:focus {
          box-shadow: 0 0 25px #0ff;
          outline: none;
        }




          .premio-superior{
            position: absolute;
            left: -120px;
            width: 200px;
            opacity: 0.9;
            z-index: 3;
            pointer-events: none;
          }

          .premio-superior img {
            width: 100%;
            height: auto;
            object-fit: contain;
          }

          /* Responsive: más pequeños aún en mobile */
          @media (max-width: 768px) {
            .premio-superior {
              width: 100px;
              opacity: 0.9;
            }
          }

            .premio-superior {
                top: 8%;
                animation: animPremio 14s linear infinite;
              }


            @keyframes animPremio {
              0% { left: -150px; transform: rotate(0deg); }
              50% { transform: rotate(10deg); }
              100% { left: 110%; transform: rotate(0deg); }
            }

            @keyframes animPremioReverse {
              0% { left: 110%; transform: rotate(0deg); }
              50% { transform: rotate(-10deg); }
              100% { left: -150px; transform: rotate(0deg); }
            }




      `}</style>

    </div>
  )
};

