// app.js - Orquestador Principal de la PWA
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

  // 6. Asignar Modales
  document.getElementById("btn-open-ilustracion").onclick = () => openModal("modal-ilustracion");
  document.getElementById("btn-open-buenas-practicas").onclick = () => openModal("modal-buenas-practicas");
  document.getElementById("btn-open-hallazgos").onclick = () => openModal("modal-hallazgos");

  // 7. Botones de Exportación y Guardado
  document.getElementById("btn-export-pdf").onclick = handleExportPDF;
  document.getElementById("btn-save-online").onclick = handleSaveOnline;
});

// FUNCIÓN DE RENDERING POR BLOQUE (CARROUSEL MÓVIL)
function renderCurrentBloque() {
  const container = document.getElementById("checklist-app-container");
  if (!container) return;

  const totalBloques = minicargadorData.length;
  if (currentBloqueIndex >= totalBloques) {
    container.innerHTML = `
      <div class="bloque-card" style="text-align:center; padding: 20px;">
        <h3 style="color:#2ECC71;">✅ INSPECCIÓN DE BLOQUES COMPLETADA</h3>
        <p style="font-size:12px; margin-top:5px;">Revise los hallazgos y firme el formulario para finalizar.</p>
      </div>`;
    return;
  }

  const bloque = minicargadorData[currentBloqueIndex];

  let itemsHtml = bloque.items.map(item => {
    const key = item.n;
    const currentVal = userAnswers[key] ? userAnswers[key].val : '';

    return `
      <div class="item-container">
        <div class="item-info">
          <span class="item-num">Ítem ${item.n} (${item.c})</span>
          <p class="item-desc">${item.t}</p>
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

function setAnswer(key, val, crit, risk, action) {
  userAnswers[key] = { key: key, val: val, crit: crit, r: risk, a: action };
  updateHallazgosUI();
  renderCurrentBloque();
}

function changeBloque(dir) {
  currentBloqueIndex += dir;
  renderCurrentBloque();
}

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

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove("active");
}

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
    gps: document.getElementById("gps-coords").innerText,
    respuestas: userAnswers,
    isLoto: lotoEval.isLoto,
    estadoOperativo: lotoEval.isLoto ? "EQUIPO NO OPERATIVO (LOTO)" : "EQUIPO APTO"
  };
}