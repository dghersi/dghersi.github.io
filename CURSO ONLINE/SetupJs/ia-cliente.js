// ==========================================
// FUNCIONES DE LÓGICA — llamadas a cada proveedor
// ==========================================

async function llamarProveedorGemini(apiKey, modelo, promptText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }], generationConfig: { temperature: 0.4, maxOutputTokens: 8192 } })
  });
  if (!res.ok) {
    const err = new Error(`(${res.status}) ${(await res.text()).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Respuesta vacía o con formato inesperado.");
  const razon = data?.candidates?.[0]?.finishReason;
  if (razon === "MAX_TOKENS") throw new Error("La respuesta se cortó por límite de tokens — intenta un Modo más corto o menos tópicos.");
  return text;
}

async function llamarProveedorOpenAICompatible(baseUrl, apiKey, modelo, promptText) {
  const res = await fetch(baseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify({ model: modelo, messages: [{ role: "user", content: promptText }], temperature: 0.4, max_tokens: 8192 })
  });
  if (!res.ok) {
    const err = new Error(`(${res.status}) ${(await res.text()).slice(0, 200)}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Respuesta vacía o con formato inesperado.");
  const razon = data?.choices?.[0]?.finish_reason;
  if (razon === "length") throw new Error("La respuesta se cortó por límite de tokens — intenta un Modo más corto o menos tópicos.");
  return text;
}

// ==========================================
// DATOS — proveedores configurados, en orden de respaldo
// ==========================================

const PROVEEDORES_IA = [
  {
    nombre: "Gemini",
    apiKey: () => localStorage.getItem("gemini_api_key"),
    modelo: () => localStorage.getItem("gemini_modelo") || "gemini-2.5-flash",
    llamar: llamarProveedorGemini
  },
  {
    nombre: "Groq",
    apiKey: () => localStorage.getItem("groq_api_key"),
    modelo: () => localStorage.getItem("groq_modelo") || "llama-3.3-70b-versatile",
    llamar: (apiKey, modelo, prompt) => llamarProveedorOpenAICompatible("https://api.groq.com/openai/v1/chat/completions", apiKey, modelo, prompt)
  },
  {
    nombre: "Mistral",
    apiKey: () => localStorage.getItem("mistral_api_key"),
    modelo: () => localStorage.getItem("mistral_modelo") || "mistral-large-latest",
    llamar: (apiKey, modelo, prompt) => llamarProveedorOpenAICompatible("https://api.mistral.ai/v1/chat/completions", apiKey, modelo, prompt)
  }
];

export function proveedoresConfigurados() {
  return PROVEEDORES_IA.filter(p => !!p.apiKey()).map(p => p.nombre);
}

let ultimoProveedorExitoso = null;

// Devuelve el nombre del proveedor que respondió exitosamente en la última
// llamada a llamarIA() (útil para guardar/mostrar "con qué IA se generó esto").
export function obtenerUltimoProveedor() {
  return ultimoProveedorExitoso;
}

// ==========================================
// ORQUESTADOR — intenta cada proveedor en orden, con reintentos
// ==========================================

// Intenta cada proveedor configurado en orden (Gemini → Groq → Mistral), salvo
// que se pase "proveedorForzado" — en ese caso usa SOLO ese proveedor (con sus
// mismos reintentos), útil para regenerar contenido puntual con un modelo elegido.
// Dentro de cada uno reintenta unas veces si está saturado (503/429)
// antes de pasar al siguiente proveedor.
export async function llamarIA(promptText, onProgreso, proveedorForzado) {
  const errores = [];
  let algunoConfigurado = false;
  const lista = proveedorForzado
    ? PROVEEDORES_IA.filter(p => p.nombre.toLowerCase() === proveedorForzado.toLowerCase())
    : PROVEEDORES_IA;
  for (const prov of lista) {
    const apiKey = prov.apiKey();
    if (!apiKey) continue;
    algunoConfigurado = true;
    for (let intento = 1; intento <= 3; intento++) {
      try {
        if (onProgreso) onProgreso(`Probando con ${prov.nombre}${intento > 1 ? ` (intento ${intento})` : ""}…`);
        let text = await prov.llamar(apiKey, prov.modelo(), promptText);
        text = text.trim();
        if (text.startsWith("```")) text = text.replace(/^```(markdown|md)?/i, "").replace(/```$/, "").trim();
        ultimoProveedorExitoso = prov.nombre;
        return text;
      } catch (err) {
        const saturado = err.status === 503 || err.status === 429;
        if (saturado && intento < 3) {
          await new Promise(r => setTimeout(r, 4000 * intento));
          continue;
        }
        errores.push(`${prov.nombre}: ${err.message}`);
        break;
      }
    }
  }
  if (!algunoConfigurado) {
    throw new Error(proveedorForzado
      ? `No configuraste la API key de ${proveedorForzado}.`
      : "No configuraste ninguna API key (Gemini, Groq o Mistral).");
  }
  throw new Error("Todos los proveedores fallaron — " + errores.join(" | "));
}
