import { db, doc, setDoc, getDoc, getDocs, deleteDoc, collection, poblarSelectCursos } from "../SetupJs/firebase-cliente.js";
import { leerArchivoDrive, guardarSesionEnDrive } from "../SetupJs/drive.js";
import { llamarIA, obtenerUltimoProveedor } from "../SetupJs/ia-cliente.js";
import { parsearMarkdown, parsearCorrecciones, parsearExamenSolo, parsearDiapositivasSolo, reconstruirMarkdown } from "../FuncionesJs/parsers.js";
import { construirPromptCorreccion, construirPromptExamenNuevo, construirPromptTopico } from "../FuncionesJs/prompts.js";
import { formatearTexto } from "../FuncionesJs/formato.js";
import { mostrarEstadoFooter } from "./estado.js";

// ==========================================
// ESTADO DE LA SESIÓN ACTIVA (módulo)
// ==========================================
let slidesActuales = [];
let slideIdx = 0;
let progresoRef = null;
let cursoActivoSlug = "";
let sesionActivaNum = "";
let cursoActivo = null;
let temaActivo = "";
let driveFileIdActivo = null;
let modeloUsadoActivo = null;   // "Gemini" | "Groq" | "Mistral" | "Auto" | null (sesiones viejas)
let modoGeneradoActivo = null;  // "corto" | "largo" | "extenso" | null (sesiones viejas)
let examenGuardado = null;      // { respuestas: [], correccion: [] } | null

// ==========================================
// ORQUESTADOR — pestaña "Reproductor"
// ==========================================
export function initReproductor() {
  document.querySelector('[data-tab="reproductor"]').addEventListener("click", () => {
    poblarSelectCursos(document.getElementById("selectCursoJugar"));
  });

  document.getElementById("selectCursoJugar").addEventListener("change", onCambioCursoJugar);
  document.getElementById("btnCargarSesion").addEventListener("click", onCargarSesion);
  document.getElementById("btnAnterior").addEventListener("click", () => {
    if (slideIdx > 0) { slideIdx--; renderSlide(); }
  });
  document.getElementById("btnSiguiente").addEventListener("click", () => {
    if (slideIdx < slidesActuales.length - 1) { slideIdx++; renderSlide(); }
  });
  document.getElementById("btnReiniciar").addEventListener("click", async () => {
    if (!confirm("¿Reiniciar el progreso de esta sesión?")) return;
    await deleteDoc(progresoRef);
    slideIdx = 0;
    examenGuardado = null;
    actualizarResumenExamen();
    renderSlide();
  });
}

// ---------- Carga de curso / sesión ----------
async function onCambioCursoJugar(e) {
  const slug = e.target.value;
  const selectSesion = document.getElementById("selectSesionJugar");
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

async function onCargarSesion() {
  const msg = document.getElementById("msgReproductor");
  const slug = document.getElementById("selectCursoJugar").value;
  const num = document.getElementById("selectSesionJugar").value;
  if (!slug || !num) { msg.textContent = "Selecciona curso y sesión."; msg.className = "msg error"; return; }
  msg.textContent = "Cargando…"; msg.className = "msg";
  try {
    const cursoSnap = await getDoc(doc(db, "cursos", slug));
    if (!cursoSnap.exists()) throw new Error("Curso no encontrado.");
    cursoActivo = cursoSnap.data();

    const snap = await getDoc(doc(db, "cursos", slug, "sesiones", "sesion_" + num));
    if (!snap.exists()) throw new Error("Sesión no encontrada.");
    const sesionData = snap.data();
    const fileId = sesionData.drive_file_id;
    temaActivo = sesionData.tema || "";
    modeloUsadoActivo = sesionData.modelo_usado || null;
    modoGeneradoActivo = sesionData.modo_generado || null;
    driveFileIdActivo = fileId;
    if (!fileId) throw new Error("Esta sesión no tiene un archivo de Drive asociado (fue generada con una versión anterior de la app).");
    const markdown = await leerArchivoDrive(fileId);
    const contenido = parsearMarkdown(markdown);
    slidesActuales = construirSlides(contenido);
    cursoActivoSlug = slug; sesionActivaNum = num;
    progresoRef = doc(db, "progreso", `${slug}_sesion_${num}`);
    const progSnap = await getDoc(progresoRef);
    const progData = progSnap.exists() ? progSnap.data() : null;
    slideIdx = progData ? Math.min(progData.diapositiva_actual || 0, slidesActuales.length - 1) : 0;
    examenGuardado = (progData && progData.examen_respuestas && progData.examen_respuestas.length > 0)
      ? { respuestas: progData.examen_respuestas, correccion: progData.examen_correccion || [] }
      : null;
    document.getElementById("viewer").style.display = "block";
    msg.textContent = progData ? `Retomando desde donde quedaste (${new Date(progData.fecha_actualizacion).toLocaleString()}).` : "";
    msg.className = "msg ok";
    mostrarEstadoFooter(`Sesión ${num} cargada`);
    actualizarResumenExamen();
    renderSlide();
  } catch (err) {
    msg.textContent = "Error: " + err.message; msg.className = "msg error";
  }
}

// ---------- Funciones de lógica: armar / desarmar las diapositivas ----------
function construirSlides(contenido) {
  const slides = [];
  (contenido.diapositivas || []).forEach(d => slides.push({ tipo: "teoria", ...d }));
  (contenido.problemas || []).forEach((p, i) => slides.push({ tipo: "problema", numero: i + 1, ...p }));
  (contenido.codigo || []).forEach((c, i) => slides.push({ tipo: "codigo", numero: i + 1, ...c }));
  if (contenido.examen) {
    slides.push({ tipo: "examen", preguntas: contenido.examen.preguntas, tiempo: contenido.examen.tiempo_estimado_min });
    slides.push({ tipo: "clave", preguntas: contenido.examen.preguntas });
  }
  return slides;
}

// Reconstruye {problemas, codigo, examen} a partir del estado actual en memoria
// (para reconstruir el Markdown completo al regenerar solo la teoría).
function extraerRestoDelContenido() {
  const problemas = slidesActuales.filter(s => s.tipo === "problema").map(s => ({ enunciado: s.enunciado, solucion: s.solucion, svg: s.svg }));
  const codigo = slidesActuales.filter(s => s.tipo === "codigo").map(s => ({ problema_ref: s.problema_ref, codigo: s.codigo }));
  const examenSlide = slidesActuales.find(s => s.tipo === "examen");
  const examen = examenSlide ? { preguntas: examenSlide.preguntas, tiempo_estimado_min: examenSlide.tiempo } : null;
  return { problemas, codigo, examen };
}

// ---------- Orquestador de render: decide qué función de tipo llamar ----------
function renderSlide() {
  const s = slidesActuales[slideIdx];
  const kicker = document.getElementById("slideKicker");
  const title = document.getElementById("slideTitle");
  const body = document.getElementById("slideBody");
  const svgBox = document.getElementById("slideSvg");
  svgBox.innerHTML = "";
  const indicadoresPrevios = document.getElementById("slideIndicadores");
  if (indicadoresPrevios) indicadoresPrevios.remove();

  if (s.tipo === "teoria") renderTeoria(s, kicker, title, body, svgBox);
  else if (s.tipo === "problema") renderProblema(s, kicker, title, body, svgBox);
  else if (s.tipo === "codigo") renderCodigo(s, kicker, title, body);
  else if (s.tipo === "examen") renderExamen(s, kicker, title, body);
  else if (s.tipo === "clave") renderClave(s, kicker, title, body);

  document.getElementById("progressFill").style.width = `${((slideIdx + 1) / slidesActuales.length) * 100}%`;
  document.getElementById("btnAnterior").disabled = slideIdx === 0;
  document.getElementById("btnSiguiente").textContent = slideIdx === slidesActuales.length - 1 ? "Finalizar ✓" : "Siguiente →";
  if (window.MathJax) MathJax.typesetPromise([body]).catch(() => {});
  guardarProgreso();
}

// ---------- Funciones de renderizado, una por tipo de diapositiva ----------
function renderTeoria(s, kicker, title, body, svgBox) {
  kicker.textContent = "Teoría";
  title.textContent = s.titulo;
  body.innerHTML = formatearTexto(s.contenido);
  if (s.svg) svgBox.innerHTML = s.svg;
  renderIndicadoresDiapositiva(s);
}

// ---------- Indicadores de generación (Modelo/Modo) — por diapositiva/tópico ----------
function renderIndicadoresDiapositiva(s) {
  const viewer = document.getElementById("viewer");
  const cont = document.createElement("div");
  cont.className = "slide-indicadores";
  cont.id = "slideIndicadores";
  cont.innerHTML = `
    <label>Modelo
      <select id="selectModeloSlide">
        <option value="Auto">Auto</option>
        <option value="Gemini">Gemini</option>
        <option value="Groq">Groq</option>
        <option value="Mistral">Mistral</option>
      </select>
    </label>
    <label>Modo
      <select id="selectModoSlide">
        <option value="corto">Corto (1-2)</option>
        <option value="largo">Largo (3-5)</option>
        <option value="extenso">Extenso (6-8)</option>
      </select>
    </label>
    <button class="secondary" id="btnRegenerarTeoria" style="margin-top:0; padding:.15rem .5rem; font-size:.68rem;">Regenerar tópico</button>
  `;
  viewer.appendChild(cont);
  document.getElementById("selectModeloSlide").value = s.modelo || modeloUsadoActivo || "Auto";
  document.getElementById("selectModoSlide").value = s.modo || modoGeneradoActivo || "largo";
  document.getElementById("btnRegenerarTeoria").addEventListener("click", () => {
    const modelo = document.getElementById("selectModeloSlide").value;
    const modo = document.getElementById("selectModoSlide").value;
    regenerarTopico(modelo, modo);
  });
}

// Desarrolla en profundidad SOLO el tópico de la diapositiva actual, expandiéndolo
// a 1-8 diapositivas nuevas (reemplaza solo esa posición, el resto de topics y
// el resto de la sesión no se tocan), reconstruye el Markdown completo y lo sube a Drive.
async function regenerarTopico(modeloElegido, modoElegido) {
  const idxActual = slideIdx;
  const slideActual = slidesActuales[idxActual];
  if (!slideActual || slideActual.tipo !== "teoria") return;
  const cont = document.getElementById("slideIndicadores");
  if (cont) cont.style.opacity = ".5";
  mostrarEstadoFooter(`Regenerando tópico "${slideActual.titulo}" (${modoElegido})…`);
  try {
    const prompt = construirPromptTopico(cursoActivo, temaActivo, slideActual.titulo, modoElegido);
    const proveedorForzado = modeloElegido && modeloElegido !== "Auto" ? modeloElegido : undefined;
    const texto = await llamarIA(prompt, null, proveedorForzado);
    const nuevasDelTopico = parsearDiapositivasSolo(texto);
    const modeloReal = obtenerUltimoProveedor() || modeloElegido || "Auto";
    const nuevasConMeta = nuevasDelTopico.map(d => ({ tipo: "teoria", ...d, modelo: modeloReal, modo: modoElegido }));

    // Reemplaza SOLO esa diapositiva (ese tópico) por las nuevas, en su misma posición
    slidesActuales.splice(idxActual, 1, ...nuevasConMeta);

    // Reconstruye el Markdown completo con toda la teoría actual (topics viejos + nuevos) + el resto
    const todasLasDiapositivas = slidesActuales
      .filter(sl => sl.tipo === "teoria")
      .map(sl => ({ titulo: sl.titulo, contenido: sl.contenido, svg: sl.svg, modelo: sl.modelo, modo: sl.modo }));
    const resto = extraerRestoDelContenido();
    const contenidoCompleto = { diapositivas: todasLasDiapositivas, ...resto };
    const markdownNuevo = reconstruirMarkdown(contenidoCompleto);
    driveFileIdActivo = await guardarSesionEnDrive(cursoActivoSlug, sesionActivaNum, markdownNuevo, driveFileIdActivo);

    slideIdx = idxActual;
    mostrarEstadoFooter("Tópico regenerado y guardado en Drive");
    renderSlide();
  } catch (err) {
    alert("Error al regenerar el tópico: " + err.message);
    mostrarEstadoFooter("Error al regenerar tópico");
    if (cont) cont.style.opacity = "1";
  }
}

function renderProblema(s, kicker, title, body, svgBox) {
  kicker.textContent = "Problema " + s.numero;
  title.textContent = "Enunciado";
  body.innerHTML = formatearTexto(s.enunciado) + "<br><br><strong>— Solución —</strong><br>" + formatearTexto(s.solucion);
  if (s.svg) svgBox.innerHTML = s.svg;
}

function renderCodigo(s, kicker, title, body) {
  kicker.textContent = "Código " + s.numero;
  title.textContent = s.problema_ref || "";
  body.innerHTML = "";
  const pre = document.createElement("pre");
  pre.style.whiteSpace = "pre-wrap"; pre.style.fontFamily = "ui-monospace, monospace"; pre.style.fontSize = "0.82rem";
  pre.textContent = s.codigo;
  body.appendChild(pre);
}

function renderExamen(s, kicker, title, body) {
  kicker.textContent = "Examen de práctica";
  title.textContent = `Tiempo estimado: ${s.tiempo || "?"} min`;
  body.innerHTML = "";
  s.preguntas.forEach((p, i) => {
    const bloque = document.createElement("div");
    bloque.className = "pregunta-examen";
    const enunciado = document.createElement("div");
    enunciado.innerHTML = `<strong>${i + 1}.</strong> ${formatearTexto(p.pregunta)}`;
    const textarea = document.createElement("textarea");
    textarea.className = "respuesta-alumno";
    textarea.dataset.idx = i;
    textarea.placeholder = "Escribe tu respuesta aquí…";
    if (examenGuardado && examenGuardado.respuestas[i]) textarea.value = examenGuardado.respuestas[i];
    const feedback = document.createElement("div");
    feedback.className = "feedback-ia";
    feedback.id = "feedback-" + i;
    if (examenGuardado && examenGuardado.correccion[i]) {
      const c = examenGuardado.correccion[i];
      const clase = /^correcto/i.test(c.veredicto) ? "ok" : (/incorrecto/i.test(c.veredicto) ? "error" : "");
      feedback.innerHTML = `<p class="msg ${clase}"><strong>${c.veredicto}</strong> — ${formatearTexto(c.comentario)}</p>`;
    }
    bloque.appendChild(enunciado);
    bloque.appendChild(textarea);
    bloque.appendChild(feedback);
    body.appendChild(bloque);
  });

  const btnCorregir = document.createElement("button");
  btnCorregir.className = "primary";
  btnCorregir.textContent = examenGuardado ? "Volver a corregir" : "Corregir con IA";
  btnCorregir.addEventListener("click", () => corregirExamen(s.preguntas, btnCorregir));
  body.appendChild(btnCorregir);

  if (examenGuardado) {
    const btnReintentar = document.createElement("button");
    btnReintentar.className = "secondary";
    btnReintentar.textContent = "Reintentar (mismas preguntas)";
    btnReintentar.style.marginLeft = ".5rem";
    btnReintentar.addEventListener("click", () => { examenGuardado = null; actualizarResumenExamen(); renderSlide(); });
    body.appendChild(btnReintentar);
  }

  const btnNuevas = document.createElement("button");
  btnNuevas.className = "secondary";
  btnNuevas.textContent = "Generar preguntas nuevas";
  btnNuevas.style.marginLeft = ".5rem";
  btnNuevas.addEventListener("click", () => generarExamenNuevo(btnNuevas));
  body.appendChild(btnNuevas);
}

function renderClave(s, kicker, title, body) {
  kicker.textContent = "Clave de respuestas";
  title.textContent = "";
  body.innerHTML = formatearTexto(s.preguntas.map((p, i) => `${i + 1}. ${p.respuesta}`).join("\n\n"));
}

// ---------- Resumen del examen (sidebar derecho) ----------
function actualizarResumenExamen() {
  const el = document.getElementById("resumenExamen");
  if (!el) return;
  if (!examenGuardado || !examenGuardado.correccion || examenGuardado.correccion.length === 0) {
    el.textContent = "Aún no has corregido un examen en esta sesión.";
    return;
  }
  const total = examenGuardado.correccion.length;
  const correctas = examenGuardado.correccion.filter(c => /^correcto/i.test(c.veredicto)).length;
  const parciales = examenGuardado.correccion.filter(c => /parcialmente/i.test(c.veredicto)).length;
  const incorrectas = total - correctas - parciales;
  el.innerHTML = `
    <p class="msg ok">✓ Correctas: ${correctas} / ${total}</p>
    <p class="msg">△ Parciales: ${parciales} / ${total}</p>
    <p class="msg error">✗ Incorrectas: ${incorrectas} / ${total}</p>
  `;
}

// ---------- Corrección y regeneración del examen ----------
async function corregirExamen(preguntas, boton) {
  boton.disabled = true;
  const textoOriginal = boton.textContent;
  boton.textContent = "Corrigiendo…";
  mostrarEstadoFooter("Corrigiendo examen…");
  try {
    const respuestas = preguntas.map((_, i) => {
      const ta = document.querySelector(`.respuesta-alumno[data-idx="${i}"]`);
      return ta ? ta.value.trim() : "";
    });
    const prompt = construirPromptCorreccion(preguntas, respuestas);
    const textoCorreccion = await llamarIA(prompt);
    const correcciones = parsearCorrecciones(textoCorreccion);
    examenGuardado = { respuestas, correccion: correcciones };
    await setDoc(progresoRef, {
      examen_respuestas: respuestas,
      examen_correccion: correcciones,
      examen_fecha: new Date().toISOString()
    }, { merge: true });
    mostrarEstadoFooter("Examen corregido");
    actualizarResumenExamen();
    renderSlide();
  } catch (err) {
    alert("Error al corregir con IA: " + err.message);
    mostrarEstadoFooter("Error al corregir el examen");
  } finally {
    boton.disabled = false;
    boton.textContent = textoOriginal;
  }
}

async function generarExamenNuevo(boton) {
  boton.disabled = true;
  const original = boton.textContent;
  boton.textContent = "Generando…";
  mostrarEstadoFooter("Generando preguntas nuevas…");
  try {
    const prompt = construirPromptExamenNuevo(cursoActivo, temaActivo, 6);
    const texto = await llamarIA(prompt);
    const examenNuevo = parsearExamenSolo(texto);
    const idxExamen = slidesActuales.findIndex(sl => sl.tipo === "examen");
    const idxClave = slidesActuales.findIndex(sl => sl.tipo === "clave");
    if (idxExamen !== -1) slidesActuales[idxExamen] = { tipo: "examen", preguntas: examenNuevo.preguntas, tiempo: examenNuevo.tiempo_estimado_min };
    if (idxClave !== -1) slidesActuales[idxClave] = { tipo: "clave", preguntas: examenNuevo.preguntas };
    examenGuardado = null;
    await setDoc(progresoRef, { examen_respuestas: [], examen_correccion: [], examen_fecha: null }, { merge: true });
    actualizarResumenExamen();
    if (idxExamen !== -1) slideIdx = idxExamen;
    mostrarEstadoFooter("Preguntas nuevas generadas");
    renderSlide();
  } catch (err) {
    alert("Error al generar preguntas nuevas: " + err.message);
    mostrarEstadoFooter("Error al generar preguntas nuevas");
  } finally {
    boton.disabled = false;
    boton.textContent = original;
  }
}

// ---------- Progreso ----------
async function guardarProgreso() {
  const status = document.getElementById("statusSave");
  status.textContent = "Guardando…";
  try {
    await setDoc(progresoRef, {
      curso: cursoActivoSlug, sesion: sesionActivaNum,
      diapositiva_actual: slideIdx, total_diapositivas: slidesActuales.length,
      completado: slideIdx === slidesActuales.length - 1,
      fecha_actualizacion: new Date().toISOString()
    }, { merge: true });
    status.textContent = "Guardado ✓";
  } catch {
    status.textContent = "No se pudo guardar (revisa tu conexión).";
  }
}
