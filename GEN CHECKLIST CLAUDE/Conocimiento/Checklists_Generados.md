# REGISTRO DE CHECKLISTS GENERADOS

> Archivo acumulativo de la skill `checklist-maquinaria`. Vive en `GEN CHECKLIST CLAUDE/Conocimiento/Checklists_Generados.md` en el repositorio `dghersi/dghersi.github.io`. Es el **índice único** de todos los checklists que se han materializado (Excel/Google Sheets u otro formato final), con su versión vigente y su ubicación real en Google Drive — cruza División/Clase/Subtipo con el archivo de Conocimiento correspondiente (`Conocimiento_<División>.md`) y, si aplica, con el Proyecto de claude.ai donde se usó como entregable.
>
> Este archivo es genérico y cubre **todas** las Divisiones y Clases de la taxonomía (`TaxonomiaDominios.md`), no solo Dragadoras — cada fila nueva se agrega aquí sin importar la División. Se le añade una fila cada vez que un checklist queda materializado o se genera una nueva versión; las filas de versiones anteriores no se borran, se marcan `Reemplazada` en la columna Estado y se referencia la fila de la versión vigente.
>
> Este archivo responde una sola pregunta: **"¿cuál es la versión vigente de este checklist y dónde está el archivo real?"** El contenido técnico (ítems, bloques, hallazgos, criterios) vive en el `Conocimiento_<División>.md` correspondiente — este registro no lo duplica.

## Cómo usar este archivo

1. Antes de generar un checklist nuevo para un equipo, busca aquí si ya existe una fila para esa Clase/Subtipo. Si existe y está `Vigente`, parte de esa versión en vez de generar desde cero.
2. Al materializar o revisar un checklist (Excel/Sheets aprobado por el usuario), agrega o actualiza su fila: versión, fecha, estado, y el link real de Google Drive (pídele al usuario el archivo/carpeta si no lo tienes, no lo inventes).
3. Si una versión reemplaza a otra, marca la fila anterior como `Reemplazada` y dobla el enlace a la fila nueva en la columna Notas.
4. La columna "Proyecto Claude.ai" es opcional — solo se llena si ese checklist se usó como entregable dentro de un Proyecto de claude.ai específico (p. ej. el de un cliente/servicio). Si el checklist es solo conocimiento base sin cliente asociado todavía, se deja en blanco.

## Registro

| División | Clase | Subtipo / Equipo | Versión | Estado | Bloques / Ítems | Ubicación Google Drive | Proyecto Claude.ai | Última actualización | Notas |
|---|---|---|---|---|---|---|---|---|---|
| Dragadoras | Clase 1 — De Arrastre | Máquina de Balde (Recuperador de Cable + Dragadora, combinado) | V1 | Vigente | 12 Bloques, 82 ítems | [Checklist_Maquina Balde V1](https://docs.google.com/spreadsheets/d/16ZMRZ-oPTkHpWEnikoUeFnR6ZmmMseHnKY0ndAa_Gx0/edit) — carpeta Drive: `H- PROCEDIMIENTOS & ESTANDARES / 2- PCO` | SERVICIO SURQUILLO | 2026-09-25 | Contenido técnico completo en `Conocimiento_Dragadoras.md` §1-2. Confidencialidad: el Excel/checklist entregado no debe llevar nombre de cliente ni códigos internos de equipo (MPI-18, MLT-18). |

## Plantilla para fila nueva

```
| <División> | <Clase> | <Subtipo/Equipo> | V<n> | Vigente/Reemplazada/Borrador | <N Bloques, N ítems> | [<nombre archivo>](<link Drive>) — carpeta: `<ruta carpeta>` | <Proyecto Claude.ai o vacío> | <YYYY-MM-DD> | <notas> |
```
