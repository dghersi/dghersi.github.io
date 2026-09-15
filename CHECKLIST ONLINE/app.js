// Configuración de Firebase (Plan Spark Gratuito)
const firebaseConfig = {
  apiKey: "AIzaSyBu54-gCkbroy2rzYyWm-wR8kZzDM_H9vk",
  authDomain: "gestion-maquinaria-pwa.firebaseapp.com",
  projectId: "gestion-maquinaria-pwa",
  storageBucket: "gestion-maquinaria-pwa.firebasestorage.app",
  messagingSenderId: "809833022067",
  appId: "1:809833022067:web:447d9e1c8f2957faac6006"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const storage = firebase.storage();

// Habilitar Persistencia Offline en Firestore
db.enablePersistence().catch(err => console.warn("Modo Offline activo sin caché persistente:", err.code));

// Matriz de 27 Sub-ítems Técnicos Oficiales del Minicargador
const checklistData = [
  { b: "1. Entorno y EPP", n: "1.1", t: "EPP Obligatorio: Portar casco, chaleco reflectivo, botas de acero y antiparras en buen estado.", c: "ALTO" },
  { b: "1. Entorno y EPP", n: "1.2", t: "Condición del Terreno: Suelo estable, firme, nivelado y libre de líneas eléctricas expuestas.", c: "ALTO" },
  { b: "1. Entorno y EPP", n: "1.3", t: "Fugas en Suelo: Piso inferior limpio sin goteo fresco de aceite, refrigerante ni diésel.", c: "MEDIO" },
  { b: "2. Cabina y Visibilidad", n: "2.1", t: "Estructura ROPS/FOPS: Cabina intacta sin fisuras, deformaciones ni soldaduras no reglamentarias.", c: "ALTO" },
  { b: "2. Cabina y Visibilidad", n: "2.2", t: "Cinturón de Seguridad: Anclaje firme, correa sin desgaste y hebilla de traba muy segura.", c: "ALTO" },
  { b: "2. Cabina y Visibilidad", n: "2.3", t: "Espejos y Parabrisas: Cristales limpios sin trizaduras; espejos con ajuste de vista 360°.", c: "MEDIO" },
  { b: "2. Cabina y Visibilidad", n: "2.4", t: "Alarma y Bocina: Tono de la bocina audible a >10m y alarma de reversa operativa al 100% en campo.", c: "ALTO" },
  { b: "3. Prueba Funcional", n: "3.1", t: "Panel de Control: Testigos de aceite, temperatura y batería apagan tras el arranque del motor.", c: "ALTO" },
  { b: "3. Prueba Funcional", n: "3.2", t: "Escape y Ruidos: Operación pareja del motor sin golpeteos ni emisión de humo denso azul o negro.", c: "MEDIO" },
  { b: "3. Prueba Funcional", n: "3.3", t: "Nivel de Combustible: Tanque con capacidad mínima de 1/4 para evitar aire en el sistema.", c: "MEDIO" },
  { b: "4. Hidráulico & Eléctrico", n: "4.1", t: "Cilindros Hidráulicos: Vástagos pulidos sin rayas profundas y sellos sin fugas activas de aceite.", c: "ALTO" },
  { b: "4. Hidráulico & Eléctrico", n: "4.2", t: "Mangueras y Acoples: Líneas de alta presión sin deformaciones ni goteos en conectores de presión.", c: "ALTO" },
  { b: "4. Hidráulico & Eléctrico", n: "4.3", t: "Batería y Master: Bornes limpios y apretados; interruptor cortacorriente operativo y con traba.", c: "MEDIO" },
  { b: "5. Componentes Esenciales", n: "5.1", t: "Brazos de Elevación: Estructura del boom libre de fisuras en soldaduras de pivote o por torsión.", c: "ALTO" },
  { b: "5. Componentes Esenciales", "5.2", t: "Cucharón y Dientes: Cuchilla sin grietas; dientes y punteras con pernos bien fijos y sin juego.", c: "MEDIO" },
  { b: "5. Componentes Esenciales", "5.3", "Acople Quick Attach: Pasadores y cuñas de traba enganchados al 100% dentro del aditamento.", c: "ALTO" },
  { b: "6. Sistemas de Control", n: "6.1", t: "Barra Interlock: Al subir la barra se inhabilitan joysticks y la tracción al instante en cabina.", c: "ALTO" },
  { b: "6. Sistemas de Control", n: "6.2", t: "Joysticks de Mando: Retorno automático a posición neutra de forma suave, precisa y sin trabas.", c: "ALTO" },
  { b: "6. Sistemas de Control", n: "6.3", t: "Freno de Parqueo: Inmovilización completa de la máquina al activar switch o levantar la barra.", c: "ALTO" },
  { b: "7. Traslación / Apoyo", n: "7.1", t: "Estado de Neumáticos: Llantas sin cortes profundos, flancos sanos y aire a PSI recomendado.", c: "MEDIO" },
  { b: "7. Traslación / Apoyo", n: "7.2", t: "Pernos de Rueda: Totalidad de tuercas presentes, ajustadas con torque y rin sin grieta visible.", c: "ALTO" },
  { b: "7. Traslación / Apoyo", n: "7.3", t: "Tensión de Oruga: Flecha de oruga dentro de norma de fábrica; rodillos libres de barro o rocas.", c: "MEDIO" },
  { b: "8. Equipo de Emergencia", n: "8.1", t: "Extintor PQS: Unidad ABC de 6-9 lbs con manómetro en verde y recarga vigente en tarjeta visible.", c: "ALTO" },
  { b: "8. Equipo de Emergencia", n: "8.2", t: "Kit Antiderrames: Paños absorbentes, salchichas y bolsas de disposición final 100% completos.", c: "MEDIO" },
  { b: "8. Equipo de Emergencia", n: "8.3", t: "Parada de Emergencia: Switch de corte de combustible y energía accesible y 100% funcional hoy.", c: "ALTO" },
  { b: "9. Estacionamiento", n: "9.1", t: "Posición de Cucharón: Cucharón apoyado de forma plana directamente en el suelo (nunca en aire).", c: "MEDIO" },
  { b: "9. Estacionamiento", n: "9.2", t: "Aseguramiento Cabina: Freno de parqueo activo, barra arriba e interruptor cortacorriente apagado.", c: "ALTO" },
  { b: "9. Estacionamiento", n: "9.3", t: "Cooldown de Turbo: Mantener el motor en ralentí durante 3 minutos completos previas al apagado.", c: "MEDIO" }
];

// Estado de la aplicación
const answers = {};
let isLotoTriggered = false;

// Renderizar Tarjetas
document.addEventListener("DOMContentLoaded", () => {
  renderChecklistCards();
  initSignatureCanvas();
  initGPSAndTimestamp();
  initNetworkListener();
});

function renderChecklistCards() {
  const container = document.getElementById("checklist-cards-container");
  container.innerHTML = "";

  checklistData.forEach((item) => {
    const card = document.createElement("div");
    card.className = `card item-card crit-${item.c}`;
    card.innerHTML = `
      <div class="item-header">
        <span class="item-num">${item.n}</span>
        <span class="item-crit ${item.c}">${item.c === "ALTO" ? "CRÍTICO (ALTO)" : "MEDIO"}</span>
      </div>
      <p class="item-desc">${item.t}</p>
      <div class="touch-options">
        <button type="button" class="touch-btn" onclick="setAnswer('${item.n}', 'SI', '${item.c}', this)">CONFORME [✓]</button>
        <button type="button" class="touch-btn" onclick="setAnswer('${item.n}', 'NO', '${item.c}', this)">FALLA [X]</button>
        <button type="button" class="touch-btn" onclick="setAnswer('${item.n}', 'NA', '${item.c}', this)">N / A</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function setAnswer(num, val, crit, btn) {
  answers[num] = { val, crit };
  
  // Resaltar botón seleccionado
  const parent = btn.parentElement;
  Array.from(parent.children).forEach(b => b.className = "touch-btn");
  btn.classList.add(`active-${val}`);

  evaluateLotoStatus();
  updateProgress();
}

function evaluateLotoStatus() {
  isLotoTriggered = false;
  
  for (const key in answers) {
    if (answers[key].val === "NO" && answers[key].crit === "ALTO") {
      isLotoTriggered = true;
      break;
    }
  }

  const lotoBanner = document.getElementById("loto-banner");
  const photoSection = document.getElementById("photo-section");

  if (isLotoTriggered) {
    lotoBanner.classList.remove("hidden");
    photoSection.classList.remove("hidden");
  } else {
    lotoBanner.classList.add("hidden");
    photoSection.classList.add("hidden");
  }
}

function updateProgress() {
  const count = Object.keys(answers).length;
  const pct = Math.round((count / 27) * 100);
  document.getElementById("progress-bar").style.width = `${pct}%`;
  document.getElementById("progress-text").innerText = `Progreso: ${count}/27 (${pct}%)`;
}

// Canvas para Firma Digital Táctil
let canvas, ctx, drawing = false;

function initSignatureCanvas() {
  canvas = document.getElementById("sig-canvas");
  ctx = canvas.getContext("2d");
  
  canvas.addEventListener("touchstart", (e) => { drawing = true; draw(e.touches[0]); e.preventDefault(); });
  canvas.addEventListener("touchend", () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener("touchmove", (e) => { if (drawing) draw(e.touches[0]); e.preventDefault(); });

  canvas.addEventListener("mousedown", (e) => { drawing = true; draw(e); });
  canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener("mousemove", (e) => { if (drawing) draw(e); });

  document.getElementById("clear-sig-btn").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

function draw(e) {
  const rect = canvas.getBoundingClientRect();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#1B2631";
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
}

// GPS & Timestamp
function initGPSAndTimestamp() {
  document.getElementById("timestamp").innerText = new Date().toLocaleString();

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById("gps-coords").innerText = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      () => { document.getElementById("gps-coords").innerText = "Sin GPS / Permiso denegado"; }
    );
  }
}

function initNetworkListener() {
  window.addEventListener("online", updateNetBadge);
  window.addEventListener("offline", updateNetBadge);
}

function updateNetBadge() {
  const b = document.getElementById("net-status");
  if (navigator.onLine) {
    b.className = "status-badge online";
    b.innerText = "📡 ONLINE";
  } else {
    b.className = "status-badge offline";
    b.innerText = "🔌 OFFLINE";
  }
}

// Enviar Formulario y Guardar
document.getElementById("submit-btn").addEventListener("click", async () => {
  if (Object.keys(answers).length < 27) {
    alert("Por favor responda los 27 ítems antes de enviar.");
    return;
  }

  const payload = {
    proyecto: document.getElementById("input-proyecto").value,
    horometro: document.getElementById("input-horometro").value,
    turno: document.getElementById("input-turno").value,
    operador: document.getElementById("input-operador").value,
    estadoOperativo: isLotoTriggered ? "NO APTO PARA OPERAR (BLOQUEO LOTO)" : "APTO PARA OPERAR",
    respuestas: answers,
    gps: document.getElementById("gps-coords").innerText,
    fechaHora: new Date().toISOString()
  };

  try {
    await db.collection("inspecciones_minicargador").add(payload);
    alert(`Inspección guardada exitosamente.\nEstado: ${payload.estadoOperativo}`);
    generatePDFReport(payload);
  } catch (e) {
    alert("Guardado localmente en caché offline. Se sincronizará al conectar.");
    generatePDFReport(payload);
  }
});

// Generación de Reporte PDF
function generatePDFReport(data) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("CHECKLIST PRE-OPERACIONAL - MINICARGADOR", 15, 15);
  doc.setFontSize(9);
  doc.text(`Proyecto: ${data.proyecto} | Horómetro: ${data.horometro} | Turno: ${data.turno}`, 15, 23);
  doc.text(`Operador: ${data.operador} | Fecha: ${data.fechaHora}`, 15, 29);
  doc.text(`ESTADO FINAL: ${data.estadoOperativo}`, 15, 35);

  let y = 45;
  doc.setFontSize(8);
  for (const k in data.respuestas) {
    doc.text(`Item ${k}: [ ${data.respuestas[k].val} ] (${data.respuestas[k].crit})`, 15, y);
    y += 5;
    if (y > 280) { doc.addPage(); y = 15; }
  }

  doc.save(`Checklist_Minicargador_${data.operador}.pdf`);
}