// Variable global para almacenar las respuestas del checklist
const answers = {};
let isLotoTriggered = false;
let photoBase64 = "";

// Carga e inicialización al cargar el DOM
window.addEventListener("DOMContentLoaded", () => {
  if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log('Service Worker Registrado con Éxito (Modo PWA Activo)'))
    .catch((err) => console.warn('Error al registrar Service Worker:', err));
  }

  // 1. Renderizar tarjetas con la data de Data/minicargador.js
  if (typeof minicargadorChecklist !== 'undefined') {
    renderChecklistCards(minicargadorChecklist);
  } else {
    console.error("No se encontró la matriz de datos en Data/minicargador.js");
  }

  // 2. Inicializar módulos de Core/Plugins.js
  if (typeof initSignatureModule === 'function') initSignatureModule();
  if (typeof initGPSModule === 'function') initGPSModule();

  // 3. Handlers para cámara y red
  initPhotoHandler();
  initNetworkListener();
});

// Renderizador Dinámico de Tarjetas Touch
function renderChecklistCards(data) {
  const container = document.getElementById("checklist-cards-container");
  if (!container) return;
  container.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = `card item-card crit-${item.c}`;
    card.innerHTML = `
      <div class="item-header">
        <span class="item-num">${item.n} - ${item.b}</span>
        <span class="item-crit ${item.c}">${item.c === "ALTO" ? "CRÍTICO (ALTO)" : "MEDIO"}</span>
      </div>
      <p class="item-desc">${item.t}</p>
      <div class="touch-options">
        <button type="button" class="touch-btn" id="btn-${item.n}-SI">CONFORME [✓]</button>
        <button type="button" class="touch-btn" id="btn-${item.n}-NO">FALLA [X]</button>
        <button type="button" class="touch-btn" id="btn-${item.n}-NA">N / A</button>
      </div>
    `;
    container.appendChild(card);

    // Binds para interacción táctil
    document.getElementById(`btn-${item.n}-SI`).onclick = (e) => setAnswer(item.n, "SI", item.c, e.target);
    document.getElementById(`btn-${item.n}-NO`).onclick = (e) => setAnswer(item.n, "NO", item.c, e.target);
    document.getElementById(`btn-${item.n}-NA`).onclick = (e) => setAnswer(item.n, "NA", item.c, e.target);
  });
}

// Gestor de Respuestas y Evaluación LOTO
function setAnswer(num, val, crit, btn) {
  answers[num] = { val, crit };

  // Feedback Visual Touch
  const parent = btn.parentElement;
  Array.from(parent.children).forEach(b => b.classList.remove("active-SI", "active-NO", "active-NA"));
  btn.classList.add(`active-${val}`);

  // Evaluación LOTO mediante Core/loto-engine.js
  if (typeof evaluateLoto === 'function') {
    isLotoTriggered = evaluateLoto(answers);
    
    const lotoBanner = document.getElementById("loto-banner");
    const photoSection = document.getElementById("photo-section");
    
    if (lotoBanner) lotoBanner.classList.toggle("hidden", !isLotoTriggered);
    if (photoSection) photoSection.classList.toggle("hidden", !isLotoTriggered);
  }

  updateProgress();
}

// Actualización de Barra de Progreso
function updateProgress() {
  const count = Object.keys(answers).length;
  const total = typeof minicargadorChecklist !== 'undefined' ? minicargadorChecklist.length : 27;
  const pct = Math.round((count / total) * 100);

  const pBar = document.getElementById("progress-bar");
  const pText = document.getElementById("progress-text");

  if (pBar) pBar.style.width = `${pct}%`;
  if (pText) pText.innerText = `Progreso: ${count}/${total} (${pct}%)`;
}

// Conversor de Foto de Evidencia a Base64
function initPhotoHandler() {
  const fileInput = document.getElementById("camera-input");
  if (!fileInput) return;

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        photoBase64 = event.target.result;
        const preview = document.getElementById("photo-preview");
        const container = document.getElementById("photo-preview-container");
        if (preview && container) {
          preview.src = photoBase64;
          container.classList.remove("hidden");
        }
      };
      reader.readAsDataURL(file);
    }
  });
}

// Detector de Estado de Red
function initNetworkListener() {
  window.addEventListener("online", updateNetBadge);
  window.addEventListener("offline", updateNetBadge);
}

function updateNetBadge() {
  const badge = document.getElementById("net-status");
  if (!badge) return;
  if (navigator.onLine) {
    badge.className = "status-badge online";
    badge.innerText = "📡 ONLINE";
  } else {
    badge.className = "status-badge offline";
    badge.innerText = "🔌 OFFLINE";
  }
}

// Evento Principal de Envío / Sincronización
document.getElementById("submit-btn").onclick = async () => {
  const totalItems = typeof minicargadorChecklist !== 'undefined' ? minicargadorChecklist.length : 27;
  if (Object.keys(answers).length < totalItems) {
    alert(`Has respondido ${Object.keys(answers).length} de ${totalItems} ítems. Por favor completa la inspección antes de enviar.`);
    return;
  }

  const payload = {
    tipoMaquinaria: document.getElementById("input-tipo-equipo").value,
    codigoEquipo: document.getElementById("input-codigo-equipo").value || "S/N",
    proyecto: document.getElementById("input-proyecto").value || "Sin Especificar",
    horometro: document.getElementById("input-horometro").value || "0",
    turno: document.getElementById("input-turno").value,
    operador: document.getElementById("input-operador").value || "Operador Anónimo",
    estadoOperativo: isLotoTriggered ? "NO APTO PARA OPERAR (BLOQUEO LOTO)" : "APTO PARA OPERAR",
    respuestas: answers,
    fotoEvidenciaBase64: isLotoTriggered ? photoBase64 : "",
    gps: document.getElementById("gps-coords").innerText,
    fechaHora: new Date().toISOString()
  };

  // Intentar sincronizar a Firestore (SetupJs/Firebase.js)
  if (typeof db !== 'undefined' && db !== null) {
    try {
      await db.collection("inspecciones").add(payload);
      alert(`✅ Inspección sincronizada en Firestore con éxito.\nEstado: ${payload.estadoOperativo}`);
    } catch (e) {
      alert(`⚠️ Sincronización guardada localmente (Offline).\nEstado: ${payload.estadoOperativo}`);
      saveLocalStorage(payload);
    }
  } else {
    alert(`📱 Guardado en memoria local del teléfono.\nEstado: ${payload.estadoOperativo}`);
    saveLocalStorage(payload);
  }

  // Generar PDF mediante Core/pdf-generator.js
  if (typeof exportPDFReport === 'function') {
    exportPDFReport(payload);
  }
};

function saveLocalStorage(data) {
  const list = JSON.parse(localStorage.getItem("checklists") || "[]");
  list.push(data);
  localStorage.setItem("checklists", JSON.stringify(list));
}