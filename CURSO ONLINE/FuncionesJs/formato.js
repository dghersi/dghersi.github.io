// ==========================================
// FUNCIONES DE ESTILO / FORMATO
// ==========================================

// Convierte markdown ligero (negritas, listas, saltos de línea) a HTML seguro.
// Las fórmulas $...$ se dejan intactas para que MathJax las procese después.
export function formatearTexto(texto) {
  let t = (texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  const lineas = t.split("\n");
  const partes = [];
  let listaActual = null;
  lineas.forEach(linea => {
    const item = linea.match(/^\s*\*\s+(.*)/);
    if (item) {
      if (!listaActual) listaActual = [];
      listaActual.push(item[1]);
    } else {
      if (listaActual) {
        partes.push("<ul>" + listaActual.map(li => `<li>${li}</li>`).join("") + "</ul>");
        listaActual = null;
      }
      partes.push(linea);
    }
  });
  if (listaActual) partes.push("<ul>" + listaActual.map(li => `<li>${li}</li>`).join("") + "</ul>");
  return partes.join("<br>");
}
