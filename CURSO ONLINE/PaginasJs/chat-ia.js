import { llamarIA } from "../SetupJs/ia-cliente.js";
import { construirPromptChat } from "../FuncionesJs/prompts.js";
import { formatearTexto } from "../FuncionesJs/formato.js";
import { mostrarEstadoFooter } from "./estado.js";

// ==========================================
// ESTADO DEL MÓDULO
// ==========================================
let historial = []; // [{ rol: "usuario"|"ia", texto }] — solo en memoria, no se guarda

// ==========================================
// ORQUESTADOR — pestaña libre "Chat con la IA"
// ==========================================
export function initChatIA() {
  document.getElementById("btnChatEnviar").addEventListener("click", enviarMensaje);
  document.getElementById("chatInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  });
}

async function enviarMensaje() {
  const input = document.getElementById("chatInput");
  const texto = input.value.trim();
  if (!texto) return;
  input.value = "";
  historial.push({ rol: "usuario", texto });
  renderMensajes();

  const btn = document.getElementById("btnChatEnviar");
  btn.disabled = true;
  const idxPendiente = agregarBurbujaPendiente();

  try {
    const prompt = construirPromptChat(historial.slice(0, -1), texto);
    const respuesta = await llamarIA(prompt);
    historial.push({ rol: "ia", texto: respuesta });
    mostrarEstadoFooter("Chat: respuesta recibida");
  } catch (err) {
    historial.push({ rol: "ia", texto: "⚠️ Error: " + err.message });
    mostrarEstadoFooter("Chat: error al responder");
  } finally {
    quitarBurbujaPendiente(idxPendiente);
    renderMensajes();
    btn.disabled = false;
  }
}

// ---------- Funciones de renderizado ----------
function renderMensajes() {
  const cont = document.getElementById("chatMensajes");
  cont.innerHTML = "";
  historial.forEach(m => {
    const burbuja = document.createElement("div");
    burbuja.className = "chat-burbuja " + (m.rol === "usuario" ? "usuario" : "ia");
    burbuja.innerHTML = formatearTexto(m.texto);
    cont.appendChild(burbuja);
  });
  cont.scrollTop = cont.scrollHeight;
  if (window.MathJax) MathJax.typesetPromise([cont]).catch(() => {});
}

function agregarBurbujaPendiente() {
  const cont = document.getElementById("chatMensajes");
  const burbuja = document.createElement("div");
  burbuja.className = "chat-burbuja ia";
  burbuja.textContent = "Escribiendo…";
  burbuja.id = "chat-pendiente";
  cont.appendChild(burbuja);
  cont.scrollTop = cont.scrollHeight;
}

function quitarBurbujaPendiente() {
  const el = document.getElementById("chat-pendiente");
  if (el) el.remove();
}
