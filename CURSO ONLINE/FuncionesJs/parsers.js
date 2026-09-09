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
      const resto = header.replace(/^Diapositiva\s*\d*:?\s*/i, "").trim();
      const topicoMatch = resto.match(/^\[(.+?)\]\s*(.*)$/);
      const topico = topicoMatch ? topicoMatch[1].trim() : resto;
      const titulo = topicoMatch ? topicoMatch[2].trim() : resto;
      let contenido = cuerpo, svg = "", imagen = "", modelo, modo;
      const metaMatch = contenido.match(/^<!--\s*gen:\s*modelo=(\S+)\s+modo=(\S+)\s*-->\n?/i);
      if (metaMatch) {
        modelo = metaMatch[1]; modo = metaMatch[2];
        contenido = contenido.replace(metaMatch[0], "");
      }
      const svgMatch = contenido.match(/```svg\s*([\s\S]*?)```/i);
      if (svgMatch) {
        svg = svgMatch[1].trim();
        contenido = contenido.replace(svgMatch[0], "").trim();
      }
      const imagenMatch = contenido.match(/```imagen\s*([\s\S]*?)```/i);
      if (imagenMatch) {
        imagen = imagenMatch[1].trim();
        contenido = contenido.replace(imagenMatch[0], "").trim();
      }
      diapositivas.push({ titulo, topico, contenido: contenido.trim(), svg, imagen, ...(modelo && { modelo, modo }) });
    } else if (/^Problema/i.test(header)) {
      let svg = "", imagen = "";
      let cuerpoLimpio = cuerpo;
      const svgMatchProb = cuerpo.match(/```svg\s*([\s\S]*?)```/i);
      if (svgMatchProb) {
        svg = svgMatchProb[1].trim();
        cuerpoLimpio = cuerpo.replace(svgMatchProb[0], "");
      }
      const imagenMatchProb = cuerpoLimpio.match(/```imagen\s*([\s\S]*?)```/i);
      if (imagenMatchProb) {
        imagen = imagenMatchProb[1].trim();
        cuerpoLimpio = cuerpoLimpio.replace(imagenMatchProb[0], "");
      }
      problemas.push({
        enunciado: extraerCampoMd(cuerpoLimpio, "Enunciado", ["Solución", "Solucion"]),
        solucion: extraerCampoMd(cuerpoLimpio, "Soluci[oó]n", []),
        svg, imagen
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

// Parsea el resultado de desarrollar UN tópico puntual (una o más
// "## Diapositiva N: título" seguidas, todas sobre ese tópico). La metadata de
// modelo/modo se agrega después en el código, no la genera la IA.
export function parsearDiapositivasSolo(texto) {
  const diapositivas = [];
  const secciones = texto.split(/\n(?=##\s)/);
  secciones.forEach(sec => {
    const headerMatch = sec.match(/^##\s*(.+)/);
    if (!headerMatch) return;
    const header = headerMatch[1].trim();
    if (!/^Diapositiva/i.test(header)) return;
    const cuerpo = sec.replace(/^##.*\n?/, "");
    const titulo = header.replace(/^Diapositiva\s*\d*:?\s*/i, "").trim();
    let contenido = cuerpo, svg = "";
    const svgMatch = cuerpo.match(/```svg\s*([\s\S]*?)```/i);
    if (svgMatch) {
      svg = svgMatch[1].trim();
      contenido = cuerpo.replace(svgMatch[0], "").trim();
    }
    diapositivas.push({ titulo, contenido: contenido.trim(), svg });
  });
  if (diapositivas.length === 0) {
    throw new Error("No se encontraron diapositivas nuevas en la respuesta de la IA.");
  }
  return diapositivas;
}

// Serializa {diapositivas, problemas, codigo, examen} de vuelta a Markdown,
// con el mismo formato que parsearMarkdown espera leer. Se usa para reconstruir
// el archivo completo en Drive después de regenerar solo el bloque de teoría.
export function reconstruirMarkdown(contenido) {
  const partes = [];
  (contenido.diapositivas || []).forEach((d, i) => {
    partes.push(
      `## Diapositiva ${i + 1}: [${d.topico || d.titulo}] ${d.titulo}\n` +
      (d.modelo && d.modo ? `<!-- gen: modelo=${d.modelo} modo=${d.modo} -->\n` : "") +
      `${d.contenido}` +
      (d.svg ? `\n\n\`\`\`svg\n${d.svg}\n\`\`\`` : "") +
      (d.imagen ? `\n\n\`\`\`imagen\n${d.imagen}\n\`\`\`` : "")
    );
  });
  (contenido.problemas || []).forEach((p, i) => {
    partes.push(
      `## Problema ${i + 1}\n\n**Enunciado:**\n${p.enunciado}` +
      (p.svg ? `\n\n\`\`\`svg\n${p.svg}\n\`\`\`` : "") +
      (p.imagen ? `\n\n\`\`\`imagen\n${p.imagen}\n\`\`\`` : "") +
      `\n\n**Solución:**\n${p.solucion}`
    );
  });
  (contenido.codigo || []).forEach(c => {
    partes.push(`## Código: ${c.problema_ref}\n\`\`\`\n${c.codigo}\n\`\`\``);
  });
  if (contenido.examen) {
    const preguntasTxt = contenido.examen.preguntas.map((p, i) => `${i + 1}. ${p.pregunta}`).join("\n");
    const respuestasTxt = contenido.examen.preguntas.map((p, i) => `${i + 1}. ${p.respuesta}`).join("\n");
    partes.push(`## Examen de práctica\n**Tiempo estimado:** ${contenido.examen.tiempo_estimado_min || "?"} minutos\n\n${preguntasTxt}`);
    partes.push(`## Clave de respuestas\n${respuestasTxt}`);
  }
  return partes.join("\n\n");
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
