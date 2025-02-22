"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import ClientForm from "./ClientForm";
import { loginUser, fetchUserProfile } from "../api/services/api";


// Definir la interfaz Client
interface Perfil {
  id: string;
  codigoSortec: string;
  dni: string;
  nombres?: string;
  apellidos?: string;
  direccion: string;
  pais: string;
  provincia: string;
  distrito: string;
  correo?: string;
  telefono?: string;
  estado: string;
  fechaRegistro: string;
  rol: string;
}


// Definir la interfaz LoginProps
interface LoginProps {
  onLoginSuccess?: (userData: Perfil, token: string) => void;
  onClose?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // Autenticación del usuario
      const data = await loginUser(dni, password);
      console.log("🔹 Token recibido:", data.token);
  
      if (!data.token) {
        throw new Error("Error al obtener el token de autenticación.");
      }
  
      localStorage.setItem("token", `Bearer ${data.token}`);
  
      // Obtención del perfil del usuario autenticado
      const perfilData = await fetchUserProfile(data.token);
      localStorage.setItem("client", JSON.stringify(perfilData.perfil));
      onLoginSuccess?.(perfilData.perfil, data.token);
  
      console.log("🔹 Perfil del usuario:", perfilData.perfil);
      console.log("🔹 Rol del usuario:", localStorage);
  
      // Redirección según el rol del usuario
      if (perfilData.perfil.rol === "ADMINISTRADOR") {
        router.push("/dashboard");
      } else if (perfilData.perfil.rol === "PARTICIPANTE") {
        router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    }
  };

  return (
    <div className="container mt-5">
      {!showRegister ? (
        <div className="card p-4 shadow-lg">
          <h2 className="text-center">Iniciar Sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <input
                type="password"
                className="form-control"
                placeholder="Código Sortec"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Ingresar
            </button>
          </form>

          <div className="text-center mt-3">
            <p>¿No tienes cuenta? <a href="#" onClick={() => setShowRegister(true)}>Regístrate aquí</a></p>
          </div>
        </div>
      ) : (
        <ClientForm />
      )}
    </div>
  );
}
