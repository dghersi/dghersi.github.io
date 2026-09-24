# CONTEXTO DE PROYECTO — GeneradorPython

## 1. PROPÓSITO
Motor en Python (openpyxl) que genera el archivo Excel del checklist pre-operacional a partir de contenido ya validado en la skill `MasterChecklist` (Fase 1-2: ítems, bloques, criticidades, diseño visual aprobado).

Este Proyecto acumula el código real del generador a lo largo del tiempo. La skill NO genera el Excel — solo produce el contenido que este Proyecto consume.

---

## 2. ARQUITECTURA (4 CAPAS)

- **Capa 1 — Arrays de Data:** el contenido del checklist vive en estructuras de datos planas, no mezclado con lógica. Dos hojas fuente:
  - **Hoja "Data"** (columnas indexadas por NOMBRE, no por posición): `Seccion, texto, Formula, rango, Bloque, CampoVacio, CheckBoxes`.
  - **Hoja "Bloques"** (modelo relacional, para los ítems de checklist propiamente dichos, con cantidad variable de filas por máquina): correlacionada con la hoja Data vía `NroBloque` (clave foránea).
- **Capa 2 — Dimensionamiento:** cálculo de anchos de columna y altos de fila (conversión px→unidad Excel y px→pt) a partir de las dimensiones definidas en el diseño visual aprobado.
- **Capa 3 — Configuración de Celdas:** un orquestador recorre la hoja "Data" fila por fila y despacha, según el contenido de cada columna, a funciones genéricas:
  - `CrearTexto()` — texto fijo, con soporte (aún no probado) para el campo `Formula`.
  - `CrearCampoVacio()` — campos a llenar por el usuario.
  - `CrearCheckbox()` — casillas de verificación.
  - Un manejador especial para la hoja "Bloques" (dinámico, según cantidad de ítems por máquina).
- **Capa 4 — Aplicación de Presets (estilo):** pasada final y separada que aplica estilo/formato, después de que el contenido y la estructura ya existen en las celdas. Nunca se mezcla estilo con lógica de contenido (Capa 3).

Esta separación en 4 capas es la aplicación directa de la preferencia de arquitectura modular del usuario: orquestación + funciones genéricas agrupadas por tipo + datos como arrays separados de la lógica.

---

## 3. CONVENCIONES DE ESTILO (Capa 4)

- **Constantes de estilo nombradas:** `e1` ... `e13`, `Paleta1`, `Paleta2`, `e_check` — cada una agrupa fuente/tamaño/negrita/mayúsculas/color/relleno/colores de borde en un solo bloque, consumido genéricamente por `tipografia()` / `EstiloCelda()`.
- **Funciones de borde nombradas:** `b_ligero`, `b_mixto`, `b_ppal`, `b_e1` — construidas desde una fábrica común `crear_borde_horizontal()` / `b_crear()` que decide grosor de borde (perímetro vs. interior) según la posición de la celda dentro del rango del bloque.
- **Presets combinados:** `preset1` ... `preset6` — cada uno combina una función de estilo + una función de borde, y está ligado a una sección específica del documento según una tabla fija (13 secciones totales).
- **Regla de mayúscula inicial:** para el efecto "Primera Letra Mayúscula" NO usar `.capitalize()` de Python (fuerza el resto del string a minúsculas y rompe valores como "EQUIPO NO OPERATIVO" o "Resp. Fecha"). Usar el helper propio `primera_mayuscula(texto)` → `texto[0].upper() + texto[1:]`.

---

## 4. VALIDACIÓN Y HERRAMIENTAS

- Validación de fórmulas/recalculo con `recalc.py` (LibreOffice headless).
- **Advertencia conocida y aceptada:** `SEQUENCE()` es reportado como `#NAME?` por `recalc.py` — esto es una limitación del validador (LibreOffice), NO un error real. `SEQUENCE()` funciona correctamente en Excel 365 y Google Sheets, que son los entornos reales de uso. No "corregir" esto quitando `SEQUENCE()`.
- **Advertencia conocida y aceptada:** `recalc.py` puede corromper/eliminar silenciosamente bordes personalizados en celdas combinadas al re-guardar el archivo para recalcular. Workaround obligatorio: validar siempre sobre una COPIA (`cp archivo.xlsx /tmp/copia_validacion.xlsx` antes de correr `recalc.py`), y entregar al usuario el archivo original generado por openpyxl, nunca el pasado por el validador.

---

## 5. ESTADO ACTUAL — NO PRODUCTION-READY

Este generador está **incompleto**. Pendientes bloqueantes:

1. **`aplicar_presets()` es un stub vacío** — nunca conectado a `preset1`...`preset6`. El estilo final no se está aplicando realmente.
2. **Solo 4 de 13 secciones del documento están portadas** al modelo orquestador/hoja-plana (Encabezado, Frecuencia, Datos generales, Bloques). Las otras 9 secciones solo existen en un script monolítico anterior basado en funciones `sec_*`, no reincorporado al nuevo modelo.
3. **El campo `Formula` en `crear_texto()` no ha sido probado** con una fórmula real de Excel.
4. **La validación de la hoja "Bloques" no está reincorporada:** existía en una versión standalone anterior (verificar existencia de `NroBloque` referenciado, verificar que `Criticidad` sea un valor del enum permitido — ALTO/MEDIO) pero no forma parte de la función final `validar_data()`.

---

## 6. FUENTE DE CÓDIGO
Pendiente: el usuario aún no ha compartido un repositorio de GitHub para este Proyecto (a diferencia de AppWeb). Mientras no exista, el código de este generador vive únicamente como historial de conversación dentro de este Proyecto de Claude AI — no hay una fuente de verdad externa todavía.

## 7. FUENTE DE DATOS (Capa 1) — DECISIÓN: FIRESTORE, NO GOOGLE SHEETS

- **Decisión (2026-09-23):** la data de entrada de la Capa 1 (hoja "Secciones y Campos" + hoja "Bloques") deja de vivir en Google Sheets. El usuario no quiere depender de Google Sheets para guardar la data de los scripts.
- **Reemplazo elegido:** Firebase Firestore, editado directamente desde VS Code con la extensión gratuita **Firebase Explorer Plus** (`Jouca.firebase-explorer-plus`, Visual Studio Marketplace) — editor de documentos Firestore vía JSON, CRUD de documentos/colecciones/subcolecciones, export/import de la base completa en JSON. Se descartó DBeaver porque el driver de Firestore solo existe en sus ediciones de pago (Lite/Enterprise/Ultimate), no en la edición Community gratuita.
- **Origen del modelo de datos real (ya existente):** hoja de Google Sheets `data_items_prueba` (https://docs.google.com/spreadsheets/d/1PUHUmnihaSQIxGKY71HunNGqNGqsNqIqHjTgCX6R69I/edit), con el caso de prueba Excavadora. Estructura confirmada, a migrar tal cual a Firestore:
  - Hoja "Secciones y Campos" → columnas: `Seccion, texto, Formula, rango, Bloque (si/No), CampoVacio, CheckBoxes`.
  - Hoja "Bloques" → columnas: `NroBloque, Descripcion, Criticidad, Riesgo, Accion`.
- **Esquema Firestore definido (2026-09-23):**
  ```
  maquinas (colección)
   └── <id_maquina> (documento, ej. "excavadora")   — metadata: nombre, clase, codigo, version, paginas, fecha
        secciones_campos (subcolección) — un documento por fila de la antigua hoja "Secciones y Campos"
             campos: seccion (int), texto (string), formula (string|null), rango (string|null), bloque (bool), campoVacio (string|null), checkBoxes (string|null)
        bloques (subcolección) — un documento por fila de la antigua hoja "Bloques"
             campos: nroBloque (int), descripcion (string), criticidad (string: ALTO|MEDIO), riesgo (string), accion (string)
  ```
  Este esquema, un documento `maquinas/<id_maquina>` por equipo, es directamente compatible con el patrón `Data/<Equipo>` que ya usa el Proyecto AppWeb — misma convención de "un contenedor de datos por máquina" en ambos proyectos.
- **Migración de la data de prueba: ✅ COMPLETADA (2026-09-23).** Los 29 documentos (`maquinas/excavadora` + 23 `secciones_campos` + 5 `bloques`) fueron importados exitosamente al proyecto Firebase `checklist-gsheet`, vía script Node.js (`importar.js`, API modular `firebase-admin/app` + `firebase-admin/firestore`) ejecutado desde Cloud Shell. Se resolvieron dos problemas en el camino: (1) `admin.credential.applicationDefault()` fallaba porque el paquete instalado usa la API modular nueva — se corrigió usando `initializeApp`/`applicationDefault` importados de `firebase-admin/app`; (2) error `5 NOT_FOUND` porque la base de datos Firestore del proyecto no había sido creada todavía — se resolvió creándola desde Firebase Console (Firestore Database → Crear base de datos) antes de reintentar.
- **Estado real de Firestore ahora:** proyecto `checklist-gsheet`, colección `maquinas` con documento `excavadora`, subcolecciones `secciones_campos` (23 docs) y `bloques` (5 docs) — datos de PRUEBA únicamente, no el checklist completo de 38 ítems.
- **Pendiente:** modificar el script Python para leer de Firestore (`google-cloud-firestore`, Admin SDK) en vez de openpyxl/Sheets — punto exacto de la Capa 1 a reemplazar. No se ha tocado el código todavía.
- Esta migración es independiente de los 4 pendientes bloqueantes de la sección 5 — puede resolverse antes, después o en paralelo a ellos.
