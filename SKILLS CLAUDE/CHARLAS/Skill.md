---
name: "charlas-seguridad"
description: "Genera charlas de seguridad (5-20 min) para cuadrillas de construcción en Perú, con estilo de boletín, basadas en biblioteca real en Supabase. Úsala siempre que pidan una charla de seguridad/SST/salud/ambiental/tema libre, o continuar una serie ya iniciada."
---

# Charlas de Seguridad

Genera charlas para cuadrillas de construcción en Perú, en el estilo de boletín real de DGM: serio pero visual, basado en biblioteca real de la empresa (nunca genérico de internet), con una regla de tono no negociable: nunca redactar como si la charla documentara un incumplimiento normativo de la empresa (ver "Criterios paliativos" más abajo).

La serie puede contemplar los siguientes ambitos: 
- **Seguridad** (técnica de obra, con biblioteca propia), 
- **Salud** (higiene/salud ocupacional), 
- **Ambiental** o 
- **Tema Libre** (conocimiento general / protección personal, ej. RRHH, economía personal, seguridad ciudadana).

Cada ámbito tiene su propia cadencia semanal — ver "Cadencia semanal, TemasProgramados y cálculo de fecha".

Desde sept. 2026, gran parte del flujo repetitivo está automatizado (builder reutilizable, rotación automática, tarea programada semanal) — ver `references/motor_automatizacion.md`. La automatización SIEMPRE deja la opción de hacerlo manual: cualquier paso automatizado puede anularse si el usuario da una instrucción explícita distinta (ej. "usa el tema visual Alerta Roja", "esta semana no sigas el orden de TemasProgramados, quiero X").

## Índice de referencias — dónde buscar cuando algo falla

| Archivo | Contenido | Se usa en |
|---|---|---|
| `references/motor_automatizacion.md` | Builder `.docx` (código), rotación automática (tema visual + siguiente tópico), tarea programada + candado de doble seguro | Fase 1, Fase 4, Fase 5 |
| `references/layout_docs.md` | Formato de una charla + Formato del compilado (Doc/Google Docs) | Fase 5 |
| `references/layout_ppt.md` | 3 layouts de PPT (hoy diferido) | Fase 5 |
| `references/prompt_nanobanana.md` | 7 bloques de prompt de imagen, croquis, candados, errores ya corregidos | Fase 3 — Imagen |
| `references/estilo_boletin.md` | Voz, tono por sección, excepción Tema Libre | Fase 3 — Texto |
| `references/criterios_paliativo.md` | Regla de no admitir incumplimiento, ejemplos mal/bien | Fase 3 — Texto, Fase 2 |
| `references/bifurcacion_temporal.md` | Pregunta prefabricada vs. construida en obra | Fase 1 |
| `references/esquema_supabase.md` | Esquema completo de las 13 tablas, columna por columna | Todas las fases |

Si algo sale mal, el síntoma dice qué archivo abrir: ¿texto con tono raro? → `estilo_boletin.md`/`criterios_paliativo.md`. ¿Charla repetida o periodo atascado? → Fase 0. ¿Imagen mal compuesta? → `prompt_nanobanana.md`. ¿Documento con formato roto? → `layout_docs.md`/`motor_automatizacion.md`.

## Las tres memorias, y por qué la Fase 0 es la pieza crítica

Esta skill no tiene una sola memoria, tiene tres, y cada una guarda algo distinto:

| Memoria | Qué guarda | Se actualiza |
|---|---|---|
| Memoria del proyecto (`sc-charlas-resumen-chat.md`) | Cómo quedó la última conversación | Sola, después de cada conversación |
| Supabase | Estado operativo real: charlas, periodos, biblioteca | Durante el flujo (Fases 1-5) |
| GitHub | Especificaciones técnicas de bajo cambio (layouts, prompts) | **Futuro — no implementado aún**: sin repositorio configurado todavía; hoy ese contenido vive en `references/` local |

Estas memorias se desincronizan si nada las concilia (causa raíz confirmada de los bugs de "se queda pegado en un periodo viejo"). La Fase 0 es la única fase que las conecta entre sí antes de que el resto del flujo asuma que están de acuerdo — por eso nunca se salta, y el resto (Fases 1 a 5) son flujo de ejecución puro, no reconciliación.

## Por qué existe esta skill

Una charla mal escrita hace dos cosas malas a la vez: aburre a la cuadrilla (texto genérico, sin casos reales, sin imágenes) y, si documenta con demasiada honestidad una carencia de la empresa, se convierte en evidencia en un proceso SUNAFIL o una demanda laboral. Esta skill prioriza siempre casos reales (de la propia empresa, o noticias externas verificables) sobre contenido genérico, y reencuadra cualquier restricción real como educación en jerarquía de controles, nunca como confesión de incumplimiento.

## 0. Fase 0 — Al iniciar o retomar la conversación (SIEMPRE, antes de cualquier otra cosa)

Esta fase es una SUB-ORQUESTACIÓN de varios pasos, no una sola consulta. Es la pieza más crítica de toda la skill: su ausencia o incompletitud es la causa raíz confirmada de los bugs recurrentes de "se queda pegado en un periodo viejo" (sept./oct. 2026 y nov./dic. 2026). Nunca se salta, nunca se resume de memoria.

1. **Memoria del proyecto primero**: lee `areas/sc-charlas-resumen-chat.md` — ese archivo lo actualiza automáticamente un proceso de memoria después de cada conversación, incluso si la sesión anterior se cortó de forma abrupta. Extrae de ahí cómo quedó la última conversación/corrida: qué se decidió, qué quedó pendiente, qué se esperaba que se actualizara en Supabase.
2. **Estado de periodos — tabla `estado_avance`**: `SELECT periodo, estado, nota FROM estado_avance ORDER BY periodo` (ver "Esquema de Supabase"). Cualquier periodo con `estado` = `'en_revision'` o `'cerrado'` **no recibe trabajo nuevo**, aunque tenga filas sin `'completo'` en `TemasProgramados`/`charlas_registro` — eso es información esperada (revisión humana pendiente o cierre), nunca un bloqueo, y nunca motivo para detener el avance de otros periodos. Solo los periodos `'activo'`, y cualquier periodo futuro que todavía no tenga fila en `estado_avance` (se asume disponible por defecto), son candidatos válidos para asignar trabajo nuevo.
3. **Estado real en Supabase**, ya filtrado por el paso 2:
   - `SELECT tema, topico, serie, titulo, dia_semana, orden, estado, charla_id FROM "TemasProgramados" ORDER BY tema, orden` — para saber qué pista/tópico/serie sigue pendiente y cuáles ya están `completo`, excluyendo los periodos marcados `en_revision`/`cerrado` en el paso 2.
   - `SELECT titulo, fecha, ambito, serie, parte, estado FROM charlas_registro ORDER BY fecha DESC LIMIT 15` (o filtrando por serie) — para conocer la ÚLTIMA fecha real ya usada por cada pista/serie. Esta fecha real es la única base válida para calcular la fecha de la siguiente charla (ver regla de fechas abajo) — nunca uses la fecha del día en que transcurre la sesión ni fechas consecutivas artificiales.
4. **Conciliación memoria ↔ Supabase**: compara lo que dice `sc-charlas-resumen-chat.md` (paso 1) contra el estado real recién consultado (pasos 2-3). Si hay una discrepancia — ej. la memoria dice que algo quedó cerrado/actualizado pero Supabase todavía lo muestra pendiente, o al revés — infórmalo al usuario ANTES de continuar, indicando la consecuencia concreta si no se corrige (ej. "riesgo de repetir el tópico X", "esa charla podría redactarse dos veces"). Espera su confirmación o corrección: nunca decidas en silencio cuál de las dos fuentes tiene razón. Esta conciliación se basa en el resumen de memoria, nunca en releer el transcript crudo de conversaciones (poco confiable para esto).
5. **Documento externo como fuente de verdad superior**: si el usuario adjunta o referencia un documento maestro/temario externo (Google Doc, Word, PDF) con el índice y fechas reales de las charlas ya entregadas, ese documento manda por encima de Supabase y de la memoria — concilia cualquier discrepancia contra ese documento y corrige Supabase, no al revés.

Carga mentalmente este estado (periodo activo real, pistas completadas esta semana, próximo tópico por pista, tema_visual usado más recientemente por ámbito) antes de responder qué sigue.

## Fase 1 — Contexto y Configuración

Todo lo que se recopila o se decide ANTES de consultar la biblioteca o redactar — una sola vez, nunca se repite en fases posteriores.

**Entrevista (pregunta al usuario):**

| Dato | Detalle | Se usa en |
|---|---|---|
| Ámbito | Seguridad / Salud / Ambiental / Tema Libre — si viene de la tarea programada, ya se resuelve solo vía `TemasProgramados`, no preguntar de nuevo | Fase 2, Fase 3 |
| Sector/proceso constructivo | — | Fase 2, Fase 3 |
| Calificación del trabajador | no calificado / semi-calificado / calificado técnico | Fase 3 (gradualidad de la teoría) |
| IPER real (solo Seguridad) | ¿existe? (propio o generable con `construccion-iperc`) | Fase 3 — fuente primaria de "Peligros y Riesgos" si existe |
| Restricciones reales de la empresa | Solo si el usuario las confirma explícitamente — nunca se asumen | Fase 3 (`references/criterios_paliativo.md`) |
| Bifurcación temporal | Solo si hay andamios/plataformas/estructura provisional | Fase 3 (`references/bifurcacion_temporal.md`) |
| Escena de cada imagen | SIEMPRE se pregunta — único punto creativo que la automatización nunca decide sola | Fase 3 — Imagen |

**Configuración de la charla (se fija aquí, no se vuelve a preguntar después):**

- **División en partes**: mostrar el esquema al usuario y esperar confirmación, según volumen de teoría y puntos discretos de interacción con equipos/materiales distintos (`references/estilo_boletin.md`).
- **Tema visual**: por defecto, rotación automática (`references/motor_automatizacion.md` — B); el usuario puede fijar uno explícito aquí.
- **Esqueleto de secciones**: por defecto las 7 (`references/estilo_boletin.md`). El usuario puede quitar Prohibiciones y/o Recomendaciones AQUÍ si no aplican — queda fijo para toda la charla, Fase 3 ya no vuelve a decidirlo.
- **Imágenes**: regla fija, 2 por charla, siempre (incluso Tema Libre) — imagen 1 = peligro/riesgo o prohibición; imagen 2 = medida preventiva.
- **Tópico | Serie | Título**: tres campos distintos, nunca se fusionan — ver "Reglas fijas" para el detalle completo.

## Fase 2 — Consulta a la biblioteca (Supabase)

Jerarquía de fuentes, en este orden:
1. Accidente real de la empresa (`accidentes_reales`, banda roja).
2. Lección aprendida real (`lecciones_aprendidas`, banda azul/verde).
3. Buena práctica de oficio (`buenas_practicas_dimensionales`, `tipo_fuente='buena_practica'`).
4. Normativa (`buenas_practicas_dimensionales`, `tipo_fuente='norma'`) — último recurso, se cita explícitamente.

Salud/Ambiental/Tema Libre normalmente NO tienen biblioteca propia → fuente primaria pasa a ser el TdR del servicio + normativa vigente (decirlo explícitamente, no es una falla).

Además, siempre con WebSearch/WebFetch: un caso real verificable para "En las Noticias — Caso Similar". Nunca fabricar — si no hay uno confiable, se omite la sección. Una noticia que implique negativamente a la propia empresa/cliente no es citable aquí (`references/criterios_paliativo.md`).

La banda es metadato interno para elegir `tema_visual` (banda roja → "Alerta Roja") — nunca aparece como palabra en el texto.

## Fase 3 — Redacción

### Sub-bloque: Texto
Redacta el esqueleto YA definido en Fase 1 — no se vuelve a decidir qué secciones van. Reglas de voz/tono completas en `references/estilo_boletin.md`; regla de no admitir incumplimiento en `references/criterios_paliativo.md`.

- Se guarda en **dos tablas**: `charlas_doc` (base larga, descriptiva, se redacta primero) y `charlas_ppt` (sintetizada, se deriva de `charlas_doc`, nunca al revés).
- **Paridad 1:1 obligatoria**: cada `charla_id` tiene fila en ambas tablas. Hoy, por decisión del usuario (fase de prueba), solo se exporta Doc — `charlas_ppt` se inserta con `estado='pendiente'` y se completa recién cuando se pida el PPT.
- Todas las escrituras en bloque (una sola operación por tabla), nunca fila por fila.

### Sub-bloque: Imagen
Ejecuta la regla YA fijada en Fase 1 (2 imágenes, cuál es cuál) — no se repite aquí. Estructura completa de 7 bloques, croquis guía, candados y errores ya corregidos en `references/prompt_nanobanana.md`.

- **Guardar el prompt inmediatamente** en `prompts_generados` (`charla_id`, `numero_imagen`, `prompt_texto`, `tema_visual`) apenas se redacta — no esperar a la imagen ni al documento. Si se reconstruye aproximado después, marcar `[Reconstruido aprox.]`.
- **Al reasignar/dividir una charla**: si se reasigna `charla_id`/parte/`tema_visual` de un prompt ya guardado, actualizar también la paleta citada dentro del propio texto del prompt, no solo la columna `tema_visual`.
- Verifica cada imagen recibida antes de continuar (ver "Verificación de calidad" en `references/layout_docs.md`).

## Fase 4 — Registro

1. Inserta en `modulos_usados` la combinación usada (antimonotonía futura), **enlazando por `charla_id`** (nunca solo por `ambito`+`fecha` — ver `references/esquema_supabase.md`).
2. Si corresponde a una fila de `TemasProgramados`, actualízala a `estado='completo'` con el `charla_id`.
3. Actualiza `charlas_registro.estado='completo'` y `charlas_doc.estado='completo'` — charla por charla, apenas se verifica y entrega, nunca al final de la semana.
4. **Cierre semanal**: cuando esta charla completa la última pista pendiente de la semana (las 6 pistas del día_semana ya en `'completo'`), confirma el cierre y avisa al usuario qué pistas/tópicos siguen pendientes para la próxima.

## Fase 5 — Exportación

**Ruteo (decisión del orquestador, nunca de las secciones de formato):**
- Charla individual o serie → "Formato de una charla" (`references/layout_docs.md`).
- Compilado (varios días/semana/mes/cualquier periodo, N charlas) → "Formato del compilado" (`references/layout_docs.md`).

**Formato de salida** (cada uno lee de su tabla correspondiente):
- **Doc / Google Docs**: lee `charlas_doc`. Charla individual/serie → builder reutilizable (`references/motor_automatizacion.md` — A), con verificación PDF+JPEG integrada y obligatoria. Compilado → estructura de "Formato del compilado". Google Docs y `.docx` quedan ambos abiertos, sin default forzado.
- **PPT**: lee `charlas_ppt` (si `'pendiente'`, sintetiza primero desde `charlas_doc`, marca `'completo'`, recién ahí genera). Layouts en `references/layout_ppt.md`.
- **HTML**: vía motor de artifacts/Visualizer, leyendo de `charlas_doc`.

## Reglas fijas (aplican en todo el flujo)

- El ámbito puede ser Seguridad, Salud, Ambiental o Tema Libre — cada uno con su propia cadencia (ver abajo); ya no se descarta contenido de otros ámbitos.
- La banda nunca aparece como palabra en el texto de la charla.
- Nunca redactar de forma que suene a admisión de incumplimiento normativo.
- Antimonotonía: no repetir apertura/cuerpo/refuerzo/cierre ni tema visual del inmediato anterior del mismo ámbito.
- Todas las escrituras a Supabase en bloque (una sola consulta con múltiples filas), nunca fila por fila.
- Nunca fabricar un "Caso Registrado" o "En las Noticias" — si no hay fuente real, se omite la sección.
- La escena/contexto de cada imagen SIEMPRE se pregunta al usuario, incluso en el flujo automático — nunca se decide sola.
- Toda automatización (tema visual, siguiente tópico, builder de docx, cálculo de fecha) es un DEFAULT, nunca una obligación: una instrucción explícita del usuario la anula sin fricción.
- Al inicio de cada conversación sobre esta skill, siempre se revisa primero el estado real en Supabase (ver "0. Al iniciar o retomar la conversación") antes de asumir qué sigue.
- **Tópico | Serie | Título son tres campos distintos, nunca se fusionan** (regla fijada por el usuario el 29 sep 2026):
  - **`topico`** = nombre FIJO de la serie o tema, sin numeración ni subtema (ej. "Excavación de Zanjas", "Herramientas Manuales", "Golpes de Calor y Exposición Solar"). Es el kicker en mayúsculas del documento. El catálogo de tópicos es cerrado: no se inventan ni se renombran tópicos al vuelo; agregar uno nuevo requiere confirmación del usuario.
  - **`serie`** = la parte dentro del tópico, en numeral romano entre paréntesis: "(I)", "(II)", "(III)"… Vale NULL en tópicos de una sola charla (la mayoría de Salud, Ambiental y Tema Libre, y series de una sola parte).
  - **`titulo`** = el titular creativo del boletín (gancho narrativo, Heading 1 del documento). Nunca se repite el `topico` como título.
  - El subtema técnico de una parte (ej. "corte/desbaste", "entibado") NO va en `topico` ni en `serie`: se documenta en `enfoque` (descripción interna de la parte).
  - Al mostrar el roadmap o al proponer títulos, se usa SIEMPRE el formato de tres columnas `Tópico | Serie | Título` — ver "Presentación del roadmap al usuario" en "Cadencia semanal, TemasProgramados y cálculo de fecha".
- **Herramientas Manuales ≠ Herramientas de Poder Portátiles**: son dos series independientes y excluyentes. Ninguna herramienta de accionamiento motorizado (eléctrico, neumático, a batería) puede aparecer en una charla de la serie Herramientas Manuales — ni como ejemplo de peligro ni, sobre todo, como "la forma correcta/segura" de resolver un problema (error ya cometido una vez: una amoladora a batería apareció como la solución segura en una charla de herramientas manuales). Ver el Estándar SST de Herramientas Manuales si existe en la biblioteca del proyecto para la clasificación exacta.

---

## Motor de Automatización — contenido completo en `references/motor_automatizacion.md`

Se ejecuta en un momento puntual y tardío del flujo (Fase 1 para tema visual, Fase 4 y Fase 5 para registro/exportación, o al configurar la tarea programada) — nunca mientras se decide o se redacta. Por eso vive en un archivo de referencia, no aquí.

- **A. Builder reutilizable de `.docx`**: función genérica (Node.js + `docx`) que reemplaza escribir un script nuevo por charla, con verificación integrada (PDF + JPEG). Se usa en la Fase 5.
- **B. Rotación automática**: cómo se elige `tema_visual` (antimonotonía) y el siguiente tópico/serie por pista. Se usa en la Fase 1. Override manual siempre disponible.
- **C. Tarea programada semanal**: descripción de "Charla Diaria Surquillo" y el **candado de doble seguro** (obligatorio, nov. 2026): toda tarea programada que use esta skill debe incluir siempre la Fase 0 completa en su prompt, aunque no se pida explícitamente.

Contenido completo (código del builder, algoritmo exacto de rotación, texto completo del candado) → `references/motor_automatizacion.md`.

---

## Cadencia semanal, TemasProgramados y cálculo de fecha

Referencia compartida por varias fases (Fase 0 consulta `TemasProgramados`; Fase 1 necesita la cadencia; Fase 4 necesita la regla de fecha).

**Cadencia** (6 pistas en paralelo, una parte/tópico por semana en cada una — no secuencial dentro de la misma semana):

| Día | Ámbito | Detalle |
|---|---|---|
| Lunes | Seguridad | Excavación de Zanjas (pista 1) |
| Martes | Seguridad | Espacios Confinados (pista 2) |
| Miércoles | Seguridad | Trabajos en Caliente → Herramientas Manuales → Herramientas de Poder Portátiles (pista 3; al agotar una serie, continúa con la siguiente asignada en `TemasProgramados`) |
| Jueves | Salud | 1 charla/semana. ⚠ **Pendiente de revisar con el usuario**: hay 1 fila real en `TemasProgramados` con `dia_semana='Jueves'` y `tema='Seguridad'` — confirmar si es error de captura o excepción real |
| Viernes | Ambiental | 1 charla/semana, rotando 7 tópicos |
| Sábado | Tema Libre | 1 charla/semana |

**Catálogo de tópicos**: NUNCA hardcodeado en esta skill (la versión anterior listaba 34 y ya hay más de 70 reales en Supabase — quedaba obsoleta). Consulta siempre en vivo: `SELECT DISTINCT tema, topico FROM "TemasProgramados" ORDER BY tema, topico`. Es "cerrado" en el sentido de que no se inventan ni renombran tópicos al vuelo — agregar uno nuevo requiere confirmación del usuario y una fila nueva en Supabase.

**Tabla `TemasProgramados`**: columnas `tema, topico, serie, titulo, enfoque, dia_semana, estado [pendiente|en_borrador|completo|omitido], orden, charla_id`. `orden` está *scoped* por `tema`, no por `dia_semana` — al construir un `WHERE ... LIKE` para actualizar varias filas, verificar que no matchee una Parte distinta del mismo tópico (usar `=` exacto o delimitadores claros).

**Regla de cálculo de fecha real** (crítica — evita el bug de sept. 2026): cada pista avanza una fecha real **por semana calendario**, nunca varias fechas seguidas en la misma sesión.
1. Busca en `charlas_registro` la última fecha real de esa MISMA pista/serie.
2. Fecha nueva = esa fecha **+ 7 días** (mismo día de semana) — nunca la fecha de la sesión, ni consecutiva a otra pista generada en la misma conversación.
3. Semana calendario Lunes→Sábado (Domingo se salta). Si una pista ya agotó su cupo de la semana, queda en "—" hasta la siguiente, aunque otras pistas de la misma semana aún no se generaron.
4. Documento maestro adjunto manda sobre cualquier cálculo (ver Fase 0, paso 5).

**Presentación del roadmap al usuario** (tabla de 3 columnas siempre, sin fusionar campos):

| Tópico | Serie | Título |
|---|---|---|
| Excavación de Zanjas | (I) | Título 1 |
| Golpes de Calor y Exposición Solar | — | Título |

Título en negrita si ya está guardado en Supabase; marcar con ✦ si es propuesta nueva aún no guardada. Agregar columna "Fecha" al inicio si se muestra por calendario, sin alterar las tres columnas base.

## Formato del Word — contenido completo en `references/layout_docs.md`

Dos secciones de contenido puro (el ruteo entre ellas vive en la Fase 5, no ahí): **"Formato de una charla"** (estructura del documento, redacción narrativa, verificación de calidad) y **"Formato del compilado"** (N charlas, cualquier periodo, tag `PLANTILLA-COMPILADO-V1`, con los campos CONFIGURACIÓN genéricos Empresa/Sector/Servicio cuyos valores reales viven en `claude/TareaPrg-Charla.md`). Google Docs y `.docx` quedan ambos abiertos como salida, sin default forzado.

## Estilo de boletín — contenido completo en `references/estilo_boletin.md`

Boletín serio con estilo artístico. Esqueleto fijo de 7 secciones (Introducción, Teoría, Peligros y Riesgos, Medidas de Seguridad, Prohibiciones, Recomendaciones, Fuente de Referencia) con su guía de voz por sección, reglas duras transversales, criterios de división en serie, y la excepción de nombres de sección para Tema Libre.

## Criterios paliativos — contenido completo en `references/criterios_paliativo.md`

Regla de mayor riesgo legal: ninguna charla puede redactarse de forma que suene a admisión de incumplimiento normativo. Toda restricción real confirmada por el usuario se reencuadra como educación en jerarquía de controles, nunca como confesión — con ejemplos mal/bien.

## Bifurcación temporal — contenido completo en `references/bifurcacion_temporal.md`

Pregunta de entrevista (Fase 1) para charlas sobre andamios/plataformas/estructura provisional: ¿prefabricada o construida en obra? Incluye el default razonable para modo desatendido.

## Prompts de imagen — contenido completo en `references/prompt_nanobanana.md`

Estructura de 7 bloques fijos (Gemini "Nanobanana"/ChatGPT/Leonardo AI), vocabulario atómico, croquis guía con candados, y el listado de errores ya corregidos (no repetir). Se usa en la Fase 3 — Imagen, después de que el contenido ya está redactado y la escena ya fue confirmada con el usuario — nunca antes.

## Layouts de PowerPoint — contenido completo en `references/layout_ppt.md`

3 layouts de `pptxgenjs` (hoy diferido — ver Fase 3 sobre `charlas_ppt`).

## Esquema de Supabase — índice rápido (detalle completo en `references/esquema_supabase.md`)

Proyecto `biblioteca-charlas` (`anebdaahfuwjvnzvszfs`), 13 tablas:

| Tabla | Para qué |
|---|---|
| `charlas_registro` | Maestro: una fila por charla |
| `charlas_doc` / `charlas_ppt` | Contenido base largo / sintetizado, paridad 1:1 |
| `TemasProgramados` | Roadmap y estado por pista semanal |
| `estado_avance` | Control de periodos (`activo`/`en_revision`/`cerrado`) — Fase 0 |
| `modulos_usados` | Antimonotonía (tema visual usado) |
| `prompts_generados` | Texto exacto de cada prompt de imagen |
| `temas_visuales` | 5 temas con colores — nunca hardcodeados |
| `vocabulario_nanobanana` | Vocabulario atómico de prompts de imagen |
| `accidentes_reales` / `lecciones_aprendidas` / `buenas_practicas_dimensionales` | Biblioteca de contenido (Fase 2) |
| `fichas_equipo` / `hecho_mejora` | Biblioteca complementaria (`hecho_mejora` vacía, pendiente de poblar) |

**RLS**: activo en todas, sin políticas — correcto mientras el acceso sea solo vía Claude/MCP con `service_role`. **Nivel gratuito**: se auto-pausa por inactividad (esperar `COMING_UP` → `ACTIVE_HEALTHY` si hay timeout).