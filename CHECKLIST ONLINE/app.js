// app.js - Orquestador Principal de la PWA (ES6 Module)
import { UNIVERSAL_ASSETS } from './Data/Universal/universal.js';
import { minicargadorData } from './Data/Minicargador/minicargador.js';

let currentBloqueIndex = 0;
let userAnswers = {};
let selectedFrecuencia = "DIARIO";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Registro del Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker Activo. Alcance:', reg.scope))
      .catch(err => console.warn('Error registrando Service Worker:', err));
  }

  // 2. Inicializar Módulos de Plugins (Firma y GPS)
  if (window.initSignatureModule) window.initSignatureModule();
  if (window.initGPSModule) window.initGPSModule();

  // 3. Configurar Switches de Frecuencia
  const frecBtns = document.querySelectorAll("#frecuencia-switches .switch-btn");
  frecBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      frecBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedFrecuencia = e.target.getAttribute("data-frec");
    });
  });

  // 4. Configurar Selector Dinámico de Maquinaria
  const selectMaq = document.getElementById("select-maquinaria");
  if (selectMaq) {
    selectMaq.innerHTML = `<option value="Minicargador">Minicargador (SSL / CTL)</option>`;
  }

  // 5. Cargar Bloque Inicial de la Matriz
  renderCurrentBloque();

  // 6. Asignar Eventos a Modales con Renderizado Dinámico
  document.getElementById("btn-open-ilustracion").onclick = () => {
    renderModalIlustracion();
    openModal("modal-ilustracion");
  };

  document.getElementById("btn-open-buenas-practicas").onclick = () => {
    renderModalBuenasPracticas();
    openModal("modal-buenas-practicas");
  };

  document.getElementById("btn-open-hallazgos").onclick = () => {
    openModal("modal-hallazgos");
  };

  // 7. Botones de Exportación y Guardado
  document.getElementById("btn-export-pdf").onclick = handleExportPDF;
  document.getElementById("btn-save-online").onclick = handleSaveOnline;
});

// ==========================================
// RENDERING DE MODALES Y ASSETS DINÁMICOS
// ==========================================

// Renderiza Anatomía y Zonificación
function renderModalIlustracion() {
  const container = document.getElementById("modal-ilustracion-content");
  if (!container) return;

  const assets = minicargadorData.assets || {};

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h4 style="font-size: 14px; color: #1B2631; font-weight: bold; margin-bottom: 8px;">ANATOMÍA DEL EQUIPO</h4>
      <img src="${assets.anatomiaUrl}" alt="Anatomía" style="width: 100%; max-width: 454px; height: auto; border-radius: 6px; border: 1px solid #ddd;">
    </div>
    
    <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 15px 0;">
    
    <div style="text-align: center;">
      <h4 style="font-size: 14px; color: #1B2631; font-weight: bold; margin-bottom: 8px;">ZONAS DE SEGURIDAD</h4>
      <img src="${assets.zonificacionUrl}" alt="Zonificación" style="width: 100%; max-width: 600px; height: auto; border-radius: 6px; border: 1px solid #ddd;">
    </div>
  `;
}

// Renderiza Viñetas de Buenas Prácticas (6 Viñetas)
function renderModalBuenasPracticas() {
  const container = document.getElementById("modal-buenas-practicas-body");
  if (!container) return;

  const viñetas = minicargadorData.assets?.buenasPracticas || [];

  container.innerHTML = viñetas.map((url, index) => `
    <div style="margin-bottom: 12px; text-align: center;">
      <img src="${url}" alt="Buena Práctica ${index + 1}" style="width: 100%; max-width: 400px; height: auto; border-radius: 6px; border: 1px solid #ddd;">
    </div>
  `).join('');
}

// ==========================================
// RENDERING DE BLOQUES (CARROUSEL MÓVIL)
// ==========================================

function renderCurrentBloque() {
  const container = document.getElementById("checklist-app-container");
  if (!container) return;

  const bloques = minicargadorData.bloques || [];
  const totalBloques = bloques.length;

  if (currentBloqueIndex >= totalBloques) {
    container.innerHTML = `
      <div class="bloque-card" style="text-align:center; padding: 20px;">
        <h3 style="color:#2ECC71;">✅ INSPECCIÓN DE BLOQUES COMPLETADA</h3>
        <p style="font-size:12px; margin-top:5px;">Revise los hallazgos y firme el formulario para finalizar.</p>
      </div>`;
    return;
  }

  const bloque = bloques[currentBloqueIndex];

  let itemsHtml = bloque.items.map(item => {
    const key = item.n;
    const currentVal = userAnswers[key] ? userAnswers[key].val : '';

    // Si el ítem corresponde a Emergencias (Extintor/Botiquín), inyectamos la imagen preview
    let imgPreviewHtml = '';
    if (item.t.toLowerCase().includes('extintor')) {
      imgPreviewHtml = `<div style="text-align:center; margin: 8px 0;"><img src="${UNIVERSAL_ASSETS.extintorUrl}" alt="Extintor" style="max-width:180px; height:auto; border-radius:4px;"></div>`;
    } else if (item.t.toLowerCase().includes('botiquín') || item.t.toLowerCase().includes('botiquin')) {
      imgPreviewHtml = `<div style="text-align:center; margin: 8px 0;"><img src="${UNIVERSAL_ASSETS.botiquinUrl}" alt="Botiquín" style="max-width:180px; height:auto; border-radius:4px;"></div>`;
    }

    return `
      <div class="item-container">
        <div class="item-info">
          <span class="item-num">Ítem ${item.n} (${item.c})</span>
          <p class="item-desc">${item.t}</p>
          ${imgPreviewHtml}
          <p class="item-risk">Riesgo: ${item.r}</p>
        </div>
        <div class="touch-options">
          <button class="touch-btn ${currentVal === 'SI' ? 'active-SI' : ''}" onclick="setAnswer('${key}', 'SI', '${item.c}', '${item.r}', '${item.a}')">CONFORME [✓]</button>
          <button class="touch-btn ${currentVal === 'NO' ? 'active-NO' : ''}" onclick="setAnswer('${key}', 'NO', '${item.c}', '${item.r}', '${item.a}')">FALLA [X]</button>
          <button class="touch-btn ${currentVal === 'NA' ? 'active-NA' : ''}" onclick="setAnswer('${key}', 'NA', '${item.c}', '${item.r}', '${item.a}')">N / A</button>
        </div>
      </div>`;
  }).join('');

  container.innerHTML = `
    <div class="bloque-card">
      <div class="bloque-header">
        <span>BLOQUE ${currentBloqueIndex + 1} DE ${totalBloques}: ${bloque.bloque}</span>
      </div>
      ${itemsHtml}
      <div style="display:flex; justify-content:space-between; margin-top:12px;">
        <button class="action-btn" onclick="changeBloque(-1)" ${currentBloqueIndex === 0 ? 'disabled' : ''}>Anterior</button>
        <button class="action-btn" onclick="changeBloque(1)">Siguiente Bloque ➔</button>
      </div>
    </div>`;
}

// Funciones expuestas a window para respuestas touch en HTML dinámico
window.setAnswer = function(key, val, crit, risk, action) {
  userAnswers[key] = { key: key, val: val, crit: crit, r: risk, a: action };
  updateHallazgosUI();
  renderCurrentBloque();
};

window.changeBloque = function(dir) {
  currentBloqueIndex += dir;
  renderCurrentBloque();
};

function updateHallazgosUI() {
  const hallazgosList = document.getElementById("hallazgos-list");
  const countElem = document.getElementById("hallazgos-count");

  const fails = Object.values(userAnswers).filter(a => a.val === "NO");
  if (countElem) countElem.innerText = fails.length;

  if (hallazgosList) {
    if (fails.length === 0) {
      hallazgosList.innerHTML = "<p>No se registran fallas hasta el momento.</p>";
    } else {
      hallazgosList.innerHTML = fails.map(f => `
        <div style="padding: 6px; border-bottom: 1px solid #EAECEE;">
          <b style="color:#E74C3C;">Ítem ${f.key} (${f.crit}):</b> ${f.r}<br>
          <i>Acción Obligatoria: ${f.a}</i>
        </div>
      `).join('');
    }
  }
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add("active");
}

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
};

function handleExportPDF() {
  const payload = collectPayload();
  if (window.exportPDFReport) window.exportPDFReport(payload);
}

function handleSaveOnline() {
  const payload = collectPayload();
  if (window.db) {
    window.db.collection("checklists").add(payload)
      .then(() => alert("✅ Checklist guardado en Firestore con éxito."))
      .catch((err) => {
        console.warn("Modo Offline: Guardando en LocalStorage.", err);
        localStorage.setItem(`chk_${Date.now()}`, JSON.stringify(payload));
        alert("💾 Sin red. Guardado localmente en el teléfono.");
      });
  }
}

function collectPayload() {
  const lotoEval = window.evaluateLoto ? window.evaluateLoto(userAnswers) : { isLoto: false };

  return {
    tipoMaquinaria: document.getElementById("select-maquinaria").value || "Minicargador",
    frecuencia: selectedFrecuencia,
    operador: document.getElementById("inp-operador").value || "S/N",
    licencia: document.getElementById("inp-licencia").value || "S/N",
    frente: document.getElementById("inp-frente").value || "S/N",
    horometro: document.getElementById("inp-horometro").value || "0",
    codigoEquipo: document.getElementById("inp-codigo").value || "MIN-001",
    marcaModelo: document.getElementById("inp-marca").value || "S/N",
    reporteActoCondicion: document.getElementById("inp-acto-condicion").value || "",
    fechaHora: new Date().toISOString(),
    gps: document.getElementById("gps-coords") ? document.getElementById("gps-coords").innerText : "",
    respuestas: userAnswers,
    isLoto: lotoEval.isLoto,
    estadoOperativo: lotoEval.isLoto ? "EQUIPO NO OPERATIVO (LOTO)" : "EQUIPO APTO"
  };
}