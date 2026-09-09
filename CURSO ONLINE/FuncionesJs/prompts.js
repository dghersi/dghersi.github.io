// ==========================================
// PLANTILLAS DE TEXTO PARA LA IA
// ==========================================

export function construirPrompt(curso, numSesion, tema, modo = "largo") {
  const config = {
    corto: { rango: "entre 1 y 2", extra: "" },
    largo: { rango: "entre 3 y 5", extra: "" },
    extenso: { rango: "entre 6 y 8", extra: " Incluye al menos un ejemplo concreto dentro del contenido de cada diapositiva de teoría." }
  }[modo] || { rango: "entre 3 y 5", extra: "" };

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

Devuelve EXCLUSIVAMENTE Markdown válido con esta estructura EXACTA de encabezados
(nada de texto antes del primer encabezado ni después del último; las fórmulas LaTeX
van con $...$ y backslash normal, sin escapar nada, ya que esto NO es JSON):

# Sesión ${numSesion}: (título breve de la sesión)

## Diapositiva 1: (título)
(explicación clara del concepto)

\`\`\`svg
(código <svg>...</svg> simple si ayuda a entender; omite este bloque si no hace falta)
\`\`\`

## Diapositiva 2: (título)
(repite "## Diapositiva N: título" hasta cubrir ${config.rango} diapositivas en total.${config.extra})

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

// Desarrolla en profundidad UN topico puntual (una diapositiva) de una sesión ya
// generada, expandiéndolo a 1-8 diapositivas nuevas según el modo. El resto de
// la sesión no se toca. Usado por el badge "Modelo/Modo" del reproductor.
export function construirPromptTopico(curso, tema, tituloTopico, modo = "largo") {
  const config = {
    corto: { rango: "entre 1 y 2", extra: "" },
    largo: { rango: "entre 3 y 5", extra: "" },
    extenso: { rango: "entre 6 y 8", extra: " Incorpora ejemplos concretos resueltos dentro de estas diapositivas." }
  }[modo] || { rango: "entre 3 y 5", extra: "" };

  return `Eres ${curso.rol_experto}. Vas a desarrollar EN PROFUNDIDAD un solo tópico dentro de una sesión de un curso — no toda la sesión, solo este tópico puntual. El resto de los tópicos, los problemas, el código y el examen de esa sesión NO cambian — no los menciones ni los repitas.

Tema general de la sesión: """${tema}"""
Tópico específico a desarrollar: "${tituloTopico}"
Idioma: ${curso.idioma}. Notación especial: ${curso.notacion_especial}.
Cantidad de diapositivas pedida para desarrollar SOLO este tópico: ${config.rango}.${config.extra}

Devuelve EXCLUSIVAMENTE Markdown con esta estructura, repetida tantas veces como diapositivas necesites para desarrollar el tópico (fórmulas LaTeX con $...$ y backslash normal, sin escapar nada):

## Diapositiva 1: (título relacionado con "${tituloTopico}")
(contenido)

\`\`\`svg
(opcional, código <svg>...</svg> si ayuda a entender; omite este bloque si no hace falta)
\`\`\`

(repite "## Diapositiva N: título" hasta completar ${config.rango} diapositivas en total, todas desarrollando el tópico "${tituloTopico}")`;
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
