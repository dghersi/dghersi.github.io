import { initCrearCurso } from "./PaginasJs/crear-curso.js";
import { initReproductor } from "./PaginasJs/reproductor.js";
import { initChatIA } from "./PaginasJs/chat-ia.js";
import { initGestionImagenes } from "./PaginasJs/gestion-imagenes.js";
import { initExportacion } from "./PaginasJs/exportacion.js";
import { initReproductorPPT } from "./PaginasJs/reproductor-ppt.js";

// ==========================================
// ORQUESTADOR GENERAL — navegación + arranque
// ==========================================

function activarPestana(nombre) {
  document.querySelectorAll(".side-nav-item").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".app-main .panel").forEach(p => p.classList.remove("active"));
  document.querySelector(`.side-nav-item[data-tab="${nombre}"]`).classList.add("active");
  document.getElementById("panel-" + nombre).classList.add("active");
}

document.querySelectorAll(".side-nav-item").forEach(btn => {
  btn.addEventListener("click", () => activarPestana(btn.dataset.tab));
});

initCrearCurso();
initReproductor();
initChatIA();
initGestionImagenes();
initExportacion();
initReproductorPPT();
