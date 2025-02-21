"use client";

import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { DateTime } from "luxon";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Chat({ tipo, setStats }) {
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

        const countsByDate = [];
        let approved = 0, pending = 0, denied = 0;

        data.forEach(participant => {
          const date = participant.fechaRegistro.split(" ")[0];

          if (participant.estado === "aprobado") {
            approved++;
          } else if (participant.estado === "pendiente") {
            pending++;
          } else if (participant.estado === "denegado") {
            denied++;
          }

          countsByDate.push(date);
        });

        if (setStats) {
          setStats({ approved, pending, denied });
        }

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
          let contador = countsByDate.filter(date => date === dateStr).length;
          labels.push(dateStr);
          counts.push(contador);
        }

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Participantes Aprobados",
              data: counts,
              backgroundColor: "rgba(39, 39, 212, 0.6)",
              borderColor: "rgba(0, 0, 139, 1)",
              borderWidth: 1,
            },
          ],
        });

        setDoughnutChartData({
          labels: ["Aprobados", "Pendientes", "Denegados"],
          datasets: [
            {
              data: [approved, pending, denied],
              backgroundColor: ["#4CAF50", "#FFC107", "#F44336"],
              borderColor: ["#388E3C", "#FF9800", "#D32F2F"],
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
    const interval = setInterval(fetchParticipantData, 1200000);
    return () => clearInterval(interval);
  }, []);

  const now = DateTime.now().setZone("America/Lima");
  const drawDate = DateTime.fromISO("2025-02-13T00:00:00", { zone: "America/Lima" });
  const daysUntilDraw = Math.max(0, Math.ceil(drawDate.diff(now, "days").days));

  return (
    <div className="chart-container">
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="alert alert-danger">{error}</p>
      ) : (
        <>
          {tipo === "barras" && (
            <Bar 
              data={barChartData} 
              options={{ 
                responsive: true, 
                plugins: { legend: { display: false } },
                scales: { 
                  x: { ticks: { stepSize: 1 } }, 
                  y: { ticks: { stepSize: 5, max: 100 } } 
                } 
              }} 
            />
          )}
          {tipo === "dona" && (
            <Doughnut data={doughnutChartData} options={{ responsive: true, plugins: { legend: { display: true } } }} />
          )}
        </>
      )}
      <p>Faltan <strong>{daysUntilDraw}</strong> días para el sorteo.</p>
    </div>
  );
}
