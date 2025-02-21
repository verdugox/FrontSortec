import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generateInvoicePDF = (client, payment) => {
    const doc = new jsPDF({
        orientation: "portrait", // Formato vertical
        unit: "mm",
        format: [100, 400], // Aumento de altura a 180mm para evitar cortes
    });

    // Datos de la empresa SORTEC
    const companyName = "SORTEC S.A.C.";
    const companyAddress = "Redes Sociales Facebook - SORTEC S.A.C.";
    const companyRUC = "2060647557";
    const companyWebsite = "sortsortech.azurewebsites.net";

    // Número de boleta basado en el ID del pago
    const invoiceNumber = `BBB1-${payment.id.slice(-6).toUpperCase()}`;

    // Datos del cliente y pago
    const clientName = `${client.nombres} ${client.apellidos}`;
    const clientDNI = client.dni || "00000000";
    const clientAddress = client.direccion || "No disponible";
    const paymentDate = payment.fechaPago;
    const paymentAmount = `S/ ${payment.monto.toFixed(2)}`;

    // Configurar PDF con más altura
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(companyName, 40, 10, { align: "center" });
    doc.setFontSize(8);
    doc.text(companyAddress, 40, 15, { align: "center" });
    doc.text(`RUC: ${companyRUC}`, 40, 19, { align: "center" });

    // Boleta de venta
    doc.setFontSize(10);
    doc.text("BOLETA DE VENTA ELECTRÓNICA", 40, 24, { align: "center" });
    doc.setFontSize(12);
    doc.text(invoiceNumber, 40, 29, { align: "center" });

    // Datos del cliente
    doc.setFontSize(8);
    doc.text("ADQUIRIENTE", 10, 35);
    doc.text(`DNI: ${clientDNI}`, 10, 40);
    doc.text(`Nombre: ${clientName}`, 10, 45);
    doc.text(`Dirección: ${clientAddress}`, 10, 50);

    // Fecha de emisión y vencimiento
    doc.text(`Fecha Emisión: ${paymentDate}`, 10, 56);
    doc.text(`Fecha Vencimiento: ${paymentDate}`, 10, 61);

    // Crear tabla de detalle de la compra
    autoTable(doc, {
        startY: 66,
        styles: { fontSize: 8 },
        head: [["Cant.", "Descripción", "P/U", "Total"]],
        body: [["1", "Suscripción Mensual", "8.00", paymentAmount]],
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        bodyStyles: { fillColor: [255, 255, 255] },
    });

    // Resumen de montos
    const yPosition = doc.previousAutoTable.finalY + 5;
    doc.text(`Gravada: S/ 7.20`, 10, yPosition);
    doc.text(`IGV (18%): S/ 0.80`, 10, yPosition + 5);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ${paymentAmount}`, 10, yPosition + 10);
    doc.setFont("helvetica", "normal");

    // Importe en letras
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTE EN LETRAS:", 10, yPosition + 15);
    doc.setFont("helvetica", "normal");
    doc.text("OCHO NUEVOS SOLES", 10, yPosition + 20);

    // Información de validación
    doc.setFontSize(8);
    doc.text("Representación impresa de la BOLETA DE VENTA", 10, yPosition + 25);
    doc.text("ELECTRÓNICA, visita:", 10, yPosition + 30);
    doc.setFont("helvetica", "bold");
    doc.text(companyWebsite, 10, yPosition + 35);
    doc.setFont("helvetica", "normal");
    doc.text("Autorizado por Intendencia No.034-005-0005315", 10, yPosition + 40);

    // Código QR de validación
    // Código QR para la página de Facebook de SORTEC
    const facebookURL = "https://www.facebook.com/profile.php?id=61571509086893";
    doc.text("Escanee el QR para visitar nuestro Facebook:", 10, yPosition + 45);
    doc.addImage("https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=" + encodeURIComponent(facebookURL), "PNG", 20, yPosition + 50, 40, 40);


    // Descargar PDF con nombre único
    doc.save(`Boleta_${clientName.replace(/\s/g, "_")}_${payment.id}.pdf`);
};

export default generateInvoicePDF;
