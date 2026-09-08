import { initCrearCurso } from "./PaginasJs/crear-curso.js";
import { initReproductor } from "./PaginasJs/reproductor.js";
import { initChatIA } from "./PaginasJs/chat-ia.js";

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

// Los enlaces del sub-menú activan la pestaña "Crear Curso" y bajan a la sección.
document.querySelectorAll(".side-sublist a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    activarPestana("crear");
    document.getElementById(link.getAttribute("href").slice(1))
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

initCrearCurso();
initReproductor();
initChatIA();
