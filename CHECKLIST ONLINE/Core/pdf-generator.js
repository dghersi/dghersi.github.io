// Core/pdf-generator.js - Exportación oficial en PDF de la Inspección

function exportPDFReport(payload) {
  if (!window.jspdf) {
    alert("Error: La librería jsPDF no está cargada correctamente.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');

  // Configuración de Estilo y Colores
  const primaryColor = [27, 38, 49]; // Dark Slate
  const dangerColor = [231, 76, 60];  // Red LOTO
  const successColor = [46, 204, 113]; // Green

  // Encabezado / Membrete
  doc.setFillColor(...primaryColor);
  doc.rect(10, 10, 190, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`CHECKLIST PRE-OPERACIONAL - ${payload.tipoMaquinaria.toUpperCase()}`, 15, 18);
  doc.setFontSize(8);
  doc.text(`Código: S/N | Versión: 1 | Elaborado: DGM`, 135, 18);

  // Tabla de Datos Generales (Operador & Equipo)
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  
  let y = 28;
  doc.text(`Operador: ${payload.operador}`, 12, y);
  doc.text(`N° Licencia: ${payload.licencia}`, 110, y);
  y += 5;
  doc.text(`Frente/Obra: ${payload.frente}`, 12, y);
  doc.text(`Horómetro: ${payload.horometro}`, 110, y);
  y += 5;
  doc.text(`Código Equipo: ${payload.codigoEquipo}`, 12, y);
  doc.text(`Marca/Modelo: ${payload.marcaModelo}`, 110, y);
  y += 5;
  doc.text(`Frecuencia: ${payload.frecuencia}`, 12, y);
  doc.text(`Fecha/Hora: ${payload.fechaHora}`, 110, y);
  y += 5;
  doc.text(`Ubicación GPS: ${payload.gps}`, 12, y);

  // Estado Operativo
  y += 7;
  doc.setFillColor(...(payload.isLoto ? dangerColor : successColor));
  doc.rect(10, y - 4, 190, 7, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`ESTADO DE OPERATIVIDAD: ${payload.estadoOperativo}`, 15, y);

  // Detalle de Ítems Técnicos
  y += 10;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.text("RESUMEN DE INSPECCIÓN TÉCNICA POR BLOQUES:", 12, y);
  y += 6;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");

  for (const itemKey in payload.respuestas) {
    const item = payload.respuestas[itemKey];
    const statusText = `[ ${item.val} ] Ítem ${itemKey}: (${item.crit}) - Risk: ${item.r || 'N/A'}`;
    doc.text(statusText, 14, y);
    y += 4;

    if (y > 270) {
      doc.addPage();
      y = 15;
    }
  }

  // Reporte Preventivo (Acto o Condición Insegura)
  if (payload.reporteActoCondicion) {
    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text("REPORTADOR DE ACTO / CONDICIÓN INSEGURA:", 12, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.text(payload.reporteActoCondicion.substring(0, 120), 12, y);
    y += 6;
  }

  // Pie de Página - Firma
  y += 10;
  if (y > 250) {
    doc.addPage();
    y = 20;
  }
  doc.text("__________________________________", 12, y);
  doc.text(`Firma del Operador: ${payload.operador}`, 12, y + 5);

  // Descargar PDF
  doc.save(`Checklist_${payload.tipoMaquinaria}_${payload.codigoEquipo}.pdf`);
}

// Exportación global
window.exportPDFReport = exportPDFReport;