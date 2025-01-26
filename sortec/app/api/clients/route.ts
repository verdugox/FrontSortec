export async function GET() {
    try {
      const response = await fetch("http://48.216.202.189/api/clients");
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: `Error al obtener clientes: ${response.statusText}` }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error en GET /api/clients:", err);
  
      return new Response(
        JSON.stringify({ error: "Error de conexión con la API" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }


  export async function POST(request: Request) {
    try {
      const clientData = await request.json();
      const response = await fetch("http://48.216.202.189/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
  
      if (!response.ok) {
        return new Response(JSON.stringify({ error: `Error al registrar cliente: ${response.statusText}` }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error en POST /api/clients:", err);
      return new Response(JSON.stringify({ error: "Error de conexión con la API" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  