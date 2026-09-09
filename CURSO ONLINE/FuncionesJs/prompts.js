// ==========================================
// PLANTILLAS DE TEXTO PARA LA IA
// ==========================================

// ==========================================
// PLANTILLAS DE TEXTO PARA LA IA
// ==========================================

// Ángulos sugeridos para desarrollar un tópico en profundidad, según cuántas
// diapositivas le corresponden. Sirve para que la IA no "rellene" el número
// pedido fragmentando una explicación corta en piezas triviales.
function angulosPorCantidad(cantidad) {
  const todos = [
    "Definición y contexto general del tópico",
    "Fundamento teórico/matemático (fórmulas clave y qué representa cada término)",
    "Interpretación física / qué significa esto en la práctica",
    "Primer ejemplo resuelto que ilustre el concepto",
    "Casos particulares, límites o excepciones a tener en cuenta",
    "Segundo ejemplo resuelto, algo más complejo que el primero",
    "Relación con otros conceptos de la sesión / síntesis integradora"
  ];
  return todos.slice(0, cantidad).map((a, i) => `${i + 1}. ${a}`).join("\n");
}

function guardrailAntiFragmentacion(cantidad) {
  return `IMPORTANTE — no fragmentes el tema en piezas triviales: cada una de las
${cantidad} diapositivas de un mismo tópico debe tener contenido sustancial y
autocontenido de AL MENOS 70 palabras, cubriendo un ángulo distinto y completo
del tópico (nunca una sola oración suelta para "rellenar" el número pedido). Usa
esta estructura sugerida para las ${cantidad} diapositivas de cada tópico:
${angulosPorCantidad(cantidad)}
Si el tópico es demasiado simple para sostener este nivel de profundidad en todas,
profundiza igual con ejemplos adicionales, contexto, unidades, casos límite o
comparaciones — nunca reduzcas una diapositiva a una frase para cumplir el número.`;
}

export function construirPrompt(curso, numSesion, tema, modo = "largo") {
  const porTopico = { corto: 3, largo: 5, extenso: 7 }[modo] || 5;
  const extraEjemplos = modo === "extenso"
    ? " Incorpora al menos un ejemplo concreto resuelto dentro de las diapositivas de cada tópico."
    : "";

  return `Eres ${curso.rol_experto}. Vas a generar el material de estudio de UNA sesión de un curso, en formato Markdown limpio y legible (alguien lo podrá abrir directo en Google Drive o cualquier editor de texto).

Fuente principal de contenido: ${curso.fuente_principal}
Fuentes complementarias: ${curso.fuentes_complementarias || "ninguna adicional"}
Nunca reproduzcas texto extenso ni literal de las fuentes — reformula con tus propias palabras. Si no estás seguro de un dato, dilo explícitamente en vez de inventarlo.
Idioma de salida: ${curso.idioma}
Notación especial: ${curso.notacion_especial}
Software para ejemplos de código: ${curso.software} (si es "NINGUNO", omite por completo la sección de código)

Sesión número ${numSesion}. Tema de esta sesión (tal como aparece en el sílabo):
"""
${tema}
"""

PASO 1: Antes de escribir diapositivas, identifica los tópicos naturales en los
que se divide este tema (normalmente entre 2 y 5, según la complejidad — tú
decides cuántos tiene este tema en particular).

PASO 2: Para CADA tópico identificado, genera EXACTAMENTE ${porTopico} diapositivas
que lo desarrollen en profundidad — ni una menos ni una más.${extraEjemplos} Todas las
diapositivas de un mismo tópico deben llevar el MISMO nombre de tópico entre
corchetes en su título, así: "## Diapositiva N: [Nombre del tópico] Subtítulo
específico de esa diapositiva dentro del tópico".

${guardrailAntiFragmentacion(porTopico)}

Devuelve EXCLUSIVAMENTE Markdown válido con esta estructura EXACTA de encabezados
(nada de texto antes del primer encabezado ni después del último; las fórmulas LaTeX
van con $...$ y backslash normal, sin escapar nada, ya que esto NO es JSON):

# Sesión ${numSesion}: (título breve de la sesión)

## Diapositiva 1: [Nombre del tópico 1] (subtítulo)
(explicación clara de este aspecto del tópico)

\`\`\`svg
(código <svg>...</svg> simple si ayuda a entender; omite este bloque si no hace falta)
\`\`\`

(continúa "## Diapositiva N: [Nombre del tópico 1] Subtítulo" hasta completar
EXACTAMENTE ${porTopico} diapositivas de ese tópico, luego pasa al siguiente tópico
y repite el mismo proceso — EXACTAMENTE ${porTopico} diapositivas por cada tópico
identificado — hasta cubrir todos los tópicos del tema)

## Problema 1

**Enunciado:**
(enunciado completo con datos numéricos)

\`\`\`svg
(código <svg>...</svg> simple con el esquema del problema — tanque, tubería, cuerpo, etc. — SOLO si un diagrama ayuda a visualizar los datos; omite este bloque si no aporta nada)
\`\`\`

**Solución:**
(desarrollo paso a paso hasta el resultado)

(repite "## Problema N" — mínimo 5, de menor a mayor dificultad. Los últimos 1-2
problemas deben ser de dificultad alta, al estilo de los exámenes más exigentes de
universidades de ingeniería (ej. Universidad Nacional de Ingeniería, Perú): que
combinen varios conceptos de la sesión y — cuando el área lo permita — herramientas
como cálculo integral, diagramas de cuerpo libre, o geometría no trivial, en vez de
una simple sustitución directa en una fórmula)

## Código: (a qué problema corresponde, ej. "Problema 2")
\`\`\`
(código completo y ejecutable)
\`\`\`
(repite un bloque "## Código: ..." por cada problema con código; omite toda esta
sección si el software es NINGUNO)

## Examen de práctica
**Tiempo estimado:** (número) minutos

1. (pregunta 1)
2. (pregunta 2)
(entre 5 y 8 preguntas en total, dificultad media-alta, mezclando teoría y problemas aplicados)

## Clave de respuestas
1. (respuesta 1)
2. (respuesta 2)
(mismo número y orden que las preguntas del examen)`;
}

// Desarrolla en profundidad UN tópico puntual ya identificado en una sesión
// existente, generando EXACTAMENTE N diapositivas nuevas para ese tópico (N según
// el modo). El resto de tópicos, problemas, código y examen no se tocan.
export function construirPromptTopico(curso, tema, tituloTopico, modo = "largo") {
  const cantidad = { corto: 3, largo: 5, extenso: 7 }[modo] || 5;
  const extra = modo === "extenso" ? " Incorpora al menos un ejemplo concreto resuelto." : "";

  return `Eres ${curso.rol_experto}. Vas a desarrollar EN PROFUNDIDAD un solo tópico dentro de una sesión de un curso — no toda la sesión, solo este tópico puntual. El resto de los tópicos, los problemas, el código y el examen de esa sesión NO cambian — no los menciones ni los repitas.

Tema general de la sesión: """${tema}"""
Tópico específico a desarrollar: "${tituloTopico}"
Idioma: ${curso.idioma}. Notación especial: ${curso.notacion_especial}.
Genera EXACTAMENTE ${cantidad} diapositivas que desarrollen este tópico — ni una menos ni una más.${extra}

${guardrailAntiFragmentacion(cantidad)}

Devuelve EXCLUSIVAMENTE Markdown con esta estructura, repetida EXACTAMENTE ${cantidad}
veces (fórmulas LaTeX con $...$ y backslash normal, sin escapar nada):

## Diapositiva 1: (subtítulo específico dentro de "${tituloTopico}")
(contenido)

\`\`\`svg
(opcional, código <svg>...</svg> si ayuda a entender; omite este bloque si no hace falta)
\`\`\`

(repite "## Diapositiva N: subtítulo" hasta completar EXACTAMENTE ${cantidad}
diapositivas, todas desarrollando el tópico "${tituloTopico}")`;
}

export function construirPromptCorreccion(preguntas, respuestasAlumno) {
  const bloque = preguntas.map((p, i) =>
    `Pregunta ${i + 1}: ${p.pregunta}\nRespuesta de referencia: ${p.respuesta}\nRespuesta del alumno: ${respuestasAlumno[i] || "(sin responder)"}`
  ).join("\n---\n");

  return `Eres un profesor corrigiendo un examen de práctica. Para cada pregunta, compara la respuesta del alumno con la respuesta de referencia y evalúa si está Correcto, Parcialmente correcto o Incorrecto. Sé constructivo pero honesto — si falta algo o hay un error, dilo con claridad.

${bloque}

Devuelve tu corrección EXCLUSIVAMENTE en este formato de texto plano, uno por pregunta, sin nada más antes ni después:

===CORRECCION 1===
VEREDICTO: (Correcto / Parcialmente correcto / Incorrecto)
COMENTARIO: (explicación breve de 1 a 3 líneas)
===FIN===

(repite exactamente en ese formato para cada una de las ${preguntas.length} preguntas, en el mismo orden, numerando ===CORRECCION 2===, ===CORRECCION 3===, etc.)`;
}

export function construirPromptExamenNuevo(curso, tema, cantidad = 6) {
  return `Eres ${curso.rol_experto}. Genera un examen de práctica NUEVO y DISTINTO al anterior, sobre este tema de la sesión:
"""
${tema}
"""

Idioma: ${curso.idioma}. Notación especial: ${curso.notacion_especial}.
Dificultad media-alta, mezclando preguntas de teoría y de problemas aplicados. Genera exactamente ${cantidad} preguntas, distintas a las de un examen anterior sobre el mismo tema.

Devuelve EXCLUSIVAMENTE este formato de texto plano, sin nada más antes ni después:

## Examen de práctica
**Tiempo estimado:** (número) minutos

1. (pregunta 1)
2. (pregunta 2)
(hasta completar las ${cantidad} preguntas)

## Clave de respuestas
1. (respuesta 1)
2. (respuesta 2)
(mismo número y orden que las preguntas)`;
}

// Genera una descripción visual concreta a partir del contenido de una
// diapositiva/problema, para usarla como prompt de imagen — mucho más relevante
// que mandar solo el título, ya que el modelo de imagen no entiende el tema por sí solo.
export function construirPromptDescripcionVisual(contenidoTexto) {
  return `Basado en este contenido educativo, describe en UNA sola frase corta y muy concreta qué imagen o diagrama ayudaría a visualizarlo mejor (objetos, formas, disposición espacial, colores si aplica). No pidas texto ni letras en la imagen. Responde SOLO con la descripción de la imagen, sin explicaciones ni introducciones ni comillas.

Contenido:
"""
${contenidoTexto}
"""`;
}

// Arma el prompt del chat libre concatenando el historial de la conversación
// (nuestros proveedores de IA reciben un solo bloque de texto, no un arreglo
// de turnos, así que el historial se pliega dentro del mismo prompt).
export function construirPromptChat(historial, mensajeNuevo) {
  const contexto = historial
    .map(m => `${m.rol === "usuario" ? "Usuario" : "Asistente"}: ${m.texto}`)
    .join("\n");
  return `Eres un asistente útil dentro de una app de cursos generados con IA. Responde de forma breve, clara y directa, en español.

${contexto ? contexto + "\n" : ""}Usuario: ${mensajeNuevo}
Asistente:`;
}
