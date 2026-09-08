// ==========================================
// FUNCIONES DE ESTILO / FORMATO
// ==========================================

// Convierte markdown ligero (negritas, saltos de línea) a HTML seguro.
// Las fórmulas $...$ se dejan intactas para que MathJax las procese después.
export function formatearTexto(texto) {
  let t = (texto || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\n/g, "<br>");
  return t;
}
