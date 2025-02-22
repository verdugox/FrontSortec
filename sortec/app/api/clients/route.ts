import config from "../../../config";

export async function GET() {
  try {
    const response = await fetch(`${config.apiBaseUrl}/clients`);

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
    const response = await fetch(`${config.apiBaseUrl}/clients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: `Error al registrar cliente: ${errorData.error}` }), {
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

export async function PUT(request: Request) {
  try {
    const clientData = await request.json();
    const { id } = clientData;
    const response = await fetch(`${config.apiBaseUrl}/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: `Error al actualizar cliente: ${errorData.error}` }), {
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
    console.error("Error en PUT /api/clients:", err);
    return new Response(JSON.stringify({ error: "Error de conexión con la API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const response = await fetch(`${config.apiBaseUrl}/clients/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: `Error al eliminar cliente: ${errorData.error}` }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Cliente eliminado correctamente" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error en DELETE /api/clients:", err);
    return new Response(JSON.stringify({ error: "Error de conexión con la API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};


