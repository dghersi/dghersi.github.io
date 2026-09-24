# CONOCIMIENTO — DIVISIÓN: DRAGADORAS

> Archivo acumulativo de la skill `checklist-maquinaria` para la División **Dragadoras**. Vive en `CHECKLIST ONLINE/Conocimiento/Conocimiento_Dragadoras.md` en el repositorio `dghersi/dghersi.github.io`. Se le añade contenido nuevo cada vez que se valida un caso, BloqueSet o máquina adicional de esta División — nunca se reemplaza. Mientras este archivo no exista en GitHub, la skill usa como respaldo la sección 5 de `references/2-Taxonomia_bloques.md`; en cuanto se suba aquí, este archivo pasa a ser la fuente vigente para Dragadoras.
>
> La lista de las 8 Clases de la División (taxonomía pura) NO vive aquí — está en `1-Taxonomia_dominio.md` / `Conocimiento/TaxonomiaDominios.md`. Este archivo solo contiene lo específico de cada máquina/caso dentro de la División: BloqueSets, ítems, mecanismos, hallazgos.

## 1. Caso: Máquina de Balde (Clase 1 — De Arrastre)

Checklist combinado para 2 Subtipos: **Recuperador de Cable** y **Dragadora/Cargadora de Baldes**, ambas trabajadas siempre en pareja (una en cada buzón del tramo).

### 1.1 Nomenclatura y roles

- **Recuperador de Cable** ("haladora"): winche, tambor, cable, los 3 mecanismos de la sección 1.2, y palanca de cambios.
- **Dragadora/Cargadora de Baldes**: carga y descarga el balde (6"-22"), con su propio sistema de fajas y engranajes.
- **Operador:** único que interviene sobre la máquina — enciende/apaga motor, acciona freno/embrague/encroche/cambios, maneja el cable, e interviene manualmente si el balde se atasca (aunque la máquina siga encendida, riesgo real observado). No delega ninguna de estas acciones en el ayudante.
- **Ayudante:** función acotada a dos tareas, ambas en superficie (nivel de pista), nunca sobre la máquina: (1) ayudar a jalar la cadena o el cable guía a nivel de pista, y (2) coger el balde para retirar sedimentos una vez que ya está a nivel del suelo. Nunca toca freno, embrague, encroche, cambios, ni el balde mientras está en el aire o trabado.

### 1.2 Tres mecanismos del eje del tambor (Recuperador de Cable)

Todos accionados por el operador, en la misma zona del eje del tambor — base de los ítems del Bloque 7 (Sistemas de Control):

1. **Palanca de Freno** (tipo cinta, jalar hacia el costado): frena por rozamiento sobre el tambor. **No tiene trinquete ni seguro propio** — solo frena mientras la mano la sostiene, salvo aseguramiento externo con cadena.
2. **Palanca de embrague por tensor de faja** (jalar hacia afuera): acopla la transmisión motor→eje transversal (palanca de cambios).
3. **Sistema de encroche/desencroche en dos tiempos** (girar el dado, luego jalarlo): desacopla el piñón, dejando el tambor libre para soltar cable más rápido. Requiere las dos manos.

**Motivo del desenclavado:** liberar el tambor para que el cable se suelte/pague más rápido que a través del tren de engranajes acoplado.

### 1.3 Hallazgo crítico (Informe N°001-SST-2020, conclusión c.v)

> "Se deja asentado que el Tensor de Faja de transmisión o la Palanca de Freno **NO ES UN SISTEMA DE PARADA**. Se concluye que, en caso de atrapamiento de un personal, el método de desactivación sería el apagado del motor de fuerza cuyo sistema de accionamiento no se encuentra muy visible. Aparte el tiempo de desactivación o apagado tomaría mucho tiempo debido que el trabajador más cercano se encontraría siempre a 50 metros."

**Consecuencia para el checklist (ya aplicada en el Bloque 7 y 9 abajo):** ningún ítem presenta el freno o el embrague como parada de emergencia confiable — el mando de apagado del motor es el único método real, y su visibilidad/accesibilidad es lo que se verifica.

**Atrapamiento ya en curso:** no existe secuencia correcta evaluable ahí (el freno solo lo acciona la misma persona operando, que normalmente sería la atrapada) — por eso el checklist es enteramente preventivo, nunca reactivo.

### 1.4 Secuencia crítica de re-encroche

Al revertir el sentido de tiro con el tambor desencrochado: (1) confirmar con el otro operario que deje de jalar, (2) palanca de cambios en neutro, (3) activar el freno y trabarlo con cadena, (4) recién con el tambor detenido, encrochar a dos manos, (5) liberar freno y accionar embrague en el nuevo sentido.

**Riesgo específico (base del ítem B7-5, criticidad ALTO):** en algunas unidades la palanca de cambios tiene juego y puede salirse de neutro sola por su propio peso — si ocurre durante el paso (4), una activación accidental del embrague sí transmitiría fuerza al tambor con el operador con ambas manos cerca del punto de enganche del piñón.

---

## 2. BloqueSet específico validado: Máquina de Balde (10 Bloques)

**Excepción al BloqueSet estándar de 9 Bloques** (ver `2-Taxonomia_bloques.md` sección 1): este caso separa el Sistema Mecánico y el Sistema Eléctrico en dos bloques distintos (Bloque 4 y 5), en vez de combinarlos en un solo "Sistema hidráulico & eléctrico" — justificado porque la máquina no tiene sistema hidráulico, y los hallazgos eléctricos (panel de encendido, mando de apagado del motor) tienen entidad propia y crítica suficiente para no diluirse dentro de lo mecánico. Esto corre el resto de los bloques un puesto respecto al estándar:

1. Entorno, EPP y Ergonomía del Punto de Operación
2. Visibilidad y Señalización
3. Prueba Funcional / en Vacío
4. Sistema Mecánico
5. Sistema Eléctrico
6. Componentes Esenciales
7. Sistemas de Control (freno, embrague, encroche, cambios)
8. Sistema de Traslación por Remolque
9. Equipo y Sistema de Emergencia
10. Estacionamiento y Aseguramiento

**Columna "Aplica":** este BloqueSet usa una columna separada `Aplica` (Ambas / Recuperador de Cable / Dragadora) en el ítem, en vez de la etiqueta `[Nombre del Subtipo]` embebida en el texto — formato específico de este caso, documentado aquí para que quede como precedente si se replica en otro caso de Subtipos combinados.

**Nota de formato de ítem:** el texto de "Ítem de Verificación" en este BloqueSet no sigue el rango de 84-94 caracteres de la regla general — queda pendiente decidir si se ajusta o si este caso adopta su propio rango, como ya ocurrió una vez con el rango 84-94 frente al default 88-97.

### 2.1 Checklist completo — Máquina de Balde

#### BLOQUE 1 — Entorno, EPP y Ergonomía del Punto de Operación

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Área de maniobra (zona de peligro del tambor/cable) libre de personal ajeno | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | Despejar antes de iniciar |
| 2 | Comunicación/contacto establecido con el operador de la máquina pareja del mismo tramo | Ambas | ALTO | ATRAPAMIENTO / DESCOORDINACIÓN DE TIRO | No iniciar sin coordinación previa |
| 3 | Plataforma/borde del buzón estable, sin riesgo de hundimiento o colapso | Ambas | ALTO | CAÍDA A DISTINTO NIVEL | No operar, evaluar plataforma |
| 4 | Casco, chaleco, calzado de seguridad y guantes en uso | Ambas | MEDIO | — | Corregir antes de iniciar |
| 5 | Punto de operación (palancas de freno, embrague, encroche, cambios) libre de grasa u obstáculos que dificulten el agarre firme | Ambas | MEDIO | RESBALO DE MANO EN PALANCA | Limpiar antes de operar |
| 6 | Espacio alrededor de las palancas despejado, sin necesidad de posturas forzadas para alcanzarlas | Ambas | MEDIO | TRASTORNO ERGONÓMICO / ATRAPAMIENTO | Despejar el entorno de la palanca |

#### BLOQUE 2 — Visibilidad y Señalización

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Pictogramas de riesgo (atrapamiento, aplastamiento) visibles y legibles en la máquina | Ambas | MEDIO | — | Reponer señalización |
| 2 | Código de colores en partes peligrosas (freno, embrague, tambor, faja) visible, sin desgaste | Ambas | MEDIO | — | Repintar/reponer código de colores |
| 3 | Flechas o marcas de sentido de accionamiento en palancas de freno, embrague y encroche legibles | Ambas | MEDIO | ACCIONAMIENTO INCORRECTO | Reponer marcas antes de operar |
| 4 | Cintas reflectivas en el perímetro de la máquina en buen estado | Ambas | BAJO | ATROPELLO / COLISIÓN | Reponer cintas |
| 5 | Luces estroboscópicas operativas según MTC (si hay trabajo nocturno o cercano a vía) | Ambas | ALTO | ATROPELLO POR VEHÍCULO | No operar en horario nocturno sin luces |
| 6 | Rótulo identificando cada palanca (freno / embrague / encroche / cambios) legible | Ambas | MEDIO | ACCIONAMIENTO INCORRECTO | Reponer rotulado |

#### BLOQUE 3 — Prueba Funcional / en Vacío

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Arranque del motor sin anomalías ni ruidos extraños | Ambas | MEDIO | DAÑO AL MOTOR | No operar, reportar a mantenimiento |
| 2 | Palanca de freno responde y frena por rozamiento en vacío (sin carga) | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 3 | Palanca de embrague (tensor de faja) presiona el rodillo correctamente en vacío | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 4 | Encroche/desencroche completa sus dos tiempos (girar + jalar) sin resistencia anormal | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 5 | Palanca de cambios entra y sale de neutro/marcha sin trabarse | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 6 | Sistema de fajas/engranajes de carga y descarga del balde sin ruido anormal en vacío | Dragadora | MEDIO | ATRAPAMIENTO EN MECANISMO | No operar, reportar |

#### BLOQUE 4 — Sistema Mecánico

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Cinta de freno sin desgaste excesivo, grietas ni contaminación de grasa/aceite | Recuperador de Cable | ALTO | FALLA DE FRENADO | Retirar de servicio |
| 2 | Anillo de freno correctamente alineado en su posición de descanso | Recuperador de Cable | ALTO | FALLA DE FRENADO | No operar hasta realinear |
| 3 | Faja de transmisión del embrague sin cortes, deshilachado ni deslizamiento excesivo | Recuperador de Cable | ALTO | PÉRDIDA DE TRANSMISIÓN | Retirar de servicio |
| 4 | Rodillo tensor del embrague gira libre, sin juego excesivo | Recuperador de Cable | MEDIO | FALLA DE ACOPLE | No operar, reportar |
| 5 | Dado de encroche (azul-amarillo) sin fisuras; traba correctamente en ambos tiempos | Recuperador de Cable | ALTO | DESACOPLE INVOLUNTARIO | No operar hasta reparación |
| 6 | Piñón de acople del encroche sin dientes rotos ni desgaste excesivo | Recuperador de Cable | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 7 | Cable de acero sin dobleces (kinks), hebras rotas visibles ni corrosión excesiva | Ambas | ALTO | ROTURA DE CABLE / CHICOTAZO | Retirar de servicio |
| 8 | Tambor sin deformaciones ni grietas visibles | Ambas | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 9 | Guardas de fajas y ejes de transmisión instaladas y completas | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar sin guardas instaladas |
| 10 | Sistema de cable guía presente y funcional | Ambas | MEDIO | ATASCO / REENROLLADO IRREGULAR | No operar, reponer guía |
| 11 | Polea loca instalada y en buen estado | Dragadora | MEDIO | CONTACTO CON OPERADOR | No operar, reponer polea |
| 12 | Sistema de fajas y engranajes de carga/descarga del balde sin desgaste ni juego excesivo | Dragadora | ALTO | CAÍDA DE BALDE / ATRAPAMIENTO | No operar hasta reparación |

#### BLOQUE 5 — Sistema Eléctrico

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Batería con terminales sin corrosión, bien fijada | Ambas | MEDIO | CORTOCIRCUITO | Reportar antes de encender |
| 2 | Cableado del panel de encendido sin exposición de conductores | Ambas | ALTO | CONTACTO ELÉCTRICO DIRECTO | No operar hasta reparación |
| 3 | Panel de encendido con indicadores de operación visibles y funcionales | Ambas | MEDIO | FALLA NO DETECTADA A TIEMPO | Reportar antes de operar |
| 4 | Mando de apagado del motor visible, identificado y accesible | Ambas | ALTO | RETRASO EN PARADA DE EMERGENCIA (único método real de parada) | No operar hasta señalizar/reubicar el mando |
| 5 | Sistema de encendido sin cercanía peligrosa al tubo de escape | Ambas | MEDIO | RIESGO TÉRMICO / QUEMADURA | Reportar a mantenimiento |

#### BLOQUE 6 — Componentes Esenciales

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Eje del tambor sin holgura anormal | Recuperador de Cable | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 2 | Pines y bocinas de sujeción del tambor sin desgaste excesivo | Recuperador de Cable | ALTO | FALLA ESTRUCTURAL | No operar, reportar a mantenimiento |
| 3 | Anclaje de la estructura del winche sin fisuras ni deformaciones | Recuperador de Cable | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 4 | Balde (6" a 22") sin grietas, deformaciones ni bordes cortantes | Dragadora | MEDIO | CORTE / CAÍDA DE CARGA | No operar hasta reparación |
| 5 | Ganchos/eslabones de sujeción del balde con seguro y sin desgaste | Dragadora | ALTO | CAÍDA DE BALDE | Retirar de servicio |

#### BLOQUE 7 — Sistemas de Control (freno, embrague, encroche, cambios)

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Palanca de freno responde al accionarla (función de fricción; no se evalúa ni se usa como parada de emergencia) | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 2 | Medio de aseguramiento externo (cadena) disponible para trabar la palanca de freno, ya que no cuenta con trinquete propio | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO (freno se libera solo al soltar la mano) | No operar sin cadena de aseguramiento disponible |
| 3 | Palanca de embrague (tensor de faja) responde correctamente al accionarla hacia afuera | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 4 | Encroche/desencroche en dos tiempos funciona correctamente, sin resistencia anormal | Recuperador de Cable | ALTO | ATRAPAMIENTO EN MECANISMO (maniobra a dos manos) | No operar hasta reparación |
| 5 | Palanca de cambios sin juego: no se sale de neutro por su propio peso | Recuperador de Cable | ALTO | TRANSMISIÓN DE FUERZA INVOLUNTARIA AL TAMBOR | NO APTO PARA OPERAR. Retirar de servicio |
| 6 | Palanca de cambios: espacio alrededor despejado para reducir posturas forzadas al operarla | Recuperador de Cable | MEDIO | ATRAPAMIENTO / TRASTORNO ERGONÓMICO | Despejar el entorno de la palanca |
| 7 | Palanca de freno ubicada a una distancia segura del punto de desenclavado (no se acciona accidentalmente al encrochar/desencrochar) | Recuperador de Cable | MEDIO | ACCIONAMIENTO ACCIDENTAL DEL FRENO | Reportar a mantenimiento |

#### BLOQUE 8 — Sistema de Traslación por Remolque

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Ruedas sin cortes, desgaste irregular ni objetos incrustados | Ambas | MEDIO | REVENTÓN DE LLANTA | Retirar de servicio, notificar mantenimiento |
| 2 | Punto de remolque/enganche sin deformaciones, con seguro/pasador instalado | Ambas | ALTO | DESENGANCHE EN TRÁNSITO | No trasladar hasta reparación |
| 3 | Pin de aseguramiento de remolque presente y en buen estado | Ambas | ALTO | DESENGANCHE EN TRÁNSITO | No trasladar sin pin de seguro |
| 4 | Máquina calzada/asegurada contra desplazamiento involuntario en su posición de trabajo | Ambas | ALTO | DESPLAZAMIENTO NO CONTROLADO | Calzar antes de operar |

#### BLOQUE 9 — Equipo y Sistema de Emergencia

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | 01 Extintor portátil vigente y accesible | Ambas | MEDIO | PROPAGACIÓN DE INCENDIO | Informar sobre necesidad de renovación |
| 2 | 01 Medidor/Detector de gases portátil operativo y calibrado | Ambas | ALTO | ATMÓSFERA PELIGROSA (asfixia/explosión) | No ingresar a espacio confinado; informar necesidad de calibración/renovación |
| 3 | 01 Botiquín de primeros auxilios completo y accesible | Ambas | MEDIO | — | Informar sobre elementos faltantes |
| 4 | 01 Trípode de rescate disponible y operativo | Ambas | ALTO | RESCATE NO DISPONIBLE ANTE ATRAPAMIENTO | No operar sin trípode disponible |
| 5 | 01 Kit antiderrame (cubeta de arena o salchicha absorbente) | Ambas | MEDIO | DERRAME DE HIDROCARBURO | Informar sobre necesidad de renovación o faltante |
| 6 | Conos de señalización de vía (si aplica trabajo cercano a tránsito) | Ambas | MEDIO | ACCIDENTES VEHICULARES | Informar sobre necesidad de renovación o faltante |
| 7 | Mando de apagado manual del motor identificado y señalizado (no existe parada de emergencia ni interlock de fábrica) | Ambas | ALTO | RETRASO EN PARADA ANTE ATRAPAMIENTO | No operar hasta señalizar el mando |

#### BLOQUE 10 — Estacionamiento y Aseguramiento

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | Motor apagado y llave/mando retirado al finalizar | Ambas | ALTO | ARRANQUE NO AUTORIZADO | Corregir antes de retirarse |
| 2 | Palanca de freno trabada con cadena (u otro aseguramiento) al dejar la máquina | Recuperador de Cable | ALTO | GIRO INVOLUNTARIO DEL TAMBOR | No dejar la máquina sin trabar el freno |
| 3 | Palanca de cambios en neutro al finalizar | Recuperador de Cable | ALTO | TRANSMISIÓN DE FUERZA INVOLUNTARIA | Corregir antes de retirarse |
| 4 | Encroche desacoplado o tambor sin tensión de carga al finalizar | Recuperador de Cable | MEDIO | TENSIÓN RESIDUAL EN CABLE | Corregir antes de retirarse |
| 5 | Máquina calzada/asegurada contra desplazamiento (ruedas + punto de remolque) | Ambas | ALTO | DESPLAZAMIENTO NO CONTROLADO | Corregir antes de retirarse |
| 6 | Cable de acero recogido y sin tensión residual | Ambas | MEDIO | CHICOTAZO / ATRAPAMIENTO | Corregir antes de retirarse |

### 2.2 Detalle técnico — Extintor portátil (SI/NO)

| Campo | Criterio |
|---|---|
| Tipo/capacidad | PQS clase ABC (6 lbs / 9 lbs) |
| Manómetro | Rango verde |
| Vigencia | Recarga vigente |
| Precinto | Intacto |
| Fijación | Soporte fijo, señalizado |

### 2.3 Detalle normativo — Botiquín (R.D. MTC) (SI/NO)

| Campo | Criterio |
|---|---|
| Antisépticos | Alcohol, agua oxigenada, jabón (limpios) |
| Curación | Gasas, esparadrapo, vendas, algodón (limpios, no contaminados) |
| Instrumental | Tijeras punta roma, guantes |
| Medicamentos | Paracetamol, antiinflamatorio tópico |
| Otros | Linterna, manta térmica, instructivo |

### 2.4 Detalle técnico — Trípode de rescate (SI/NO)

| Campo | Criterio |
|---|---|
| Estructura | Patas sin deformaciones, seguros de apertura funcionales |
| Winche/Cabrestante | Cable sin deshilachado ni corrosión, freno/trinquete operativo |
| Arnés de rescate | Correas sin cortes, hebillas sin fisuras, dentro de vida útil |
| Punto de anclaje | Gancho/mosquetón con seguro, sin deformación |
| Certificación | Etiqueta de inspección/carga vigente |

### 2.5 Regla cruzada con la skill `examen-sst-actividad`

Dificultad mínima **Muy Difícil** siempre para cualquier examen SST de esta actividad, sin ofrecer Sencillo/Difícil por defecto — confirmado por el usuario, por la criticidad de la actividad. No redactar preguntas de "qué hace primero" sobre un atrapamiento ya en curso (sección 1.3) — el enfoque debe ser siempre preventivo.

## 3. Fuentes

1. Fotos anotadas por el usuario (DGM), 18/09/2026 — mecanismo de freno, embrague (tensor de faja) y encroche en dos tiempos, motivo del desacople, palanca de cambios y su ubicación.
2. Informe N°001-SST-2020, "Inspección Máquina de Balde", Daniel Ghersi Mendoza, 24-02-2020 — hallazgos de inspección y conclusión sobre el sistema de parada. Dos máquinas inspeccionadas: Recuperador de Cable y Dragadora, cliente SEDAPAL / Consorcio San Juan de Lurigancho — en cualquier salida de examen o documento derivado usar "la Empresa" / "el Cliente", nunca el nombre real.
3. Confirmación del usuario, 22/09/2026 — clasificación de la División Dragadoras y del caso Máquina de Balde (2 Subtipos).
4. Confirmación del usuario, 18/09/2026 — alcance del rol de ayudante frente al operador; secuencia real de re-encroche; falla de la palanca de cambios; ausencia de secuencia correcta ante atrapamiento ya en curso; dificultad mínima Muy Difícil para el examen SST de esta actividad.
5. Checklist de 64 ítems en 10 Bloques (BloqueSet específico de Máquina de Balde), trabajado por el usuario en otra conversación, 24/09/2026 — contenido completo de la sección 2.
