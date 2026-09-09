// ==========================================
// FUNCIONES DE LÓGICA — generación de imágenes por proveedor
// ==========================================

async function generarImagenGemini(apiKey, modelo, prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] }
    })
  });
  if (!res.ok) {
    const err = new Error(`(${res.status}) ${(await res.text()).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const parte = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (!parte) throw new Error("Gemini no devolvió una imagen (revisa el nombre del modelo de imagen).");
  return `data:${parte.inlineData.mimeType};base64,${parte.inlineData.data}`;
}

// Pollinations no requiere API key ni fetch — construye la URL y la valida
// cargándola como <img>, evitando por completo el bloqueo CORS que sí afecta
// a APIs como la de Cloudflare cuando se llaman directo desde el navegador.
function verificarImagenCarga(url, timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error("Tiempo de espera agotado cargando la imagen")), timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(); };
    img.onerror = () => { clearTimeout(timer); reject(new Error("No se pudo cargar la imagen de Pollinations")); };
    img.src = url;
  });
}

async function generarImagenPollinations(prompt) {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=512&model=flux&nologo=true`;
  await verificarImagenCarga(url);
  return url;
}

// Llama al Worker propio de Cloudflare (desplegado por el usuario) — el Worker
// corre server-side y agrega headers CORS, así se evita el bloqueo que sí ocurre
// al llamar la API de Cloudflare directo desde el navegador.
async function generarImagenCloudflareWorker(workerUrl, prompt) {
  const res = await fetch(workerUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = new Error(`(${res.status}) ${(await res.text()).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  if (!data.image) throw new Error(data.error || "El Worker no devolvió una imagen.");
  return `data:image/png;base64,${data.image}`;
}

// ==========================================
// DATOS — proveedores de imagen, en orden de respaldo
// ==========================================
const PROVEEDORES_IMAGEN = [
  {
    nombre: "Gemini",
    disponible: () => !!localStorage.getItem("gemini_api_key"),
    generar: (prompt) => generarImagenGemini(
      localStorage.getItem("gemini_api_key"),
      localStorage.getItem("gemini_modelo_imagen") || "gemini-2.5-flash-image",
      prompt
    )
  },
  {
    nombre: "Cloudflare",
    disponible: () => !!localStorage.getItem("cf_worker_url"),
    generar: (prompt) => generarImagenCloudflareWorker(localStorage.getItem("cf_worker_url"), prompt)
  },
  {
    nombre: "Pollinations",
    disponible: () => true, // no requiere API key
    generar: (prompt) => generarImagenPollinations(prompt)
  }
];

// ==========================================
// ORQUESTADOR — Gemini primero, Cloudflare si falla o no está configurado
// ==========================================
export async function generarImagen(prompt, onProgreso) {
  const errores = [];
  let algunoConfigurado = false;
  for (const prov of PROVEEDORES_IMAGEN) {
    if (!prov.disponible()) continue;
    algunoConfigurado = true;
    for (let intento = 1; intento <= 2; intento++) {
      try {
        if (onProgreso) onProgreso(`Generando imagen con ${prov.nombre}${intento > 1 ? ` (intento ${intento})` : ""}…`);
        const dataUrl = await prov.generar(prompt);
        return { dataUrl, proveedor: prov.nombre };
      } catch (err) {
        const saturado = err.status === 503 || err.status === 429;
        if (saturado && intento < 2) {
          await new Promise(r => setTimeout(r, 4000));
          continue;
        }
        errores.push(`${prov.nombre}: ${err.message}`);
        break;
      }
    }
  }
  if (!algunoConfigurado) throw new Error("No configuraste ningún proveedor de imágenes (Gemini o Cloudflare).");
  throw new Error("Todos los proveedores de imágenes fallaron — " + errores.join(" | "));
}
