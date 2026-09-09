import { db, doc, setDoc, getDoc, getDocs, collection, poblarSelectCursos } from "../SetupJs/firebase-cliente.js";
import { leerArchivoDrive, guardarSesionEnDrive } from "../SetupJs/drive.js";
import { llamarIA } from "../SetupJs/ia-cliente.js";
import { generarImagen } from "../SetupJs/imagenes.js";
import { parsearMarkdown, reconstruirMarkdown } from "../FuncionesJs/parsers.js";
import { construirPromptDescripcionVisual } from "../FuncionesJs/prompts.js";
import { mostrarEstadoFooter } from "./estado.js";
import { mostrarImagenConZoom } from "./zoom.js";

// ==========================================
// ESTADO DE LA SESIÓN ACTIVA (módulo)
// ==========================================
let cursoActivo = null;
let slugActivo = "";
let numActivo = "";
let fileIdActivo = null;
let contenidoActivo = null; // {diapositivas, problemas, codigo, examen}

// ==========================================
// ORQUESTADOR — pestaña "Imágenes" (gestión por sesión)
// ==========================================
export function initGestionImagenes() {
  poblarSelectCursos(document.getElementById("selectCursoImagenes"));
  document.getElementById("selectCursoImagenes").addEventListener("change", onCambioCursoImagenes);
  document.getElementById("btnCargarSesionImagenes").addEventListener("click", onCargarSesionImagenes);
}

async function onCambioCursoImagenes(e) {
  const slug = e.target.value;
  const selectSesion = document.getElementById("selectSesionImagenes");
  if (!slug) { selectSesion.innerHTML = '<option value="">— Selecciona un curso primero —</option>'; return; }
  const snap = await getDocs(collection(db, "cursos", slug, "sesiones"));
  if (snap.empty) { selectSesion.innerHTML = '<option value="">Aún no hay sesiones generadas</option>'; return; }
  selectSesion.innerHTML = '<option value="">— Selecciona una sesión —</option>';
  const nums = [];
  snap.forEach(d => nums.push(d.id.replace("sesion_", "")));
  nums.sort((a, b) => Number(a) - Number(b));
  nums.forEach(n => {
    const opt = document.createElement("option");
    opt.value = n; opt.textContent = "Sesión " + n;
    selectSesion.appendChild(opt);
  });
}

async function onCargarSesionImagenes() {
  const msg = document.getElementById("msgGestionImagenes");
  const slug = document.getElementById("selectCursoImagenes").value;
  const num = document.getElementById("selectSesionImagenes").value;
  if (!slug || !num) { msg.textContent = "Selecciona curso y sesión."; msg.className = "msg error"; return; }
  msg.textContent = "Cargando…"; msg.className = "msg";
  try {
    const cursoSnap = await getDoc(doc(db, "cursos", slug));
    if (!cursoSnap.exists()) throw new Error("Curso no encontrado.");
    cursoActivo = cursoSnap.data();

    const sesionSnap = await getDoc(doc(db, "cursos", slug, "sesiones", "sesion_" + num));
    if (!sesionSnap.exists()) throw new Error("Sesión no encontrada.");
    const sesionData = sesionSnap.data();
    fileIdActivo = sesionData.drive_file_id;
    if (!fileIdActivo) throw new Error("Esta sesión no tiene archivo de Drive asociado.");

    const markdown = await leerArchivoDrive(fileIdActivo);
    contenidoActivo = parsearMarkdown(markdown);
    slugActivo = slug; numActivo = num;

    msg.textContent = "✓ Sesión cargada."; msg.className = "msg ok";
    mostrarEstadoFooter(`Imágenes: sesión ${num} cargada`);
    renderListaImagenes();
  } catch (err) {
    msg.textContent = "Error: " + err.message; msg.className = "msg error";
  }
}

// ---------- Lógica: agrupar diapositivas por tópico ----------
function topicosUnicos() {
  const vistos = new Set();
  const grupos = [];
  (contenidoActivo.diapositivas || []).forEach((d, idx) => {
    if (!vistos.has(d.topico)) {
      vistos.add(d.topico);
      grupos.push({ nombre: d.topico, idx });
    }
  });
  return grupos;
}

// ---------- Render de la lista ----------
function renderListaImagenes() {
  const cont = document.getElementById("listaImagenesGestion");
  cont.innerHTML = "";
  document.getElementById("bloqueListaImagenes").style.display = "block";

  topicosUnicos().forEach(g => {
    const representante = contenidoActivo.diapositivas[g.idx];
    const contexto = `${representante.titulo}. ${representante.contenido}`;
    cont.appendChild(crearFilaImagen(`Tópico: ${g.nombre}`, representante, contexto));
  });

  (contenidoActivo.problemas || []).forEach((p, idx) => {
    cont.appendChild(crearFilaImagen(`Problema ${idx + 1}`, p, p.enunciado));
  });
}

function crearFilaImagen(etiqueta, objetivo, contexto) {
  const fila = document.createElement("div");
  fila.className = "fila-imagen-gestion";

  const info = document.createElement("div");
  info.className = "fila-imagen-info";
  info.innerHTML = `<strong>${etiqueta}</strong>`;
  fila.appendChild(info);

  const preview = document.createElement("div");
  preview.className = "fila-imagen-preview";
  preview.tabIndex = 0;
  if (objetivo.imagen) {
    mostrarImagenConZoom(preview, objetivo.imagen);
  } else {
    preview.textContent = "Sin imagen — clic aquí y Ctrl+V";
    preview.classList.add("fila-imagen-preview-vacia");
  }
  preview.addEventListener("paste", (e) => manejarPegadoImagen(e, objetivo));
  fila.appendChild(preview);

  const acciones = document.createElement("div");
  acciones.className = "fila-imagen-acciones";

  const btnGenerar = document.createElement("button");
  btnGenerar.className = "secondary";
  btnGenerar.textContent = objetivo.imagen ? "🔄 Regenerar" : "🖼️ Generar";
  btnGenerar.addEventListener("click", () => generarImagenGestion(btnGenerar, objetivo, contexto));
  acciones.appendChild(btnGenerar);

  if (objetivo.imagen) {
    const btnQuitar = document.createElement("button");
    btnQuitar.className = "secondary";
    btnQuitar.textContent = "🗑️ Quitar";
    btnQuitar.style.marginLeft = ".4rem";
    btnQuitar.addEventListener("click", () => quitarImagenGestion(objetivo));
    acciones.appendChild(btnQuitar);
  }
  fila.appendChild(acciones);
  return fila;
}

// ---------- Guardado (reconstruye Markdown completo y sube a Drive) ----------
async function guardarContenidoActivo() {
  const markdownNuevo = reconstruirMarkdown(contenidoActivo);
  fileIdActivo = await guardarSesionEnDrive(slugActivo, cursoActivo.nombre_curso, numActivo, markdownNuevo, fileIdActivo);
  await setDoc(doc(db, "cursos", slugActivo, "sesiones", "sesion_" + numActivo), {
    drive_file_id: fileIdActivo
  }, { merge: true });
}

async function generarImagenGestion(boton, objetivo, contexto) {
  boton.disabled = true;
  const original = boton.textContent;
  boton.textContent = "Analizando…";
  mostrarEstadoFooter("Analizando contenido para la imagen…");
  try {
    const descripcion = await llamarIA(construirPromptDescripcionVisual(contexto));
    boton.textContent = "Generando…";
    const prompt = `Diagrama educativo simple, estilo ilustración vectorial minimalista, fondo blanco, colores suaves, formas geométricas simples e iconos claros. IMPORTANTE: no incluyas NINGÚN texto, letra, palabra, número ni etiqueta dentro de la imagen — solo elementos gráficos/visuales puros. ${descripcion}`;
    const { dataUrl, proveedor } = await generarImagen(prompt, (t) => mostrarEstadoFooter(t));
    objetivo.imagen = dataUrl;
    await guardarContenidoActivo();
    mostrarEstadoFooter(`Imagen generada con ${proveedor} y guardada`);
    renderListaImagenes();
  } catch (err) {
    alert("Error al generar imagen: " + err.message);
    mostrarEstadoFooter("Error al generar imagen");
  } finally {
    boton.disabled = false;
    boton.textContent = original;
  }
}

async function quitarImagenGestion(objetivo) {
  if (!confirm("¿Quitar esta imagen?")) return;
  objetivo.imagen = "";
  mostrarEstadoFooter("Quitando imagen…");
  try {
    await guardarContenidoActivo();
    mostrarEstadoFooter("Imagen quitada y guardado");
  } catch (err) {
    alert("Error al guardar: " + err.message);
    mostrarEstadoFooter("Error al quitar imagen");
  }
  renderListaImagenes();
}

// ---------- Pegar imagen (Ctrl+V) — desde el portapapeles como archivo o como URL ----------
function convertirArchivoADataUrl(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("No se pudo leer la imagen pegada."));
    reader.readAsDataURL(archivo);
  });
}

async function manejarPegadoImagen(e, objetivo) {
  const items = e.clipboardData?.items;
  let archivoImagen = null;
  if (items) {
    for (const item of items) {
      if (item.type.startsWith("image/")) { archivoImagen = item.getAsFile(); break; }
    }
  }
  e.preventDefault();
  try {
    let nuevaImagen;
    if (archivoImagen) {
      mostrarEstadoFooter("Pegando imagen…");
      nuevaImagen = await convertirArchivoADataUrl(archivoImagen);
    } else {
      const texto = (e.clipboardData?.getData("text/plain") || "").trim();
      if (/^https?:\/\//i.test(texto)) {
        nuevaImagen = texto;
      } else {
        mostrarEstadoFooter("El portapapeles no tiene una imagen ni una URL válida");
        return;
      }
    }
    objetivo.imagen = nuevaImagen;
    await guardarContenidoActivo();
    mostrarEstadoFooter("Imagen pegada y guardada");
    renderListaImagenes();
  } catch (err) {
    alert("Error al pegar imagen: " + err.message);
    mostrarEstadoFooter("Error al pegar imagen");
  }
}
