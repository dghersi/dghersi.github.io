import { db, doc, setDoc, getDoc, poblarSelectCursos } from "../SetupJs/firebase-cliente.js";
import { iniciarTokenClient, solicitarAccesoDrive, guardarSesionEnDrive } from "../SetupJs/drive.js";
import { llamarIA, obtenerUltimoProveedor } from "../SetupJs/ia-cliente.js";
import { construirPrompt } from "../FuncionesJs/prompts.js";
import { parsearListaSesiones } from "../FuncionesJs/parsers.js";
import { mostrarEstadoFooter, actualizarPillDrive, actualizarPillIA } from "./estado.js";

// ==========================================
// ORQUESTADOR — pestaña "Crear Curso"
// ==========================================
export function initCrearCurso() {
  initConexionDrive();
  initClavesIA();
  initFormularioCurso();
  initGenerarSesion();
  initGenerarTodas();
}

// ---------- Conexión con Google Drive ----------
function initConexionDrive() {
  const driveClientIdInput = document.getElementById("driveClientId");
  driveClientIdInput.value = localStorage.getItem("drive_client_id") || "";

  document.getElementById("btnConectarDrive").addEventListener("click", () => {
    const clientId = driveClientIdInput.value.trim();
    if (!clientId) { alert("Pega primero tu Client ID de OAuth."); return; }
    localStorage.setItem("drive_client_id", clientId);
    iniciarTokenClient(
      clientId,
      () => {
        document.getElementById("estadoDrive").textContent = "✓ Conectado a Google Drive.";
        document.getElementById("estadoDrive").className = "msg ok";
        actualizarPillDrive(true);
        mostrarEstadoFooter("Drive conectado");
      },
      (error) => {
        document.getElementById("estadoDrive").textContent = "Error al conectar: " + error;
        document.getElementById("estadoDrive").className = "msg error";
        actualizarPillDrive(false);
        mostrarEstadoFooter("Error al conectar con Drive");
      }
    );
    solicitarAccesoDrive();
  });
}

// ---------- Claves de los 3 proveedores de IA ----------
function initClavesIA() {
  const campos = {
    geminiApiKey: "gemini_api_key", geminiModelo: "gemini_modelo",
    groqApiKey: "groq_api_key", groqModelo: "groq_modelo",
    mistralApiKey: "mistral_api_key", mistralModelo: "mistral_modelo"
  };
  Object.entries(campos).forEach(([id, key]) => {
    document.getElementById(id).value = localStorage.getItem(key) || document.getElementById(id).value;
  });
  actualizarPillIA();
  document.getElementById("btnGuardarKey").addEventListener("click", () => {
    Object.entries(campos).forEach(([id, key]) => {
      localStorage.setItem(key, document.getElementById(id).value.trim());
    });
    const m = document.getElementById("msgKey");
    m.textContent = "✓ Guardado en este navegador.";
    m.className = "msg ok";
    actualizarPillIA();
    mostrarEstadoFooter("Claves de IA actualizadas");
  });
}

// ---------- Formulario de datos del curso ----------
function initFormularioCurso() {
  poblarSelectCursos(document.getElementById("selectEditar"), "— Crear curso nuevo —");
  poblarSelectCursos(document.getElementById("selectCursoGenerar"));
  poblarSelectCursos(document.getElementById("selectCursoGenerarTodas"));

  document.getElementById("selectEditar").addEventListener("change", async (e) => {
    const slug = e.target.value;
    const slugInput = document.getElementById("slug_curso");
    if (!slug) {
      ["nombre_curso", "rol_experto", "fuente_principal", "fuentes_complementarias", "notacion_especial", "lista_sesiones"]
        .forEach(id => document.getElementById(id).value = "");
      document.getElementById("software").value = "NINGUNO";
      document.getElementById("idioma").value = "Español";
      slugInput.value = ""; slugInput.disabled = false;
      return;
    }
    const snap = await getDoc(doc(db, "cursos", slug));
    if (!snap.exists()) return;
    const c = snap.data();
    document.getElementById("nombre_curso").value = c.nombre_curso || "";
    slugInput.value = slug; slugInput.disabled = true;
    document.getElementById("rol_experto").value = c.rol_experto || "";
    document.getElementById("fuente_principal").value = c.fuente_principal || "";
    document.getElementById("fuentes_complementarias").value = c.fuentes_complementarias || "";
    document.getElementById("software").value = c.software || "NINGUNO";
    document.getElementById("idioma").value = c.idioma || "Español";
    document.getElementById("notacion_especial").value = c.notacion_especial || "";
    document.getElementById("lista_sesiones").value = c.lista_sesiones || "";
  });

  document.getElementById("btnGuardarCurso").addEventListener("click", async () => {
    const msg = document.getElementById("msgCurso");
    const slug = document.getElementById("slug_curso").value.trim();
    const nombre = document.getElementById("nombre_curso").value.trim();
    if (!slug || !nombre || !document.getElementById("rol_experto").value.trim() || !document.getElementById("fuente_principal").value.trim()) {
      msg.textContent = "Completa los campos obligatorios (*)."; msg.className = "msg error"; return;
    }
    msg.textContent = "Guardando…"; msg.className = "msg";
    try {
      const existente = await getDoc(doc(db, "cursos", slug));
      const data = {
        nombre_curso: nombre,
        rol_experto: document.getElementById("rol_experto").value.trim(),
        fuente_principal: document.getElementById("fuente_principal").value.trim(),
        fuentes_complementarias: document.getElementById("fuentes_complementarias").value.trim(),
        software: document.getElementById("software").value.trim() || "NINGUNO",
        idioma: document.getElementById("idioma").value.trim() || "Español",
        notacion_especial: document.getElementById("notacion_especial").value.trim() || "estándar del campo",
        lista_sesiones: document.getElementById("lista_sesiones").value.trim(),
        fecha_actualizacion: new Date().toISOString(),
        fecha_creacion: existente.exists() ? existente.data().fecha_creacion : new Date().toISOString()
      };
      await setDoc(doc(db, "cursos", slug), data, { merge: true });
      msg.textContent = `✓ Curso "${nombre}" guardado.`; msg.className = "msg ok";
      mostrarEstadoFooter(`Curso "${nombre}" guardado`);
      poblarSelectCursos(document.getElementById("selectEditar"), "— Crear curso nuevo —");
      poblarSelectCursos(document.getElementById("selectCursoGenerar"));
      poblarSelectCursos(document.getElementById("selectCursoGenerarTodas"));
    } catch (err) {
      msg.textContent = "Error: " + err.message; msg.className = "msg error";
    }
  });
}

// ---------- Generar una sesión ----------
function initGenerarSesion() {
  document.getElementById("btnGenerar").addEventListener("click", async () => {
    const msg = document.getElementById("msgGenerar");
    const slug = document.getElementById("selectCursoGenerar").value;
    const numSesion = document.getElementById("numSesion").value;
    const tema = document.getElementById("temaSesion").value.trim();
    const modo = document.getElementById("modoGenerar").value;
    if (!slug || !numSesion || !tema) {
      msg.textContent = "Selecciona el curso, el número de sesión y pega el tema."; msg.className = "msg error"; return;
    }
    const btn = document.getElementById("btnGenerar");
    btn.disabled = true;
    msg.textContent = "Generando con IA… esto puede tardar 20-40 segundos."; msg.className = "msg";
    mostrarEstadoFooter(`Generando sesión ${numSesion}…`);
    try {
      const cursoSnap = await getDoc(doc(db, "cursos", slug));
      if (!cursoSnap.exists()) throw new Error("Curso no encontrado.");
      const curso = cursoSnap.data();
      const prompt = construirPrompt(curso, numSesion, tema, modo);
      const markdown = await llamarIA(prompt, (texto) => { msg.textContent = texto; });
      const refSesion = doc(db, "cursos", slug, "sesiones", "sesion_" + numSesion);
      const existente = await getDoc(refSesion);
      const fileIdExistente = existente.exists() ? existente.data().drive_file_id : null;
      const fileId = await guardarSesionEnDrive(slug, numSesion, markdown, fileIdExistente);
      await setDoc(refSesion, {
        drive_file_id: fileId,
        drive_file_name: `${slug}_sesion_${numSesion}.md`,
        tema, fecha_generacion: new Date().toISOString(),
        modelo_usado: obtenerUltimoProveedor() || "Auto",
        modo_generado: modo
      });
      msg.textContent = `✓ Sesión ${numSesion} generada y guardada en Drive. Ve a "Reproductor" para estudiarla.`;
      msg.className = "msg ok";
      mostrarEstadoFooter(`Sesión ${numSesion} generada`);
    } catch (err) {
      msg.textContent = "Error: " + err.message; msg.className = "msg error";
      mostrarEstadoFooter("Error al generar la sesión");
    } finally {
      btn.disabled = false;
    }
  });
}

// ---------- Generar todas las sesiones pendientes ----------
function initGenerarTodas() {
  let detenerLote = false;
  const logTodas = document.getElementById("logTodas");

  function logLinea(texto, tipo = "") {
    logTodas.style.display = "block";
    const p = document.createElement("div");
    p.textContent = texto;
    if (tipo === "ok") p.style.color = "var(--accent)";
    if (tipo === "error") p.style.color = "var(--danger)";
    logTodas.appendChild(p);
    logTodas.scrollTop = logTodas.scrollHeight;
  }

  document.getElementById("btnGenerarTodas").addEventListener("click", async () => {
    const slug = document.getElementById("selectCursoGenerarTodas").value;
    if (!slug) { alert("Selecciona un curso."); return; }
    const cursoSnap = await getDoc(doc(db, "cursos", slug));
    if (!cursoSnap.exists()) { alert("Curso no encontrado."); return; }
    const curso = cursoSnap.data();
    const sesiones = parsearListaSesiones(curso.lista_sesiones || "");
    if (sesiones.length === 0) {
      alert('No se encontró ninguna sesión en la lista. Revisa el formato "N | Tema" en la sección 1.');
      return;
    }
    const regenerar = document.getElementById("regenerarExistentes").checked;
    const modo = document.getElementById("modoGenerarTodas").value;
    logTodas.innerHTML = "";
    logTodas.style.display = "block";
    logLinea(`Encontradas ${sesiones.length} sesiones en la lista. Empezando…`);
    mostrarEstadoFooter(`Generando ${sesiones.length} sesiones…`);

    detenerLote = false;
    const btnGenerarTodas = document.getElementById("btnGenerarTodas");
    const btnDetener = document.getElementById("btnDetenerTodas");
    btnGenerarTodas.disabled = true;
    btnDetener.style.display = "inline-block";

    let generadas = 0, saltadas = 0, fallidas = 0;
    for (const s of sesiones) {
      if (detenerLote) { logLinea("Detenido por el usuario.", "error"); break; }
      const refSesion = doc(db, "cursos", slug, "sesiones", "sesion_" + s.numero);
      if (!regenerar) {
        const existe = await getDoc(refSesion);
        if (existe.exists()) {
          logLinea(`Sesión ${s.numero}: ya existe, se salta.`);
          saltadas++;
          continue;
        }
      }
      logLinea(`Sesión ${s.numero}: generando…`);
      try {
        const prompt = construirPrompt(curso, s.numero, s.tema, modo);
        const markdown = await llamarIA(prompt);
        const existePointer = await getDoc(refSesion);
        const fileIdExistente = (regenerar && existePointer.exists()) ? existePointer.data().drive_file_id : null;
        const fileIdFinal = await guardarSesionEnDrive(slug, s.numero, markdown, fileIdExistente);
        await setDoc(refSesion, {
          drive_file_id: fileIdFinal,
          drive_file_name: `${slug}_sesion_${s.numero}.md`,
          tema: s.tema, fecha_generacion: new Date().toISOString(),
          modelo_usado: obtenerUltimoProveedor() || "Auto",
          modo_generado: modo
        });
        logLinea(`Sesión ${s.numero}: ✓ generada.`, "ok");
        generadas++;
      } catch (err) {
        logLinea(`Sesión ${s.numero}: ✗ error — ${err.message}`, "error");
        fallidas++;
      }
      await new Promise(r => setTimeout(r, 4000)); // pausa entre llamadas para no saturar la API
    }
    logLinea(`Terminado. Generadas: ${generadas} — Saltadas: ${saltadas} — Con error: ${fallidas}.`);
    mostrarEstadoFooter(`Lote terminado: ${generadas} generadas, ${fallidas} con error`);
    btnGenerarTodas.disabled = false;
    btnDetener.style.display = "none";
  });

  document.getElementById("btnDetenerTodas").addEventListener("click", () => {
    detenerLote = true;
  });
}
