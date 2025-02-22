import config from "../../../config";

export const loginUser = async (dni: string, password: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ dni, password }),
        mode: "cors",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Credenciales incorrectas.");
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Error desconocido.");
    }
  };
  
  export const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/clients/perfil`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener el perfil del usuario.");
      }
  
      return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Error desconocido.");
    }
};