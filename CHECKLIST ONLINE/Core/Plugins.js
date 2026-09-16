// Core/Plugins.js - Calibración de Canvas, GPS y Manejo de Fotos

// 1. Módulo de Firma Digital (Calibrado con factor de escala para evitar descalibre)
function initSignatureModule() {
  const canvas = document.getElementById("sig-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let drawing = false;

  // Obtener coordenadas exactas resescaladas según la dimensión real CSS vs Canvas Internal
  function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function startDraw(e) {
    drawing = true;
    const pos = getCanvasCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function moveDraw(e) {
    if (!drawing) return;
    const pos = getCanvasCoordinates(e);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1B2631";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  function stopDraw() {
    drawing = false;
    ctx.beginPath();
  }

  // Eventos Táctiles (Mobile)
  canvas.addEventListener("touchstart", (e) => { startDraw(e); e.preventDefault(); }, { passive: false });
  canvas.addEventListener("touchmove", (e) => { moveDraw(e); e.preventDefault(); }, { passive: false });
  canvas.addEventListener("touchend", stopDraw);

  // Eventos de Puntero (Desktop / Mouse)
  canvas.addEventListener("mousedown", startDraw);
  canvas.addEventListener("mousemove", moveDraw);
  canvas.addEventListener("mouseup", stopDraw);
  canvas.addEventListener("mouseleave", stopDraw);

  // Botón Limpiar
  const clearBtn = document.getElementById("clear-sig-btn");
  if (clearBtn) {
    clearBtn.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// 2. Módulo de Captura GPS y Fecha/Hora
function initGPSModule() {
  const timeElem = document.getElementById("timestamp");
  if (timeElem) {
    const now = new Date();
    timeElem.innerText = now.toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' });
  }

  const gpsElem = document.getElementById("gps-coords");
  if (gpsElem && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        gpsElem.innerText = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      () => {
        gpsElem.innerText = "GPS no disponible / Sin permisos";
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }
}

// Exportación global para orquestador app.js
window.initSignatureModule = initSignatureModule;
window.initGPSModule = initGPSModule;