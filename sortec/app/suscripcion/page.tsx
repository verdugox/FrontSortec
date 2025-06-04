"use client";

import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Table, Badge, Modal, Form, Alert, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { FaDownload } from "react-icons/fa";
import generateInvoicePDF from "../components/GenerateInvoice"; // Ajusta la ruta según tu proyecto
import Menu from "../components/Menu";
import Footer from "../components/Footer";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dizkdk1te";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Sortecfiles";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

const URL_MICRO_BACKEND = 'https://api.sorteosc.com/api';


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

export default function Suscripcion() {
    const [client, setClient] = useState<Perfil | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [subscriptionAmount] = useState(8.00);
    const [voucherUrl, setVoucherUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");   
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false); // ✅ Estado de carga para el botón
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState(false);
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
    const [showPaymentBlockingLoader, setShowPaymentBlockingLoader] = useState(false);
    const [showDeleteBlockingLoader, setShowDeleteBlockingLoader] = useState(false);
    const [daysUntilRenewal, setDaysUntilRenewal] = useState<number | null>(null);
    const [canRenew, setCanRenew] = useState(false);
    
    
    // ✅ useEffect SIEMPRE se define antes de cualquier return
    useEffect(() => {
      if (!client || payments.length === 0) return;
  
      // ✅ Obtener la última fecha de pago correctamente
      const lastPayment = getLastPaymentDate(payments);
      if (!lastPayment) return;
  
      // ✅ Calcular la fecha de facturación (1 mes después del último pago)
      const billingDate = new Date(lastPayment);
      const originalDay = billingDate.getDate(); // Tomamos el día exacto del último pago
      billingDate.setMonth(billingDate.getMonth() + 1);
  
      // ✅ Si el día cambió tras sumar el mes, ajustar al último día del mes correcto
      if (billingDate.getDate() !== originalDay) {
          billingDate.setDate(0); // Esto ajusta la fecha al último día del mes
      }
  
      // ✅ Resetear horas, minutos y segundos para evitar errores en comparación
      billingDate.setHours(0, 0, 0, 0);
  
      // ✅ Obtener la fecha actual en la zona horaria de Lima
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
  
      // ✅ Calcular días restantes correctamente
      const differenceInTime = billingDate.getTime() - currentDate.getTime();
      const daysRemaining = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
  
      // ✅ Solo actualizar si cambia el estado (evita renders innecesarios)
      if (daysRemaining !== daysUntilRenewal) {
          setDaysUntilRenewal(daysRemaining);
      }
  
      // ✅ Habilitar el botón solo si la fecha actual es IGUAL o MAYOR a la de facturación
      setCanRenew(currentDate >= billingDate);
  }, [client, payments]);
  
  
  
  
    
  
  

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

    useEffect(() => {
      const fetchPayments = async () => {
          if (!client?.id) return; // Evita ejecutar la petición si client.id no está definido
  
          try {
              const token = localStorage.getItem("token");
              const response = await fetch(`${URL_MICRO_BACKEND}/payments/client/${client.id}`, {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}` || "",
                  }
              });
  
              if (response.ok) {
                  const data = await response.json();
                  setPayments(data);
              } else {
                  console.error("Error al obtener los pagos:", response.statusText);
              }
          } catch (error) {
              console.error("Error en la solicitud de pagos:", error);
          }
      };
  
      fetchPayments();
  }, [client?.id]); // Se ejecutará cuando el ID del cliente esté disponible
  


    const handleRenewSubscription = () => {
        setShowModal(true);
    };

    const handleVoucherUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        setError("Debes adjuntar un comprobante de pago.");
        return;
      }
  
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
          const response = await fetch(CLOUDINARY_URL, {
              method: "POST",
              body: formData,
          });

          const uploadedImageData = await response.json();

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error al registrar cliente: ${errorData.error}`);
          }

          setVoucherUrl(uploadedImageData.secure_url);
          setError("");
      } catch (error) {
          setError(`Error en el proceso. ${error instanceof Error ? error.message : ""}`);
      } finally {
          setUploading(false);
      }
  };

  const handleDeleteSubscription = async () => {
    setShowDeleteBlockingLoader(true); // ✅ Bloquea la pantalla al eliminar la suscripción
    setLoadingDelete(true);

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${URL_MICRO_BACKEND}/clients/${client?.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}` || "",
            },
        });

        if (!response.ok) {
            throw new Error("Error al eliminar la suscripción.");
        }

        // ✅ Eliminar datos del usuario
        localStorage.removeItem("token");
        localStorage.removeItem("client");

        // ✅ Mostrar mensaje de éxito antes de redirigir
        setTimeout(() => {
            setShowDeleteBlockingLoader(false); // ✅ Desbloquear pantalla al eliminar
            setShowDeleteSuccessModal(true); // ✅ Mostrar modal de éxito
        }, 1000);

    } catch (error) {
        console.error("Error eliminando la suscripción:", error);
        setShowDeleteBlockingLoader(false);
    } finally {
        setLoadingDelete(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!voucherUrl) {
        setError("Por favor, adjunta un voucher de pago antes de continuar.");
        return;
    }
    setLoading(true);
    setShowPaymentBlockingLoader(true); // ✅ Bloquea la pantalla mientras carga el pago
    setError("");

    const paymentData = {
        clientId: client?.id,
        monto: subscriptionAmount,
        voucherUrl: voucherUrl
    };

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${URL_MICRO_BACKEND}/payments/register-payment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` || ""
            },
            body: JSON.stringify(paymentData)
        });

        if (!response.ok) {
            throw new Error("Error al registrar la renovación de suscripción.");
        }

        setTimeout(() => {
            setShowPaymentBlockingLoader(false); // ✅ Desbloquea la pantalla al completar el pago
            setShowModal(false); // ✅ Cierra el modal de pago
            setShowSuccessModal(true); // ✅ Muestra el modal de éxito
        }, 1000);

        setSuccessMessage("✅ ¡Suscripción renovada con éxito! Se ha enviado un correo al administrador para su validación y pronto recibirás la confirmación. 🎉");
        setLoading(false);
    } catch (error) {
        setError(`Error en el proceso del pago. ${error instanceof Error ? error.message : ""}`);
        setLoading(false);
        setShowPaymentBlockingLoader(false);
    }
   };


    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        window.location.reload(); // ✅ Recargar la página después de cerrar el modal de éxito
    };

    

    if (!client) return <p style={{ color: "#fff", textAlign: "center" }}>Cargando...</p>;

    const parseFechaRegistro = (fechaString: string) => {
      if (!fechaString) return null;
      const partes = fechaString.split(/[\/ :]/); // Ajustado para manejo correcto
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
  
  const registrationDate = parseFechaRegistro(client.fechaRegistro);
  const lastPaymentDate = getLastPaymentDate(payments);
  
  let subscriptionEndDate = "Fecha inválida";
  let daysRegistered = "Fecha inválida";
  
  if (lastPaymentDate) {
      const endDate = new Date(lastPaymentDate);
      const billingDay = endDate.getDate(); // Tomamos el día exacto del último pago
      endDate.setMonth(endDate.getMonth() + 1);
  
      // ✅ Si el mes siguiente no tiene el mismo día, ajustar al último día del mes
      if (endDate.getDate() !== billingDay) {
          endDate.setDate(0);
      }
  
      subscriptionEndDate = endDate.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
  }
  
    if (registrationDate) {
        // ✅ Obtener la fecha actual en la zona horaria de Lima
        const formatter = new Intl.DateTimeFormat("es-PE", {
            timeZone: "America/Lima",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        const formattedCurrentDate = formatter.format(new Date());
        const currentDate = new Date(formattedCurrentDate.split("/").reverse().join("-")); // Convertir formato

        // ✅ Normalizar la fecha de registro eliminando horas, minutos y segundos
        const normalizedRegistrationDate = new Date(registrationDate);
        normalizedRegistrationDate.setHours(0, 0, 0, 0);

        // ✅ Calcular la diferencia en días asegurando que sea exacta
        const diffTime = Math.abs(currentDate.getTime() - normalizedRegistrationDate.getTime());
        daysRegistered = Math.round(diffTime / (1000 * 60 * 60 * 24)).toString();
    }

  
  return (
    <div className="main-container">
      
        <section className="user-info my-5 my-4 position-relative">
            <br />
            <br />
            <br />
            <Container style={{ color: "#fff" }}>
            <section>
                  <Menu 
                      client={client} 
                      onLogout={handleLogout} 
                      scrollToTop={scrollToTop}
                      onLoginClick={() => router.push('/login')} 
                      setShowLogin={(show: boolean) => console.log('Set show login:', show)}
                    />
            </section>
            <Card style={{ background: "#0b0f19", borderRadius: "15px", padding: "20px" }}>
                <h3 style={{ color: "#fff", textShadow: "0 0 10px #ffffff" }}>Mi suscripción</h3>
                <Row>
                    <Col md={6}>
                        <Card className="subscription-info-text" style={{ background: "#151a30", padding: "15px", borderRadius: "10px", color: "#fff", textShadow: "0 0 10px #ffffff" }}>
                            <p><strong>Suscriptor desde:</strong> {registrationDate ? registrationDate.toLocaleDateString("es-ES") : "Fecha inválida"}</p>
                            <p><strong>Fecha de facturación:</strong> {subscriptionEndDate}</p>
                            <p><strong>Monto de facturación:</strong> S/ 8.00</p>
                            <p><strong>Suscrito hace:</strong> {daysRegistered} días</p>
                        </Card>
                    </Col>
                    <Col md={6} className="text-center">
                        <Card style={{ background: "#151a30", padding: "15px", borderRadius: "10px", color: "#fff", textShadow: "0 0 10px #ffffff" }}>
                            <h5>Tu medio de pago actual es:</h5>
                            <img src="/images/CARD.png" alt="Tarjeta" style={{ width: "100%", borderRadius: "10px" }} />
                            <p style={{ color: "#bbb", textShadow: "0 0 10px #ffffff" }}>El medio de pago que tienes es YAPE/PLIN, pronto estaremos habilitando pagos con VISA.</p>
                        </Card>
                    </Col>
                </Row>
            </Card>

            <Card style={{ background: "#0b0f19", borderRadius: "15px", padding: "20px", marginTop: "20px" }}>
                <h3 style={{ color: "#fff", textShadow: "0 0 10px #ffffff" }}>Mis pagos</h3>
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <Table striped bordered hover variant="dark" className="text-center">
                        <thead>
                            <tr>
                                <th>Estado</th>
                                <th>DNI</th>
                                <th>Fecha</th>
                                <th>Monto</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, index) => (
                            <tr key={index}>
                              <td>
                                <Badge 
                                  bg={
                                    payment.estado === "pagado" ? "success" : 
                                    payment.estado === "pendiente" ? "warning" : "danger"
                                  }
                                >
                                  {payment.estado === "pagado" ? "Pago exitoso" : 
                                  payment.estado === "pendiente" ? "Pendiente" : "Inactivo"}
                                </Badge>
                              </td>
                              <td>{payment.dni}</td>
                              <td>Pago suscripción: {payment.fechaPago}</td>
                              <td>Facturado: {payment.monto.toFixed(2)} S/</td>
                              <td>
                                <Button
                                  onClick={() => payment.estado === "pagado" && generateInvoicePDF(client, payment)}
                                  disabled={payment.estado !== "pagado"}
                                  style={{ 
                                    background: payment.estado === "pagado" ? "#4c91ff" : "#ff4c4c", 
                                    boxShadow: payment.estado === "pagado" ? "0 0 10px #4c91ff" : "0 0 10px #ff4c4c",
                                    color: "#fff", 
                                    padding: "10px 15px", 
                                    border: "none", 
                                    cursor: payment.estado === "pagado" ? "pointer" : "not-allowed", 
                                    fontSize: "14px", 
                                    borderRadius: "5px", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    opacity: payment.estado === "pagado" ? "1" : "0.6"
                                  }}
                                >
                                  <FaDownload style={{ color: "yellow", marginRight: "5px" }} />
                                  {payment.estado === "pagado" ? "Descargar boleta" : "No Disponible"}
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                    </Table>
                </div>
            </Card>

            <Card style={{ background: "#0b0f19", borderRadius: "15px", padding: "20px", marginTop: "20px", boxShadow: "0 0 15px rgba(255, 215, 0, 0.8)" }}>
                <h3 style={{ color: "#FFD700", textShadow: "0 0 10px #FFD700" }}>Renovar Suscripción</h3>
                <p style={{ color: "#fff", textShadow: "0 0 10px #ffffff" }}>
                    Al renovar tu suscripción, accederás a todos los beneficios por un mes más por tan solo S/ {subscriptionAmount}.00. 
                    Además, seguirás participando en nuestros sorteos exclusivos.
                </p>
                <Button style={{ 
                    background: "#FFD700", 
                    boxShadow: "0 0 10px #FFD700", 
                    border: "none", 
                    color: "#000",
                    transition: "all 0.3s ease-in-out" 
                }} 
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px #FFD700"}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.boxShadow = "0 0 10px #FFD700"}
                onClick={handleRenewSubscription}>
                    Renovar Suscripción
                </Button>
            </Card>
            
            <Card style={{ background: "#0b0f19", borderRadius: "15px", padding: "20px", marginTop: "20px", boxShadow: "0 0 15px rgba(255, 77, 77, 0.8)" }}>
                <h3 style={{ color: "#ff4d4d", textShadow: "0 0 10px #ff4d4d" }}>Eliminar suscripción</h3>
                <p style={{ color: "#fff", textShadow: "0 0 10px #ffffff" }}>
                    Al eliminar tu suscripción, perderás acceso a los beneficios y premios desde la fecha de vencimiento.
                    No podrás acceder a la cuenta hasta que intentes renovar tu suscripción en el próximo inicio de sesión.
                </p>
                <Button
                    style={{
                        background: "#ff4d4d",
                        boxShadow: "0 0 10px #ff4d4d",
                        border: "none",
                        transition: "all 0.3s ease-in-out"
                    }}
                    onMouseOver={(e) => (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px #ff4d4d"}
                    onMouseOut={(e) => (e.target as HTMLButtonElement).style.boxShadow = "0 0 10px #ff4d4d"}
                    onClick={() => setShowDeleteModal(true)}
                >
                    Eliminar suscripción
                </Button>
            </Card>


            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Renovar Suscripción</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Información de Pago</h4>
                <p>
                    Realice el pago al número <strong>977559149 - Luis Acuña</strong>, abonando solo{" "}
                    <span style={{ fontSize: "1.5em", color: "#8e44ad", fontWeight: "bold" }}>S/8 soles</span>
                </p>
                <div className="text-center mb-3">
                    <Image src="/images/QRYapeLuis.png" alt="QR Yape" width={300} height={300} className="img-fluid" />
                </div>

                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Adjunta tu voucher de pago</Form.Label>
                        <Form.Control type="file" onChange={handleVoucherUpload} />
                    </Form.Group>
                    {uploading && <Spinner animation="border" variant="warning" />}
                    {error && <Alert variant="danger">{error}</Alert>}
                </Form>

                {/* ✅ Mensaje en rojo si aún faltan días */}
                {daysUntilRenewal !== null && daysUntilRenewal > 0 && (
                    <p style={{ color: "red", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                        ⏳ Faltan {daysUntilRenewal} día(s) para que puedas renovar tu suscripción.
                    </p>
                )}

                {/* ✅ Mensaje en amarillo si la suscripción ya venció */}
                {daysUntilRenewal !== null && daysUntilRenewal <= 0 && (
                    <p style={{ color: "#ffc107", fontWeight: "bold", textAlign: "center", marginTop: "10px" }}>
                        ⚠ Tu suscripción ha vencido. Debes realizar el pago para continuar con los beneficios.
                    </p>
                )}

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
              </Button>

              <Button 
                    variant="warning" 
                    disabled={!canRenew || !voucherUrl || loading} 
                    onClick={handleConfirmPayment}
                >
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Confirmar Pago"}
                </Button>

          </Modal.Footer>
        </Modal>

           {/* ✅ Bloqueo de pantalla con spinner mientras se registra el pago */}
            {showPaymentBlockingLoader && (
                <div className="blocking-loader">
                    <div className="blocking-spinner"></div>
                    <p className="loading-text">Registrando Pago...</p>
                </div>
            )}
          {/* ✅ Ventana emergente dinámica con efectos y diseño responsive */}
          {showSuccessModal && (
                <div className="success-modal" id="success-modal">
                    <div className="modal-content">
                        <h3>🎉 ¡Pago Exitoso!</h3>
                        <p>{successMessage}</p>
                        <button onClick={handleCloseSuccessModal} className="modal-button">OK</button>
                    </div>
                </div>
            )}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
              <div className="delete-modal">
                  <Modal.Header closeButton style={{ borderBottom: "2px solid #ff0000" }}>
                      <Modal.Title style={{ color: "#ff4d4d", textShadow: "0 0 15px #ff4d4d" }}>
                          ⚠ ¡ALERTA! Eliminación de Suscripción
                      </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <p style={{ color: "#fff", fontSize: "18px", textAlign: "center" }}>
                          ¿Estás seguro de que deseas eliminar tu suscripción?
                      </p>
                      <p style={{
                          color: "#ff4d4d",
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: "20px",
                          textShadow: "0 0 15px red"
                      }}>
                          🚨 Esto eliminará tu registro y TODO tu historial de pagos. 🚨
                      </p>
                  </Modal.Body>
                  <Modal.Footer style={{ borderTop: "2px solid #ff0000" }}>
                      <Button variant="secondary" onClick={() => setShowDeleteModal(false)} style={{ fontWeight: "bold" }}>
                          ❌ Cancelar
                      </Button>
                      <Button
                          variant="danger"
                          onClick={handleDeleteSubscription}
                          disabled={loadingDelete}
                          className="delete-button"
                      >
                          {loadingDelete ? "Eliminando..." : "🔥 Aceptar y Eliminar"}
                      </Button>
                  </Modal.Footer>
              </div>
          </Modal>

          {/* ✅ Bloqueo de pantalla con spinner mientras se elimina la suscripción */}
          {showDeleteBlockingLoader && (
              <div className="blocking-loader">
                  <div className="blocking-spinner"></div>
                  <p className="loading-text">Eliminando Suscripción...</p>
              </div>
          )}
          {/* ✅ Ventana emergente de confirmación verde */}
          {showDeleteSuccessModal && (
              <div className="success-modal">
                  <div className="modal-content">
                      <h3>✅ ¡Suscripción Eliminada!</h3>
                      <p>Tu suscripción ha sido eliminada correctamente. Ya no podrás iniciar sesión hasta que vuelvas a registrarte.</p>
                      <button onClick={() => router.push("/")} className="modal-button">OK</button>
                  </div>
              </div>
          )}
        </Container>
      </section>

      <Footer />


      <style jsx>{`

        body {
            background: rgba(0, 0, 0, 0.85);
            background-image: url('/images/fondo02.jpeg');
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
    @media (max-width: 600px) {
        .modal-content {
            width: 100%;
            max-width: 90%;
        }
    }


        .delete-modal {
            background: #250000;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.8);
            border: 2px solid #ff0000;
            animation: glow 1.5s infinite alternate;
        }

        @keyframes glow {
            0% { box-shadow: 0 0 10px red; }
            100% { box-shadow: 0 0 30px red; }
        }

        .delete-button {
            background: #ff0000;
            border: none;
            font-weight: bold;
            box-shadow: 0 0 15px red;
            transition: all 0.3s ease-in-out;
            animation: pulse 1s infinite alternate;
        }

        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 15px red; }
            100% { transform: scale(1.1); box-shadow: 0 0 25px red; }
        }

        .delete-button:hover {
            background: #cc0000;
            box-shadow: 0 0 25px red;
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

      /* ✅ Estilos para la ventana de confirmación verde */
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
     
      `}</style>

    </div>
  )
};

