import { proveedoresConfigurados } from "../SetupJs/ia-cliente.js";

// ==========================================
// ORQUESTADOR — estado global (header + footer)
// ==========================================

export function mostrarEstadoFooter(mensaje) {
  const el = document.getElementById("footerEstado");
  if (!el) return;
  const hora = new Date().toLocaleTimeString();
  el.textContent = `${mensaje} — ${hora}`;
}

export function actualizarPillDrive(conectado) {
  const el = document.getElementById("estadoDriveHeader");
  if (!el) return;
  el.textContent = conectado ? "Drive: conectado" : "Drive: no conectado";
  el.classList.toggle("on", conectado);
}

export function actualizarPillIA() {
  const el = document.getElementById("estadoIAHeader");
  if (!el) return;
  const activos = proveedoresConfigurados();
  el.textContent = activos.length > 0 ? `IA: ${activos.join(" → ")}` : "IA: sin configurar";
  el.classList.toggle("on", activos.length > 0);
}
