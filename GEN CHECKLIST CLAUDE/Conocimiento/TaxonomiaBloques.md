# BLOQUES DE CHECKLIST — ESTÁNDAR Y MODELO BLOQUESET

## 0. Protocolo de fuente de datos (leer primero)

Este archivo distingue dos tipos de contenido, con reglas de fuente distintas:

**(a) El modelo genérico (secciones 1-2 de aquí abajo)** — los 9 Bloques estándar y el mecanismo relacional BloqueSet. Es método estable, poco volátil. Fuente primaria en GitHub: `dghersi/dghersi.github.io/GEN CHECKLIST CLAUDE/Conocimiento/TaxonomiaBloques.md`. Si no existe todavía, usa las secciones 1-2 de este archivo como respaldo.

**(b) El historial técnico específico por División (sección 3 en adelante)** — BloqueSets particulares, mecanismos, hallazgos de campo, mapeo de hallazgos a ítems. Esto crece de forma **acumulativa por División**, no en un solo archivo genérico: cada División tiene su propio archivo en GitHub, `Conocimiento/Conocimiento_<NombreDivision>.md` (ej. `Conocimiento_Dragadoras.md`, `Conocimiento_EquiposEstacionarios.md`, `Conocimiento_MaquinariaConstruccion.md`), que se va llenando conforme se trabaja cada equipo de esa División — nunca se reemplaza, se le añade contenido nuevo cada vez que se valida un caso.

1. Antes de trabajar el checklist de un equipo de una División dada, intenta leer su `Conocimiento_<NombreDivision>.md` correspondiente en GitHub. Si existe, es la fuente vigente para esa División — más completa y más reciente que lo que haya aquí.
2. Si ese archivo todavía no existe en GitHub, usa el contenido de la sección 3 en adelante de este archivo como respaldo para esa División, y avísale al usuario que ese `Conocimiento_<NombreDivision>.md` sigue pendiente de crear.
3. Cuando el usuario valide un BloqueSet o un hallazgo técnico nuevo para una División: si su `Conocimiento_<NombreDivision>.md` ya existe en GitHub, añádelo ahí (nunca lo reemplaces — es historial acumulativo). Si todavía no existe, añádelo a la sección correspondiente de este archivo y dile al usuario que sigue pendiente de migrar cuando se cree ese archivo en GitHub.

## 1. Bloques estándar de checklist (BloqueSet por defecto)

Aplican, con ajustes menores por Clase, a la mayoría de equipos de Maquinaria de Construcción:

1. **Bloque 1:** Entorno, EPP y condiciones previas.
2. **Bloque 2:** Cabina, Visibilidad y señalización.
3. **Bloque 3:** Prueba funcional / en vacío y Condiciones de Operación.
4. **Bloque 4:** Sistema hidráulico & Sistema eléctrico.
5. **Bloque 5:** Componentes Esenciales (estructura principal, pluma/brazo/mástil, elementos de desgaste, pines).
6. **Bloque 6:** Sistemas de Control (mando, frenos, elementos de bloqueo/interlocks de seguridad, estabilizadores cuando aplique).
7. **Bloque 7:** Sistema de Traslación / Apoyo (neumáticos, orugas, estabilizadores, chasis).
8. **Bloque 8:** Equipo y Sistema de Emergencia.
9. **Bloque 9:** Estacionamiento y Aseguramiento.

## 2. Modelo relacional BloqueSet (para permitir bloques distintos por Clase/Subtipo)

No todo equipo usa el BloqueSet estándar completo. El modelo es muchos-a-muchos:

```
BloqueSet(id, nombre)
Maquina(id, nombre, division, clase, subtipo, bloqueset_id)
```

Cualquier Clase/Subtipo con BloqueSet distinto al estándar se documenta en el `Conocimiento_<NombreDivision>.md` de su División (sección 0.b) — no forzar los 9 Bloques genéricos, y no acumular ese detalle aquí.

---

## 3. Conocimiento_MaquinariaConstruccion — respaldo local (GitHub aún no creado)

### 3.1 Caso validado: Excavadora / Retroexcavadora (Clase 1)

Checklist combinado de 38 ítems, ajustado para que un mismo formulario sirva a ambos equipos usando N/A donde un ítem no aplica a uno de los dos. Usado como caso de prueba para la migración de datos a Firestore (ver `Proyecto_GeneradorPython_Contexto.md`).

Diferencias técnicas resueltas:
- **Sistema de Traslación:** orugas (Excavadora) vs. llantas + presión + pernos (Retroexcavadora).
- **Sistemas de Control:** freno de servicio (Retroexcavadora) vs. control de traslación/freno hidrostático (Excavadora); freno de parqueo común a ambos; gatos estabilizadores exclusivos de Retroexcavadora (ubicados en este bloque, no en Sistema de Traslación).
- **Componentes Esenciales:** cucharón/pines/boom frontal aplica a ambos; brazo excavador trasero exclusivo de Retroexcavadora.
- **Cabina:** ítem de asiento giratorio 180° exclusivo de Retroexcavadora.

## 4. Conocimiento_EquiposEstacionarios — respaldo local (GitHub aún no creado)

### 4.1 BloqueSet específico: Soldadora por Electrofusión (Ritmo Elektra S-V1)

El BloqueSet estándar no aplica tal cual; se definió:

- **Entorno, EPP y condiciones previas** (se mantiene, incluye lo que antes se proponía como "Condiciones de Zanja/Trinchera").
- **Seguridad Eléctrica** (reemplaza al genérico "Sistema hidráulico y eléctrico").
- **Sistema Hidráulico** (separado de Seguridad Eléctrica).
- **Trazabilidad y Registro de Datos** (nuevo — pendiente de definir ítems específicos).
- Se excluyen los bloques de Cabina/Visibilidad y Traslación (no aplican a este equipo).

## 5. Conocimiento_Dragadoras — respaldo local (GitHub aún no creado)

> Cuando se cree `Conocimiento/Conocimiento_Dragadoras.md` en GitHub, todo el contenido de esta sección 5 migra ahí tal cual, y este archivo deja de ser la fuente para esta División (solo queda como respaldo si GitHub deja de ser accesible). Nuevos hallazgos sobre Dragadoras que se validen después de esa migración se añaden directamente en GitHub, no aquí.

### 5.1 BloqueSet

**Actualizado (24/09/2026):** Dragadoras NO usa el BloqueSet estándar de 9 Bloques. El caso Máquina de Balde tiene un BloqueSet específico de **10 Bloques** (separa Sistema Mecánico y Sistema Eléctrico en dos bloques propios, en vez de un solo "hidráulico & eléctrico" — la máquina no tiene sistema hidráulico). El detalle completo y vigente de los 10 Bloques, con los 64 ítems ya validados, está en `Conocimiento_Dragadoras.md` sección 2 (GitHub) — no se duplica aquí. Ver `1-Taxonomia_dominio.md` sección 2.7 para el detalle de la clasificación y la regla de etiquetado `[Nombre del Subtipo]` (en este caso, columna `Aplica`, no etiqueta embebida — ver precedente documentado en `Conocimiento_Dragadoras.md`).

### 5.2 Caso técnico validado: Máquina de Balde (Clase 1 — De Arrastre)

Hallazgos de campo confirmados por el usuario (informe propio de inspección N°001-SST-2020 + fotos anotadas, 18/09/2026) que determinan directamente varios ítems de criticidad **ALTO** del checklist. Fuente narrativa completa: documento de proyecto `claude/maquina-balde-freno-desacople.md` — consultarlo para el detalle completo; aquí solo el resumen operativo para generar el checklist.

**Nomenclatura y roles** (para atribuir correctamente la "Acción Obligatoria" de cada ítem):
- **Recuperador de Cable** ("haladora", Subtipo A): winche, tambor, cable, los 3 mecanismos de abajo, y palanca de cambios.
- **Dragadora/Cargadora de Baldes** (Subtipo B): carga y descarga el balde (6"-22"), con su propio sistema de fajas y engranajes.
- **Operador:** único que interviene sobre la máquina — enciende/apaga motor, acciona freno/embrague/encroche/cambios, maneja el cable, e interviene manualmente si el balde se atasca. No delega estas acciones.
- **Ayudante:** solo dos tareas, siempre a nivel de pista, nunca sobre la máquina — (1) jalar cadena/cable guía en superficie, (2) recoger sedimentos del balde una vez que ya está a nivel de suelo. Nunca toca freno, embrague, encroche, cambios, ni el balde mientras está en el aire o trabado.

**Nota sobre numeración de Bloque en esta sección 5.2:** las menciones de "Bloque N" de aquí en adelante corresponden al modelo genérico de 9 Bloques vigente cuando se redactó este resumen narrativo, y ya no coinciden con la numeración real del BloqueSet de 10 Bloques finalmente validado (sección 5.1). El resumen sigue siendo válido como contexto técnico (mecanismos, roles, hallazgo crítico) — pero para saber en qué Bloque/ítem específico vive cada hallazgo, usar `Conocimiento_Dragadoras.md` sección 2.1 (tabla completa de 64 ítems), no los números de Bloque mencionados abajo.

**Tres mecanismos del eje del tambor** (Recuperador de Cable) — base de los ítems de Bloque 6 (Sistemas de Control) [numeración antigua, ver nota arriba]:
1. **Palanca de Freno** (tipo cinta, jalar hacia el costado): frena por rozamiento sobre el tambor. **No tiene trinquete ni seguro propio** — solo frena mientras la mano la sostiene, salvo aseguramiento externo (cadena).
2. **Palanca de embrague por tensor de faja** (jalar hacia afuera): acopla la transmisión motor→eje transversal (palanca de cambios).
3. **Sistema de encroche/desencroche en dos tiempos** (girar el dado, luego jalarlo): desacopla el piñón, dejando el tambor libre para soltar cable más rápido. Requiere las dos manos — el operador no puede sostener el freno con una mano y encrochar con la otra al mismo tiempo.

**Hallazgo crítico** — determina ítems ALTO en Bloque 8 (Emergencia):
> Conclusión del Informe N°001-SST-2020: **ni la palanca de freno ni la de embrague (tensor de faja) son un sistema de parada confiable.** Ante un atrapamiento, la única parada real es apagar el motor — mando poco visible, trabajador más cercano normalmente a 50 m.

Consecuencia directa para el checklist: cualquier ítem que dé a entender que el freno o el embrague detienen la máquina de forma confiable es incorrecto. Los ítems preventivos de Bloque 8 deben apuntar a verificar el aseguramiento externo del freno (cadena) y la accesibilidad/visibilidad del mando de apagado del motor — no a la fiabilidad del freno en sí.

**Secuencia crítica de re-encroche** (fuente para un ítem de Bloque 6 y su Acción Obligatoria): al revertir el sentido de tiro con el tambor desencrochado: (1) confirmar con el otro operario que deje de jalar, (2) palanca de cambios en neutro, (3) activar el freno **y trabarlo con cadena** (no tiene trinquete), (4) recién con el tambor detenido, encrochar a dos manos, (5) liberar freno y accionar embrague en el nuevo sentido.

**Riesgo específico a verificar en el checklist:** en algunas unidades la palanca de cambios tiene juego y puede salirse de neutro sola por su propio peso — si ocurre durante el paso (4) de arriba (dos manos ocupadas, tambor solo sostenido por el freno trabado), una activación accidental del embrague sí transmitiría fuerza al tambor. Esto justifica un ítem específico de criticidad ALTO: "verificar que la palanca de cambios no presente juego / permanezca en neutro de forma estable" (Bloque 6).

**Otros hallazgos de inspección → mapeo directo a ítems del checklist:**
- Sin guarda completa en fajas y ejes de transmisión → ítem Bloque 5/6, criticidad ALTO.
- Sin sistema de cable guía (atascos, reenrollado irregular) → ítem Bloque 5.
- Sin polea loca en la Dragadora (mayor riesgo de contacto) → ítem Bloque 5, `[Dragadora/Cargadora de Baldes]`.
- Palanca de cambios mal ubicada (interior de la máquina, cerca del centro de gravedad, obliga a inclinarse cerca de partes en movimiento) → ítem Bloque 2 o 6.
- Anillo de freno desalineado en posición de descanso → ítem Bloque 6, criticidad ALTO.
- Palanca de freno ubicada cerca del punto de desenclavado (riesgo de accionamiento accidental) → ítem Bloque 6.
- Sin parada de emergencia ni interlock de fábrica en ninguna de las dos máquinas → ítem Bloque 8, criticidad ALTO.
- Tubo de escape cerca del punto de encendido del motor → ítem Bloque 1.
- Panel de encendido sin indicadores de operación visibles → ítem Bloque 2.
- Sin extintor PQS, sin cintas retroreflectivas ni luces reglamentarias → ítem Bloque 1/8.

**Regla cruzada con la skill `examen-sst-actividad`:** para cualquier examen SST de esta actividad (no parte del checklist en sí, pero relevante si el usuario pide ambos documentos): dificultad mínima **Muy Difícil** siempre, sin ofrecer Sencillo/Difícil por defecto — confirmado por el usuario por la criticidad de la actividad. No corresponde a esta skill generar el examen (eso lo hace `examen-sst-actividad`), pero si el usuario pide ambos en secuencia, avísale de esta regla para que no se pierda al pasar de una skill a otra.