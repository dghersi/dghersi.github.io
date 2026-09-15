// Módulo de Firma Digital en Canvas y Captura GPS
function initSignatureModule() {
  const canvas = document.getElementById("sig-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let drawing = false;

  // Eventos Táctiles (Smartphones)
  canvas.addEventListener("touchstart", (e) => { 
    drawing = true; 
    draw(e.touches[0]); 
    e.preventDefault(); 
  });
  canvas.addEventListener("touchend", () => { 
    drawing = false; 
    ctx.beginPath(); 
  });
  canvas.addEventListener("touchmove", (e) => { 
    if (drawing) draw(e.touches[0]); 
    e.preventDefault(); 
  });

  // Eventos de Mouse (Desktop)
  canvas.addEventListener("mousedown", (e) => { drawing = true; draw(e); });
  canvas.addEventListener("mouseup", () => { drawing = false; ctx.beginPath(); });
  canvas.addEventListener("mousemove", (e) => { if (drawing) draw(e); });

  // Botón Limpiar Firma
  const clearBtn = document.getElementById("clear-sig-btn");
  if (clearBtn) {
    clearBtn.onclick = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
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
}

function initGPSModule() {
  const timeElem = document.getElementById("timestamp");
  if (timeElem) {
    timeElem.innerText = new Date().toLocaleString();
  }

  const gpsElem = document.getElementById("gps-coords");
  if (gpsElem && "geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => { 
        gpsElem.innerText = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`; 
      },
      () => { 
        gpsElem.innerText = "GPS no activo / Sin permiso"; 
      }
    );
  }
}