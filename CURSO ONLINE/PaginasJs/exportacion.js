import { db, doc, getDoc, getDocs, collection, poblarSelectCursos } from "../SetupJs/firebase-cliente.js";
import { leerArchivoDrive } from "../SetupJs/drive.js";
import { mostrarEstadoFooter } from "./estado.js";

// ==========================================
// ORQUESTADOR — pestaña "Exportación"
// ==========================================
export function initExportacion() {
  poblarSelectCursos(document.getElementById("selectCursoExportar"));

  document.getElementById("selectCursoExportar").addEventListener("change", onCambioCursoExportar);
  document.getElementById("modoExportar").addEventListener("change", actualizarVisibilidadSesionExportar);
  document.getElementById("btnDescargarMd").addEventListener("click", descargarMarkdown);
  document.getElementById("btnGenerarPrompt").addEventListener("click", generarPromptDiapositivas);
  document.getElementById("btnCopiarPrompt").addEventListener("click", () => {
    const area = document.getElementById("resultadoPrompt");
    navigator.clipboard.writeText(area.value).then(() => {
      mostrarEstadoFooter("Prompt copiado al portapapeles");
    });
  });
}

function actualizarVisibilidadSesionExportar() {
  const especifica = document.getElementById("modoExportar").value === "una";
  document.getElementById("selectSesionExportar").style.display = especifica ? "block" : "none";
}

async function onCambioCursoExportar(e) {
  const slug = e.target.value;
  const selectSesion = document.getElementById("selectSesionExportar");
  if (!slug) { selectSesion.innerHTML = ""; return; }
  const snap = await getDocs(collection(db, "cursos", slug, "sesiones"));
  selectSesion.innerHTML = "";
  const nums = [];
  snap.forEach(d => nums.push(d.id.replace("sesion_", "")));
  nums.sort((a, b) => Number(a) - Number(b));
  nums.forEach(n => {
    const opt = document.createElement("option");
    opt.value = n; opt.textContent = "Sesión " + n;
    selectSesion.appendChild(opt);
  });
}

// ---------- Lógica: recopilar el Markdown de una o todas las sesiones ----------
async function recopilarMarkdown(slug) {
  const modo = document.getElementById("modoExportar").value;
  const cursoSnap = await getDoc(doc(db, "cursos", slug));
  const curso = cursoSnap.exists() ? cursoSnap.data() : {};

  let numeros = [];
  if (modo === "una") {
    numeros = [document.getElementById("selectSesionExportar").value];
  } else {
    const snap = await getDocs(collection(db, "cursos", slug, "sesiones"));
    snap.forEach(d => numeros.push(d.id.replace("sesion_", "")));
    numeros.sort((a, b) => Number(a) - Number(b));
  }

  let resultado = `# ${curso.nombre_curso || slug}\n`;
  for (const n of numeros) {
    if (!n) continue;
    const sesionSnap = await getDoc(doc(db, "cursos", slug, "sesiones", "sesion_" + n));
    if (!sesionSnap.exists() || !sesionSnap.data().drive_file_id) continue;
    const md = await leerArchivoDrive(sesionSnap.data().drive_file_id);
    resultado += `\n\n---\n\n# Sesión ${n}\n\n${md}`;
  }
  return { curso, markdown: resultado };
}

async function descargarMarkdown() {
  const slug = document.getElementById("selectCursoExportar").value;
  if (!slug) { alert("Selecciona un curso."); return; }
  mostrarEstadoFooter("Preparando descarga…");
  try {
    const { markdown } = await recopilarMarkdown(slug);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const modo = document.getElementById("modoExportar").value;
    const sesionTag = modo === "una" ? `_sesion${document.getElementById("selectSesionExportar").value}` : "_completo";
    a.href = url;
    a.download = `${slug}${sesionTag}.md`;
    a.click();
    URL.revokeObjectURL(url);
    mostrarEstadoFooter("Markdown descargado");
  } catch (err) {
    alert("Error: " + err.message);
    mostrarEstadoFooter("Error al descargar");
  }
}

// Quita bloques de imagen/SVG en base64 y metadata interna antes de mandar el
// contenido a una herramienta externa — esas herramientas deben decidir sus
// propias imágenes, no recibir las nuestras (y son gigantes en base64).
function limpiarMarkdownParaPrompt(markdown) {
  let limpio = markdown.replace(/<!--\s*gen:[^>]*-->\n?/gi, "");
  limpio = limpio.replace(/```imagen\s*[\s\S]*?```/gi, "*(sugerencia: incluye aquí una imagen o diagrama ilustrativo)*");
  limpio = limpio.replace(/```svg\s*[\s\S]*?```/gi, "*(sugerencia: incluye aquí un diagrama ilustrativo)*");
  return limpio;
}

// ---------- Prompt para herramientas de diapositivas (Gamma, Kimi, Claude, Gemini) ----------
async function generarPromptDiapositivas() {
  const slug = document.getElementById("selectCursoExportar").value;
  if (!slug) { alert("Selecciona un curso."); return; }
  mostrarEstadoFooter("Preparando prompt…");
  try {
    const { curso, markdown } = await recopilarMarkdown(slug);
    const markdownLimpio = limpiarMarkdownParaPrompt(markdown);
    const prompt = `Convierte el siguiente contenido de curso en una presentación de diapositivas visualmente atractiva y clara.

Instrucciones:
- Una diapositiva por concepto o subtema clave (no metas todo el contenido de un tópico en una sola diapositiva).
- Donde el texto sugiera una imagen o diagrama, elige tú la imagen/ilustración que mejor represente ese concepto — el contenido no trae imágenes propias, decide libremente el estilo visual.
- Mantén las fórmulas matemáticas en formato legible (usa notación matemática real, no texto plano).
- Para los problemas, dedica una diapositiva al enunciado y otra(s) a la solución paso a paso.
- Diseño limpio, profesional, con buen contraste de color.
- Idioma: ${curso.idioma || "Español"}.

Curso: ${curso.nombre_curso || slug}

Contenido completo:
"""
${markdownLimpio}
"""`;
    document.getElementById("resultadoPrompt").value = prompt;
    document.getElementById("bloqueResultadoPrompt").style.display = "block";
    mostrarEstadoFooter("Prompt generado — cópialo y pégalo en Gamma, Kimi, Claude o Gemini");
  } catch (err) {
    alert("Error: " + err.message);
    mostrarEstadoFooter("Error al generar el prompt");
  }
}
