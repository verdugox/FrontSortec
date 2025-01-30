"use client";

import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Chat() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [barChartData, setBarChartData] = useState({ labels: [], datasets: [] });
  const [doughnutChartData, setDoughnutChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) {
          throw new Error("Error al obtener la cantidad de participantes registrados.");
        }
        const data = await response.json();
        // Procesa los datos para obtener la cantidad de participantes aprobados por día
        const countsByDate = [];
        const approvedParticipants = data.filter(participant => participant.estado === "aprobado");
        approvedParticipants.forEach(participant => {
          //if (participant.fechaRegistro) {
            const date = participant.fechaRegistro.split(" ")[0]; // Extrae solo la fecha
            //countsByDate[date] = (countsByDate[date] || 0) + 1;
            countsByDate.push(date);
          //}
        });
        // Genera las etiquetas y los datos del gráfico de barras
        const labels = [];
        const counts = [];
        const startDate = new Date("2025-01-29");
        const endDate = new Date("2025-02-14");
        for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = new Intl.DateTimeFormat("es-ES", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
          }).format(d);
          var contador = 0;
            for(let i = 0; i < countsByDate.length; i++) {
                if(countsByDate[i] === dateStr) {
                    contador = contador + 1;
                }
            }
            labels.push(dateStr);
            counts.push(contador);
        }
        //29/01/2025 20:34:50" 
        setBarChartData({
          labels,
          datasets: [
            {
              label: "Participantes Aprobados",
              data: counts,
              backgroundColor: "rgba(39, 39, 212, 0.6)", // Azul oscuro 3D
              borderColor: "rgba(0, 0, 139, 1)",
              borderWidth: 1,
            },
          ],
        });

        // Genera los datos del gráfico circular
        setDoughnutChartData({
          labels: ["Total Participantes Aprobados"],
          datasets: [
            {
              data: [approvedParticipants.length],
              backgroundColor: ["rgba(75, 192, 192, 0.6)"],
              borderColor: ["rgba(75, 192, 192, 1)"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("❌ Error al obtener la cantidad de participantes registrados:", error);
        setError("No se pudo obtener la cantidad de participantes registrados.");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipantData();

    const interval = setInterval(fetchParticipantData, 1200000); // Actualiza cada 2 minuto
    return () => clearInterval(interval);
  }, []);

  const daysUntilDraw = Math.max(0, Math.ceil((new Date("2025-02-13") - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="chat-container">
      <h3 style={{ color: "#007bff" }}>Participantes Registrados</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="alert alert-danger">{error}</p>
      ) : (
        <>
          <Bar 
            data={barChartData} 
            options={{ 
              responsive: true, 
              plugins: { 
                legend: { display: false } 
              }, 
              scales: { 
                x: { 
                  beginAtZero: true, 
                  ticks: { stepSize: 1 } 
                }, 
                y: { 
                  beginAtZero: true, 
                  ticks: { stepSize: 5, max: 100 } 
                } 
              } 
            }} 
          />
          <Doughnut data={doughnutChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
        </>
      )}
      <p>Faltan <strong>{daysUntilDraw}</strong> días para el sorteo.</p>
    </div>
  );
}