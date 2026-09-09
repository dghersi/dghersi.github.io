import { db, doc, setDoc, getDocs, collection } from "../SetupJs/firebase-cliente.js";
import { obtenerCarpetaBiblioteca, subirArchivoADrive } from "../SetupJs/drive.js";
import { mostrarEstadoFooter } from "./estado.js";

// ==========================================
// ORQUESTADOR — pestaña "Reproductor (PPT)"
// ==========================================
export function initReproductorPPT() {
  document.querySelector('[data-tab="reproductor-ppt"]').addEventListener("click", poblarListaBiblioteca);
  document.getElementById("btnSubirPPT").addEventListener("click", subirPPT);
  document.getElementById("selectBibliotecaPPT").addEventListener("change", mostrarPreviewPPT);
}

// ---------- Biblioteca (Firestore + Drive) ----------
async function poblarListaBiblioteca() {
  const select = document.getElementById("selectBibliotecaPPT");
  select.innerHTML = '<option value="">Cargando…</option>';
  const snap = await getDocs(collection(db, "biblioteca_ppt"));
  const archivos = [];
  snap.forEach(d => archivos.push({ id: d.id, ...d.data() }));
  archivos.sort((a, b) => (b.fecha_subida || "").localeCompare(a.fecha_subida || ""));
  select.innerHTML = '<option value="">— Selecciona un archivo —</option>';
  archivos.forEach(a => {
    const opt = document.createElement("option");
    opt.value = a.drive_file_id;
    opt.textContent = a.nombre;
    select.appendChild(opt);
  });
}

async function subirPPT() {
  const input = document.getElementById("archivoPPT");
  const msg = document.getElementById("msgReproductorPPT");
  if (!input.files[0]) { msg.textContent = "Elige un archivo primero."; msg.className = "msg error"; return; }
  const archivo = input.files[0];
  const btn = document.getElementById("btnSubirPPT");
  btn.disabled = true;
  msg.textContent = "Subiendo…"; msg.className = "msg";
  mostrarEstadoFooter("Subiendo archivo a la biblioteca…");
  try {
    const folderId = await obtenerCarpetaBiblioteca();
    const fileId = await subirArchivoADrive(archivo.name, archivo, archivo.type || "application/octet-stream", folderId);
    await setDoc(doc(db, "biblioteca_ppt", fileId), {
      nombre: archivo.name,
      drive_file_id: fileId,
      mimeType: archivo.type || "",
      fecha_subida: new Date().toISOString()
    });
    msg.textContent = "✓ Subido a la biblioteca."; msg.className = "msg ok";
    mostrarEstadoFooter("Archivo subido a la biblioteca");
    input.value = "";
    poblarListaBiblioteca();
  } catch (err) {
    msg.textContent = "Error: " + err.message; msg.className = "msg error";
    mostrarEstadoFooter("Error al subir archivo");
  } finally {
    btn.disabled = false;
  }
}

// ---------- Vista previa (iframe nativo de Drive, sin parsear el archivo) ----------
function mostrarPreviewPPT(e) {
  const fileId = e.target.value;
  const iframe = document.getElementById("iframePPT");
  if (!fileId) { iframe.src = ""; iframe.style.display = "none"; return; }
  iframe.src = `https://drive.google.com/file/d/${fileId}/preview`;
  iframe.style.display = "block";
}
