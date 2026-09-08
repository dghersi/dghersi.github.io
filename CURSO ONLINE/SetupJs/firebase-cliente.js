import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, doc, setDoc, getDoc, getDocs, deleteDoc };

// ==========================================
// FUNCIONES DE LÓGICA — cursos en Firestore
// ==========================================

export async function listarCursos() {
  const snap = await getDocs(collection(db, "cursos"));
  const out = [];
  snap.forEach(d => out.push({ slug: d.id, ...d.data() }));
  return out;
}

export async function poblarSelectCursos(selectEl, incluirVacio = "— Selecciona un curso —") {
  const cursos = await listarCursos();
  selectEl.innerHTML = `<option value="">${incluirVacio}</option>`;
  cursos.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.slug;
    opt.textContent = `${c.nombre_curso} (${c.slug})`;
    selectEl.appendChild(opt);
  });
}
