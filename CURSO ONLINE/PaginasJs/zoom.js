// ==========================================
// ORQUESTADOR — zoom de imágenes (compartido entre pantallas)
// ==========================================

// Crea una miniatura clickeable dentro de "contenedor" que abre la imagen a
// pantalla completa al hacer clic.
export function mostrarImagenConZoom(contenedor, url) {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Imagen generada";
  img.className = "img-zoomable";
  img.addEventListener("click", () => abrirZoom(url));
  contenedor.appendChild(img);
}

export function abrirZoom(url) {
  const overlay = document.createElement("div");
  overlay.className = "zoom-overlay";
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Imagen ampliada";
  overlay.appendChild(img);
  overlay.addEventListener("click", () => overlay.remove());
  document.body.appendChild(overlay);
}
