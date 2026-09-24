# TAXONOMÍA DEL DOMINIO — DIVISIÓN → CLASE → SUBTIPO

> Vive en `CHECKLIST ONLINE/Conocimiento/TaxonomiaDominios.md` en el repositorio `dghersi/dghersi.github.io`. Es la fuente de verdad para la skill `checklist-maquinaria` en cuanto a clasificación de equipos. Solo contiene taxonomía pura (División/Clase/Subtipo) — el detalle técnico específico de cada máquina (BloqueSets, mecanismos, hallazgos, ítems) vive en su propio `Conocimiento_<NombreDivision>.md`, no aquí.

## 1. Estructura de nivel superior

El dominio completo NO es solo "Maquinaria de Construcción": se organiza en un árbol de 3 niveles, y Maquinaria de Construcción es únicamente una de varias Divisiones.

### Criterio de clasificación (para decidir División/Clase de un equipo nuevo)

1. **Se mueve DURANTE la operación** → Herramienta de Poder Portátil (o Equipo Liviano, según tamaño/uso).
   - Ejemplo: Martillo hidráulico de uso manual → Herramienta de Poder Portátil.
2. **Permanece estático DURANTE la operación**, aunque sea transportable de un sitio a otro → Equipo Estacionario.
   - Ejemplo: Soldadora por Electrofusión (Ritmo Elektra S-V1) → siempre estática durante el ciclo de soldadura → Equipo Estacionario, no Herramienta Portátil.
3. **Es un implemento montado como acople sobre un equipo ya clasificado** → NO se clasifica aparte; se convierte en un ítem de verificación dentro del checklist del equipo anfitrión (típicamente Bloque 5, Componentes Esenciales).
   - Ejemplo: Martillo hidráulico montado como acople de una Excavadora → no tiene División propia, es un ítem del checklist de la Excavadora.

Si un equipo nuevo no encaja en ninguna División/Clase de abajo, proponer la ampliación de la taxonomía al usuario antes de continuar y, una vez aprobada, actualizar este archivo — nunca improvisar una clasificación paralela ni dejarla solo en el chat.

## 2. Las 7 Divisiones

### 2.1 Maquinaria de Construcción — 9 Clases (1,2,3,4,5,6,8,9)

- **Clase 1 – Movimiento de tierras:** excavadora, cargador frontal, motoniveladora, retroexcavadora, minicargador, bulldozer.
- **Clase 2 – Perforación y cimentación:** perforadora, pilotera.
- **Clase 3 – Fabricación y manipulación de hormigón:** mixer, bomba de concreto, miniplanta dosificadora.
- **Clase 4 – Izaje:** grúa, winche, aparejos.
- **Clase 5 – Elevación:** plataforma elevadora, elevador de personal.
- **Clase 6 – Construcción y mantenimiento de carreteras:** pavimentadora, rodillo compactador.
- **Clase 8 – Fabricación de áridos:** chancadora, zaranda.
- **Clase 9 – Fabricación de materiales de construcción:** bloquera, ladrillera.

> La antigua "Clase 7 – Trabajos especializados" fue retirada de Maquinaria de Construcción y sus equipos redistribuidos a otras Divisiones (Herramientas de Poder Portátiles / Equipos Estacionarios / Equipos Livianos), según el criterio de clasificación de la sección 1.

### 2.2 Herramientas de Poder Portátiles
Subtipos: Combustión / Neumáticas / Eléctricas / Con Pólvora / Otras.

### 2.3 Equipos Livianos
Sin sub-clasificar todavía (ej. cortadora de pavimento, vibroapisonador).

### 2.4 Equipos Estacionarios
Pendiente de clasificación exhaustiva (ej. compresora, grupos electrógenos, soldadoras estacionarias). Caso validado: Soldadora por Electrofusión Ritmo Elektra S-V1 — ver BloqueSet específico en `Conocimiento_EquiposEstacionarios.md`.

### 2.5 Herramientas Manuales
Sin desarrollar.

### 2.6 Equipos Auxiliares o Emergencia
Sin desarrollar.

### 2.7 Dragadoras — 8 Clases

- **Clase 1 – De Arrastre**
- **Clase 2 – De Cuchara o Almeja**
- **Clase 3 – De Rosario o Cangilones**
- **Clase 4 – De Pala o Retroexcavadora**
- **Clase 5 – De Succión Simple**
- **Clase 6 – De Succión con Cortador**
- **Clase 7 – De Succión en Marcha** (Draga de Arrastre por Succión)
- **Clase 8 – Neumática o de Airlift**

**Caso validado — Máquina de Balde:** División Dragadoras → Clase 1 (De Arrastre) → checklist combinado para 2 Subtipos: Recuperador de Cable y Dragadora/Cargadora de Baldes. Ver detalle técnico completo (mecanismos, roles, BloqueSet específico, ítems) en `Conocimiento_Dragadoras.md`.

**Rango de caracteres para el caso Máquina de Balde: 84-94** (excepción confirmada por el usuario al default general de 88-97).
