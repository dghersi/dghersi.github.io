// ==========================================
// FUNCIONES DE ESTILO / FORMATO
// ==========================================

function parseFilaTabla(linea) {
  const celdas = linea.trim().split("|").map(c => c.trim());
  if (celdas[0] === "") celdas.shift();
  if (celdas[celdas.length - 1] === "") celdas.pop();
  return celdas;
}

function escaparCelda(texto) {
  return (texto || "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function construirTablaHtml(encabezado, filas) {
  let html = '<table class="tabla-md"><thead><tr>';
  encabezado.forEach(c => { html += `<th>${escaparCelda(c)}</th>`; });
  html += "</tr></thead><tbody>";
  filas.forEach(fila => {
    html += "<tr>" + fila.map(c => `<td>${escaparCelda(c)}</td>`).join("") + "</tr>";
  });
  html += "</tbody></table>";
  return html;
}

// Detecta bloques de tabla Markdown (fila | fila | separador --- | filas...) y
// los saca del texto, reemplazándolos por un token temporal, para reinsertarlos
// como HTML ya armado al final (evita que se les aplique el escape/lista normal).
function extraerTablas(texto) {
  const lineas = texto.split("\n");
  const esFila = (l) => /^\s*\|.*\|\s*$/.test(l || "");
  const esSeparador = (l) => /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/.test(l || "");
  const tablas = [];
  const resultado = [];
  let i = 0;
  while (i < lineas.length) {
    if (esFila(lineas[i]) && esSeparador(lineas[i + 1])) {
      const encabezado = parseFilaTabla(lineas[i]);
      let j = i + 2;
      const filas = [];
      while (esFila(lineas[j])) { filas.push(parseFilaTabla(lineas[j])); j++; }
      tablas.push(construirTablaHtml(encabezado, filas));
      resultado.push(`@@TABLA_${tablas.length - 1}@@`);
      i = j;
    } else {
      resultado.push(lineas[i]);
      i++;
    }
  }
  return { texto: resultado.join("\n"), tablas };
}

// Convierte markdown ligero (negritas, listas, tablas, imágenes, saltos de línea)
// a HTML seguro. Las fórmulas $...$ se dejan intactas para que MathJax las procese.
export function formatearTexto(texto) {
  const { texto: sinTablas, tablas } = extraerTablas(texto || "");

  let t = sinTablas
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/!\[([^\]]*)\]\((data:[^)]+|https?:\/\/[^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width:100%;border-radius:6px;margin:.5rem 0;display:block;">');

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

  let resultado = partes.join("<br>");
  tablas.forEach((html, idx) => {
    resultado = resultado.split(`@@TABLA_${idx}@@`).join(html);
  });
  return resultado;
}
