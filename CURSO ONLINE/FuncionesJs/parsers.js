// ==========================================
// FUNCIONES DE LÓGICA / PARSEO
// ==========================================

// Extrae el valor de un campo "**Campo:**" hasta el siguiente campo conocido o el final del bloque.
export function extraerCampoMd(bloque, campo, siguientesCampos) {
  const corte = siguientesCampos.length
    ? `(?=\\*\\*(${siguientesCampos.join("|")}):\\*\\*)`
    : "$";
  const regex = new RegExp(`\\*\\*${campo}:\\*\\*\\s*([\\s\\S]*?)\\s*${corte}`, "i");
  const m = bloque.match(regex);
  return m ? m[1].trim() : "";
}

// Convierte el Markdown con encabezados "## " en la estructura
// {diapositivas, problemas, codigo, examen} que usa el reproductor.
export function parsearMarkdown(texto) {
  const diapositivas = [], problemas = [], codigo = [];
  let examenPreguntas = [], examenRespuestas = [], tiempoEstimado = null;

  const secciones = texto.split(/\n(?=##\s)/);
  secciones.forEach(sec => {
    const headerMatch = sec.match(/^##\s*(.+)/);
    if (!headerMatch) return; // preámbulo o título H1, se ignora
    const header = headerMatch[1].trim();
    const cuerpo = sec.replace(/^##.*\n?/, "");

    if (/^Diapositiva/i.test(header)) {
      const titulo = header.replace(/^Diapositiva\s*\d*:?\s*/i, "").trim();
      let contenido = cuerpo, svg = "";
      const svgMatch = cuerpo.match(/```svg\s*([\s\S]*?)```/i);
      if (svgMatch) {
        svg = svgMatch[1].trim();
        contenido = cuerpo.replace(svgMatch[0], "").trim();
      }
      diapositivas.push({ titulo, contenido: contenido.trim(), svg });
    } else if (/^Problema/i.test(header)) {
      let svg = "";
      let cuerpoLimpio = cuerpo;
      const svgMatchProb = cuerpo.match(/```svg\s*([\s\S]*?)```/i);
      if (svgMatchProb) {
        svg = svgMatchProb[1].trim();
        cuerpoLimpio = cuerpo.replace(svgMatchProb[0], "");
      }
      problemas.push({
        enunciado: extraerCampoMd(cuerpoLimpio, "Enunciado", ["Solución", "Solucion"]),
        solucion: extraerCampoMd(cuerpoLimpio, "Soluci[oó]n", []),
        svg
      });
    } else if (/^C[oó]digo/i.test(header)) {
      const ref = header.replace(/^C[oó]digo:?\s*/i, "").trim();
      const codeMatch = cuerpo.match(/```[a-z]*\s*([\s\S]*?)```/i);
      codigo.push({ problema_ref: ref, codigo: codeMatch ? codeMatch[1].trim() : cuerpo.trim() });
    } else if (/^Examen/i.test(header)) {
      const tiempoMatch = cuerpo.match(/\*\*Tiempo estimado:\*\*\s*(\d+)/i);
      tiempoEstimado = tiempoMatch ? Number(tiempoMatch[1]) : null;
      examenPreguntas = [...cuerpo.matchAll(/^\d+\.\s*(.+)$/gm)].map(m => m[1].trim());
    } else if (/^Clave/i.test(header)) {
      examenRespuestas = [...cuerpo.matchAll(/^\d+\.\s*(.+)$/gm)].map(m => m[1].trim());
    }
  });

  if (diapositivas.length === 0) {
    throw new Error("No se encontraron diapositivas en el Markdown — revisa el formato devuelto por la IA.");
  }
  const examen = examenPreguntas.length > 0
    ? { preguntas: examenPreguntas.map((p, i) => ({ pregunta: p, respuesta: examenRespuestas[i] || "" })), tiempo_estimado_min: tiempoEstimado }
    : null;
  return { diapositivas, problemas, codigo, examen };
}

// Parsea SOLO un bloque de examen nuevo (## Examen de práctica + ## Clave de
// respuestas), usado cuando se piden preguntas nuevas sin regenerar la sesión completa.
export function parsearExamenSolo(texto) {
  let examenPreguntas = [], examenRespuestas = [], tiempoEstimado = null;
  const secciones = texto.split(/\n(?=##\s)/);
  secciones.forEach(sec => {
    const headerMatch = sec.match(/^##\s*(.+)/);
    if (!headerMatch) return;
    const header = headerMatch[1].trim();
    const cuerpo = sec.replace(/^##.*\n?/, "");
    if (/^Examen/i.test(header)) {
      const tiempoMatch = cuerpo.match(/\*\*Tiempo estimado:\*\*\s*(\d+)/i);
      tiempoEstimado = tiempoMatch ? Number(tiempoMatch[1]) : null;
      examenPreguntas = [...cuerpo.matchAll(/^\d+\.\s*(.+)$/gm)].map(m => m[1].trim());
    } else if (/^Clave/i.test(header)) {
      examenRespuestas = [...cuerpo.matchAll(/^\d+\.\s*(.+)$/gm)].map(m => m[1].trim());
    }
  });
  if (examenPreguntas.length === 0) {
    throw new Error("No se encontraron preguntas nuevas en la respuesta de la IA.");
  }
  return {
    preguntas: examenPreguntas.map((p, i) => ({ pregunta: p, respuesta: examenRespuestas[i] || "" })),
    tiempo_estimado_min: tiempoEstimado
  };
}

// Parsea la lista de sesiones del curso, formato "N | Tema" una por línea.
export function parsearListaSesiones(texto) {
  const lineas = texto.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const sesiones = [];
  const regex = /^(?:sesi[oó]n\s*)?(\d+)\s*[\|:]\s*(.+)$/i;
  lineas.forEach(linea => {
    const m = linea.match(regex);
    if (m) sesiones.push({ numero: m[1], tema: m[2].trim() });
  });
  return sesiones;
}

// Parsea la corrección del examen devuelta por la IA (===CORRECCION N=== ... ===FIN===).
export function parsearCorrecciones(texto) {
  const resultados = [];
  const partes = texto.split(/===CORRECCION\s*(\d+)===/i);
  for (let i = 1; i < partes.length; i += 2) {
    const num = parseInt(partes[i], 10);
    let bloque = partes[i + 1] || "";
    const finIdx = bloque.indexOf("===FIN===");
    if (finIdx !== -1) bloque = bloque.slice(0, finIdx);
    const veredictoMatch = bloque.match(/VEREDICTO:\s*(.+)/i);
    const comentarioMatch = bloque.match(/COMENTARIO:\s*([\s\S]*)/i);
    resultados[num - 1] = {
      veredicto: veredictoMatch ? veredictoMatch[1].trim() : "?",
      comentario: comentarioMatch ? comentarioMatch[1].trim() : ""
    };
  }
  return resultados;
}
