// Motor de Generación de Reporte PDF
function exportPDFReport(data) {
  if (!window.jspdf) {
    console.error("Librería jsPDF no detectada.");
    return;
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Encabezado del Reporte
  doc.setFontSize(14);
  doc.text(`CHECKLIST PRE-OPERACIONAL - ${data.tipoMaquinaria.toUpperCase()}`, 15, 15);
  
  doc.setFontSize(9);
  doc.text(`Código Equipo: ${data.codigoEquipo} | Proyecto: ${data.proyecto} | Horómetro: ${data.horometro}`, 15, 23);
  doc.text(`Operador: ${data.operador} | Turno: ${data.turno} | Fecha: ${data.fechaHora}`, 15, 29);
  doc.text(`Ubicación GPS: ${data.gps}`, 15, 35);
  doc.text(`ESTADO DE OPERATIVIDAD: ${data.estadoOperativo}`, 15, 41);

  // Tabla de Resultados
  let y = 51;
  doc.setFontSize(8);
  doc.text("DETALLE DE LA INSPECCIÓN TÉCNICA:", 15, y);
  y += 6;

  for (const k in data.respuestas) {
    const item = data.respuestas[k];
    doc.text(`Item ${k}: [ ${item.val} ] - Criticidad: ${item.crit}`, 15, y);
    y += 5;
    
    // Control de Salto de Página
    if (y > 280) { 
      doc.addPage(); 
      y = 15; 
    }
  }

  // Descarga Directa
  doc.save(`Checklist_${data.tipoMaquinaria}_${data.codigoEquipo}.pdf`);
}