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

async function generarImagenCloudflare(accountId, apiToken, modelo, prompt) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${modelo}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiToken}` },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const err = new Error(`(${res.status}) ${(await res.text()).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await res.json();
    const b64 = data?.result?.image;
    if (!b64) throw new Error("Cloudflare no devolvió una imagen.");
    return `data:image/png;base64,${b64}`;
  }
  const buffer = await (await res.blob()).arrayBuffer();
  const b64 = btoa(new Uint8Array(buffer).reduce((s, b) => s + String.fromCharCode(b), ""));
  return `data:image/png;base64,${b64}`;
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
      localStorage.getItem("gemini_modelo_imagen") || "gemini-3.1-flash-image",
      prompt
    )
  },
  {
    nombre: "Cloudflare",
    disponible: () => !!localStorage.getItem("cf_account_id") && !!localStorage.getItem("cf_api_token"),
    generar: (prompt) => generarImagenCloudflare(
      localStorage.getItem("cf_account_id"),
      localStorage.getItem("cf_api_token"),
      localStorage.getItem("cf_modelo_imagen") || "@cf/black-forest-labs/flux-1-schnell",
      prompt
    )
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
