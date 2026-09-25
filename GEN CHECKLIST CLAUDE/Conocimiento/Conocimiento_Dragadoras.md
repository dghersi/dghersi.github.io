# CONOCIMIENTO — DIVISIÓN: DRAGADORAS

> Archivo acumulativo de la skill `checklist-maquinaria` para la División **Dragadoras**. Vive en `GEN CHECKLIST CLAUDE/Conocimiento/Conocimiento_Dragadoras.md` en el repositorio `dghersi/dghersi.github.io`. Se le añade contenido nuevo cada vez que se valida un caso, BloqueSet o máquina adicional de esta División — nunca se reemplaza. Mientras este archivo no exista en GitHub, la skill usa como respaldo la sección 5 de `references/2-Taxonomia_bloques.md`; en cuanto se suba aquí, este archivo pasa a ser la fuente vigente para Dragadoras.
>
> La lista de las 8 Clases de la División (taxonomía pura) NO vive aquí — está en `1-Taxonomia_dominio.md` / `Conocimiento/TaxonomiaDominios.md`. Este archivo solo contiene lo específico de cada máquina/caso dentro de la División: BloqueSets, ítems, mecanismos, hallazgos.

## 1. Caso: Máquina de Balde (Clase 1 — De Arrastre)

Checklist combinado para 2 Subtipos: **Recuperador de Cable** y **Dragadora/Cargadora de Baldes**, ambas trabajadas siempre en pareja (una en cada buzón del tramo).

### 1.1 Nomenclatura y roles

- **Recuperador de Cable** ("haladora"): winche, tambor, cable, los 3 mecanismos de la sección 1.2, y palanca de cambios.
- **Dragadora/Cargadora de Baldes**: carga y descarga el balde, con su propio sistema de fajas y engranajes.
- **Operador:** único que interviene sobre la máquina — enciende/apaga motor, acciona freno/embrague/encroche/cambios, maneja el cable, e interviene manualmente si el balde se atasca (aunque la máquina siga encendida, riesgo real observado). No delega ninguna de estas acciones en el ayudante.
- **Ayudante:** función acotada a dos tareas, ambas en superficie (nivel de pista), nunca sobre la máquina: (1) ayudar a jalar la cadena o el cable guía a nivel de pista, y (2) coger el balde para retirar sedimentos una vez que ya está a nivel del suelo. Nunca toca freno, embrague, encroche, cambios, ni el balde mientras está en el aire o trabado.

### 1.2 Tres mecanismos del eje del tambor (Recuperador de Cable)

Todos accionados por el operador, en la misma zona del eje del tambor — base de los ítems del Bloque 9 (Sistemas de Control, ver sección 2):

1. **Palanca de Freno** (tipo cinta, jalar hacia el costado): frena por rozamiento sobre el tambor. **No tiene trinquete ni seguro propio** — solo frena mientras la mano la sostiene, salvo aseguramiento externo con cadena.
2. **Palanca de embrague por tensor de faja** (jalar hacia afuera): acopla la transmisión motor→eje transversal (palanca de cambios).
3. **Sistema de encroche/desencroche en dos tiempos** (girar el dado, luego jalarlo): desacopla el piñón, dejando el tambor libre para soltar cable más rápido. Requiere las dos manos.

**Motivo del desenclavado:** liberar el tambor para que el cable se suelte/pague más rápido que a través del tren de engranajes acoplado.

### 1.3 Hallazgo crítico (Informe N°001-SST-2020, conclusión c.v)

> "Se deja asentado que el Tensor de Faja de transmisión o la Palanca de Freno **NO ES UN SISTEMA DE PARADA**. Se concluye que, en caso de atrapamiento de un personal, el método de desactivación sería el apagado del motor de fuerza cuyo sistema de accionamiento no se encuentra muy visible. Aparte el tiempo de desactivación o apagado tomaría mucho tiempo debido que el trabajador más cercano se encontraría siempre a 50 metros."

**Consecuencia para el checklist (ya aplicada en los Bloques 5 y 9 de la sección 2):** ningún ítem presenta el freno o el embrague como parada de emergencia confiable — el mando de apagado del motor es el único método real, y su visibilidad/accesibilidad es lo que se verifica. El interruptor es simple, tipo motobomba, no una parada de emergencia ni interlock de fábrica.

**Atrapamiento ya en curso:** no existe secuencia correcta evaluable ahí (el freno solo lo acciona la misma persona operando, que normalmente sería la atrapada) — por eso el checklist es enteramente preventivo, nunca reactivo.

### 1.4 Secuencia crítica de re-encroche

Al revertir el sentido de tiro con el tambor desencrochado: (1) confirmar con el otro operario que deje de jalar, (2) palanca de cambios en neutro, (3) activar el freno y trabarlo con cadena, (4) recién con el tambor detenido, encrochar a dos manos, (5) liberar freno y accionar embrague en el nuevo sentido.

**Riesgo específico (base del ítem de palanca de cambios sin juego, Bloque 9, criticidad ALTO):** en algunas unidades la palanca de cambios tiene juego y puede salirse de neutro sola por su propio peso — si ocurre durante el paso (4), una activación accidental del embrague sí transmitiría fuerza al tambor con el operador con ambas manos cerca del punto de enganche del piñón.

### 1.5 Defectos de diseño identificados en campo (nuevo, 25/09/2026)

- Palanca de cambios ubicada al centro de la máquina (fuerza inclinarse sobre partes móviles).
- Palancas de freno y tensor de faja (embrague) casi idénticas y adyacentes — freno hacia un lado, tensor hacia afuera; la similitud es fuente de error.
- La mayoría de máquinas carece de guía de cable (guía de enrollado) por defecto de diseño de fábrica.
- Guardas incompletas: la de faja normalmente cubre solo 3/4, con la cara inferior descubierta; las de engranajes suelen cubrir solo la cara exterior.
- Extintor montado a una altura excesiva en muchas unidades.

### 1.6 Guía de cable vs. guía de paso (nuevo, 25/09/2026)

**Guía de cable** (guía de enrollado): barra roscada horizontal con un carro que se desplaza distribuyendo el cable en capas ordenadas sobre el tambor, a través del cual pasa el cable. Se mantiene con nombre genérico porque no todas las máquinas la tienen instalada por defecto — el checklist la exige igual como ítem de guarda/protección (Bloque 7, ver sección 2).

**Guía de paso**: distinta de la anterior — es por donde discurre el cable/soga/cordino desde el tambor hasta el buzón, a través de accesorios como el puercoespín (Bloque 8). Tipo aún genérico (soga, cordino o cable delgado), pendiente de que el usuario defina el tipo definitivo.

## 2. BloqueSet específico validado: Máquina de Balde (12 Bloques, 82 ítems)

**Actualizado 25/09/2026 — reemplaza la versión anterior de 10 Bloques/64 ítems.** Al revisar la estructura contra el Excel final (`Checklist_Maquina Balde V1`), se detectó que faltaba un bloque completo de Guardas y Protecciones (7 ítems, criticidad mayormente ALTO por riesgo de atrapamiento) que sí se había aprobado en el chat pero no llegó a materializarse en esa versión del Excel. Se incorporó como **Bloque 7**, corriendo en +1 los bloques siguientes (Accesorios de Guiado pasa a Bloque 8, Sistemas de Control a Bloque 9, etc.). También se corrigió el ítem de "palanca de cambios en neutro" (Bloque 12) que había quedado recortado a 76 caracteres, fuera del rango de la regla de longitud de este caso.

**Excepción al BloqueSet estándar de 9 Bloques** (ver `TaxonomiaBloques.md` sección 1): este caso separa el Sistema Mecánico y el Sistema Eléctrico en dos bloques distintos, en vez de combinarlos en un solo "Sistema hidráulico & eléctrico" — la máquina no tiene sistema hidráulico. Además tiene dos bloques propios sin equivalente en el modelo genérico: **Guardas y Protecciones de Partes en Movimiento** y **Accesorios de Guiado y Arrastre**.

1. Entorno, EPP y Ergonomía del Punto de Operación (8 ítems)
2. Visibilidad y Señalización (5 ítems)
3. Prueba Funcional / en Vacío (7 ítems)
4. Sistema Mecánico (15 ítems)
5. Sistema Eléctrico (5 ítems)
6. Componentes Esenciales (4 ítems)
7. Guardas y Protecciones de Partes en Movimiento (7 ítems)
8. Accesorios de Guiado y Arrastre (7 ítems)
9. Sistemas de Control: freno, embrague, encroche y cambios (6 ítems)
10. Sistema de Traslación por Remolque (4 ítems)
11. Equipo y Sistema de Emergencia (8 ítems)
12. Estacionamiento y Aseguramiento (6 ítems)

**Columna "Aplica":** este BloqueSet usa una columna separada `Aplica` (Ambas / Recuperador de Cable / Dragadora) en el ítem, en vez de la etiqueta `[Nombre del Subtipo]` embebida en el texto — formato específico de este caso, documentado aquí para que quede como precedente si se replica en otro caso de Subtipos combinados. En la revisión de 25/09/2026, varios ítems que antes se habían marcado como exclusivos de "Recuperador de Cable" (fajas/engranajes, cable, tambor, guardas, etc.) pasaron a `Ambas`, porque ambos subtipos comparten el mismo mecanismo de partes en movimiento; solo quedan exclusivos de un Subtipo los ítems verdaderamente específicos (pantalla transparente frontal, fajas/engranajes de carga y descarga del balde, prueba en vacío de esas fajas).

**Regla de longitud del texto de "Ítem de Verificación" para este caso: 84-90 caracteres** (reemplaza la nota anterior de "pendiente decidir 84-94 vs. 88-97" — quedó cerrada por el usuario el 24/09/2026).

### 2.1 Checklist completo — Máquina de Balde (82 ítems)

#### BLOQUE 1 — Entorno, EPP y Ergonomía del Punto de Operación

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 1 | EPP para operación completo y en buen estado; ver detalle de EPP para operación | Ambas | MEDIO | --- | Corregir antes de iniciar |
| 2 | EPP para intervención en buzón completo y en buen estado; ver detalle de EPP buzón | Ambas | ALTO | CONTAMIN. BIOLÓGICA / INH. DE GASES TÓXICOS | No intervenir el buzón sin EPP completo |
| 3 | Palancas de freno, embrague, encroche y cambios sin grasa ni obstáculos; agarre firme | Ambas | MEDIO | RESBALO DE MANO EN PALANCA | Limpiar antes de operar |
| 4 | Palanca de cambios alcanzable sin inclinarse sobre partes móviles ni forzar la postura | Ambas | MEDIO | ATRAPAMIENTO / TRASTORNO ERGONÓMICO | Reportar a mantenimiento |
| 5 | Palancas de freno, embrague y encroche alcanzables sin postura forzada y con espacio libre | Ambas | MEDIO | TRASTORNO ERGONÓMICO / ATRAPAMIENTO | Despejar el entorno de la palanca |
| 6 | Tapa del motor con asa o agarradera; se abre sin apoyar los dedos en el borde de la tapa | Ambas | MEDIO | ATRAPAM. DE MANOS / CONTACTO CON PARTES CALIENTES | Reportar a mantenimiento |
| 7 | Palancas de freno y embrague distinguibles y separadas; no se confunden al accionarlas | Ambas | MEDIO | ACCIONAMIENTO ERRÓNEO / ATRAPAMIENTO | Rotular y diferenciar antes de operar; reportar a mantenimiento |
| 8 | Recorrido de cada palanca libre, sin obstáculos ni interrupciones, al accionarla completa | Ambas | MEDIO | FRENADO INCOMPLETO / ACCIONAMIENTO IMPEDIDO | Retirar el obstáculo antes de operar |

#### BLOQUE 2 — Visibilidad y Señalización

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 9 | Pictogramas de riesgo (atrapamiento, aplastamiento) presentes en la máquina y legibles | Ambas | MEDIO | --- | Reponer señalización |
| 10 | Código de colores en freno, embrague, tambor y faja visible, sin desgaste ni borrado | Ambas | MEDIO | --- | Repintar o reponer código de colores |
| 11 | Cada palanca (freno, embrague, encroche, cambios) con rótulo y flecha de sentido legibles | Ambas | MEDIO | ACCIONAMIENTO INCORRECTO | Reponer rótulos y flechas antes de operar |
| 12 | Cintas reflectivas en todo el perímetro de la máquina completas, limpias y bien adheridas | Ambas | MEDIO | ATROPELLO / COLISIÓN | Reponer cintas |
| 13 | Luces estroboscópicas operativas según MTC si hay trabajo nocturno o cercano a la vía | Ambas | ALTO | ATROPELLO POR VEHÍCULO | No operar en horario nocturno sin luces |

#### BLOQUE 3 — Prueba Funcional / en Vacío

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 14 | Motor arranca sin anomalías; funciona estable, sin ruidos extraños ni vibración excesiva | Ambas | MEDIO | DAÑO AL MOTOR | No operar, reportar a mantenimiento |
| 15 | Interruptor de apagado detiene el motor por completo al accionarlo en vacío, sin demora | Ambas | ALTO | RETRASO EN PARADA ANTE ATRAPAMIENTO | No operar hasta reparación |
| 16 | Palanca de freno responde y frena por rozamiento en vacío, sin carga, deteniendo el tambor | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 17 | Palanca de embrague acciona el rodillo tensor sobre la faja en vacío, sin patinar ni ruido | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 18 | Encroche y desencroche completan sus dos tiempos (girar y jalar) sin resistencia anormal | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 19 | Palanca de cambios entra y sale de neutro y marcha sin trabarse ni saltar de posición | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |
| 20 | Fajas y engranajes de carga y descarga del balde giran en vacío sin ruido ni vibración | Dragadora | ALTO | ATRAPAMIENTO EN MECANISMO | No operar hasta reparación |

#### BLOQUE 4 — Sistema Mecánico

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 21 | Cinta de freno adherida a su alojamiento, sin grietas, desgaste excesivo ni aceite o grasa | Ambas | ALTO | FALLA DE FRENADO | Retirar de servicio |
| 22 | Anillo de freno alineado en su posición de descanso, sin rozar el tambor ni desplazarse | Ambas | ALTO | FALLA DE FRENADO | No operar hasta realinear |
| 23 | Faja de transmisión del embrague sin cortes ni deshilachado; sin deslizamiento al cargar | Ambas | ALTO | PÉRDIDA DE TRANSMISIÓN | Retirar de servicio |
| 24 | Rodillo tensor del embrague gira libre, sin juego excesivo, trabas ni ruidos al accionarlo | Ambas | MEDIO | FALLA DE ACOPLE | No operar, reportar |
| 25 | Dado de encroche (azul-amarillo) sin fisuras; traba correctamente en sus dos tiempos | Ambas | ALTO | DESACOPLE INVOLUNTARIO | No operar hasta reparación |
| 26 | Piñón de acople del encroche sin dientes rotos ni desgaste excesivo; engrana completo | Ambas | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 27 | Engranajes o cadena de transmisión al tambor sin dientes rotos, desgaste ni falta de grasa | Ambas | ALTO | FALLA ESTRUCTURAL / ATRAPAMIENTO | Retirar de servicio |
| 28 | Eje de fuerza recto, sin holgura ni corrosión severa; apoyos firmes en ambos extremos | Ambas | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 29 | Cable de acero sin dobleces, hebras rotas visibles ni corrosión excesiva en todo su largo | Ambas | ALTO | ROTURA DE CABLE / CHICOTAZO | Retirar de servicio |
| 30 | Cable enrollado en capas ordenadas sobre el tambor, sin cruces, enredos ni aplastamientos | Ambas | MEDIO | ENREDO DE CABLE / DAÑO AL CABLE | Reportar a mantenimiento |
| 31 | Tambor con solo el cable de acero enrollado; sin soga ni cordino enrollados junto al cable | Ambas | MEDIO | ATRAPAMIENTO / ROTURA DE SOGA EN TAMBOR | Retirar la soga antes de operar |
| 32 | Tambor y bridas sin deformaciones ni grietas visibles; aro de freno sin óxido ni grasa | Ambas | ALTO | FALLA ESTRUCTURAL / FALLA DE FRENADO | Retirar de servicio |
| 33 | Polea loca instalada, sin deformación y engrasada; gira libre, sin holgura en su eje | Ambas | MEDIO | CONTACTO CON OPERADOR / DAÑO AL CABLE | No operar, reponer o reparar polea |
| 34 | Fajas y engranajes de carga y descarga del balde sin desgaste, cortes ni juego excesivo | Dragadora | ALTO | CAÍDA DE BALDE / ATRAPAMIENTO | No operar hasta reparación |
| 35 | Combustible y aceite del motor en nivel adecuado; sin fugas visibles en motor ni tanque | Ambas | MEDIO | DERRAME / FALLA DE MOTOR | Reportar a mantenimiento |

#### BLOQUE 5 — Sistema Eléctrico

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 36 | Batería con terminales sin corrosión, bien ajustados y con la base fijada firmemente | Ambas | MEDIO | CORTOCIRCUITO | Reportar antes de encender |
| 37 | Cableado eléctrico íntegro y sujeto; sin conductores expuestos ni cables sueltos colgando | Ambas | ALTO | CONTACTO ELÉCTRICO DIRECTO | No operar hasta reparación |
| 38 | Panel de encendido con indicadores de operación visibles y en funcionamiento al encender | Ambas | MEDIO | FALLA NO DETECTADA A TIEMPO | Reportar antes de operar |
| 39 | Interruptor de apagado del motor visible, identificado y al alcance inmediato del operador | Ambas | ALTO | RETRASO EN PARADA ANTE ATRAPAMIENTO | No operar hasta señalizar o reubicar el interruptor |
| 40 | Sistema de encendido separado del tubo de escape; sin cables ni piezas en zona caliente | Ambas | MEDIO | RIESGO TÉRMICO / QUEMADURA | Reportar a mantenimiento |

#### BLOQUE 6 — Componentes Esenciales

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 41 | Eje del tambor sin holgura anormal ni juego axial perceptible al moverlo con la mano | Ambas | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 42 | Pines y bocinas de sujeción del tambor sin desgaste excesivo, ovalamiento ni juego visible | Ambas | ALTO | FALLA ESTRUCTURAL | No operar, reportar a mantenimiento |
| 43 | Anclaje de la estructura del winche firme, sin fisuras, deformaciones ni pernos flojos | Ambas | ALTO | FALLA ESTRUCTURAL | Retirar de servicio |
| 44 | Extremo del cable sujeto al tambor con anclaje o abrazadera firme, sin holgura ni daño | Ambas | MEDIO | SUELTA DEL CABLE / CHICOTAZO | Reportar a mantenimiento |

#### BLOQUE 7 — Guardas y Protecciones de Partes en Movimiento (nuevo, 25/09/2026)

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 45 | Tapa del motor instalada, con bisagras y cierre firmes; sin piezas giratorias a la vista | Ambas | ALTO | ATRAPAMIENTO / CONTACTO CON PARTES GIRATORIAS | No operar sin tapa instalada |
| 46 | Guarda de faja de transmisión completa, con cara inferior, fija y sin abertura al alcance | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar sin guarda completa |
| 47 | Guarda de engranajes o cadena completa en ambas caras, fija y sin partes móviles visibles | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar sin guarda completa |
| 48 | Eje de fuerza cubierto en todo su tramo con guarda fija; sin tramos giratorios expuestos | Ambas | ALTO | ATRAPAMIENTO / ENREDO DE ROPA EN EJE | No operar sin guarda instalada |
| 49 | Engranajes del lado opuesto del tambor con guarda fija; sin partes móviles a la vista | Ambas | ALTO | ATRAPAMIENTO EN MECANISMO | No operar sin guarda instalada |
| 50 | Pantalla transparente frontal sobre el tambor firme, sin roturas y que deja ver el cable | Recuperador de Cable | ALTO | ATRAPAMIENTO EN TAMBOR / CHICOTAZO DE CABLE | No operar sin pantalla instalada |
| 51 | Guía de cable instalada: barra roscada y carro sin deformación ni desgaste; carro libre | Ambas | MEDIO | ENROLLADO IRREGULAR / ENREDO Y DAÑO DEL CABLE | Reportar a mantenimiento |

#### BLOQUE 8 — Accesorios de Guiado y Arrastre

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 52 | Balde sin deformaciones, fisuras ni bordes filosos; soldaduras y argolla de amarre sanas | Ambas | MEDIO | CORTE / CAÍDA DE BALDE | Retirar de servicio |
| 53 | Ganchos y eslabones de sujeción del balde con seguro puesto, sin desgaste ni deformación | Ambas | ALTO | CAÍDA DE BALDE / GOLPE POR OBJETO | Retirar de servicio |
| 54 | Unión cable-balde con grillete o sujetacable ajustado; sin hebras rotas ni deformación | Ambas | ALTO | SUELTA DEL BALDE / CHICOTAZO | Retirar de servicio |
| 55 | Guía de paso (soga, cordino o cable delgado) sin cortes ni deshilachado; largo suficiente | Ambas | MEDIO | ROTURA DE GUÍA / PÉRDIDA DE ARRASTRE | Reponer antes de operar |
| 56 | Rueda porta varillas con giro libre y mínimo de 100 varillas sin doblez ni corrosión | Ambas | MEDIO | ROTURA DE VARILLA / TRASTORNO ERGONÓMICO | Reponer o reparar antes de operar |
| 57 | Puercoespín giratorio y adaptador (5/16" o 3/8") sin desgaste, con giro libre y seguro | Ambas | MEDIO | TORSIÓN Y ENREDO DEL CABLE / SUELTA DE ACCESORIO | Reponer antes de operar |
| 58 | Levantatapas sin deformación ni fisuras, con mango firme y antideslizante; gancho íntegro | Ambas | MEDIO | GOLPE / ATRAPAMIENTO DE MANOS | Reponer antes de operar |

#### BLOQUE 9 — Sistemas de Control: freno, embrague, encroche y cambios

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 59 | Palanca de freno sin juego excesivo; retiene el tambor y queda trabada con su cadena | Ambas | ALTO | FALLA DE FRENADO / ATRAPAMIENTO | No operar hasta reparación |
| 60 | Cadena de aseguramiento del freno íntegra, sin eslabones deformados, con gancho firme | Ambas | ALTO | DESLIZAMIENTO DEL TAMBOR / ATRAPAMIENTO | Retirar de servicio |
| 61 | Palanca de freno separada del punto de desenclavado; no se acciona por error al operar | Ambas | MEDIO | ACCIONAMIENTO ERRÓNEO | Rotular y reportar a mantenimiento |
| 62 | Palanca de embrague con recorrido completo; acopla y desacopla sin quedarse a medias | Ambas | ALTO | FALLA DE ACOPLE / ATRAPAMIENTO | No operar hasta reparación |
| 63 | Palanca de encroche con giro y jalón completos; no se desacopla sola con el tambor girando | Ambas | ALTO | DESACOPLE INVOLUNTARIO / ATRAPAMIENTO | No operar hasta reparación |
| 64 | Palanca de cambios sin juego excesivo; se mantiene en neutro sin salirse por su peso | Ambas | ALTO | ARRANQUE INESPERADO / ATRAPAMIENTO | NO APTO PARA OPERAR. Retirar de servicio |

#### BLOQUE 10 — Sistema de Traslación por Remolque

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 65 | Ruedas sin cortes ni deformaciones; con presión adecuada, tuercas firmes y giro libre | Ambas | MEDIO | VOLCADURA / PÉRDIDA DE CONTROL AL REMOLCAR | Reportar antes de trasladar |
| 66 | Punto de remolque o enganche sin fisuras ni deformación; pin de seguridad colocado y firme | Ambas | ALTO | DESENGANCHE DURANTE EL TRASLADO / ATROPELLO | No trasladar hasta reparación |
| 67 | Barra o timón de remolque sin doblez, fisuras ni soldaduras dañadas; se fija sin holgura | Ambas | ALTO | DESENGANCHE / GOLPE POR MÁQUINA | No trasladar hasta reparación |
| 68 | Cuñas de calzado disponibles, sin fisuras ni desgaste, aptas para inmovilizar la máquina | Ambas | MEDIO | DESPLAZAMIENTO INVOLUNTARIO / ATRAPAMIENTO | Reponer antes de operar |

#### BLOQUE 11 — Equipo y Sistema de Emergencia

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 69 | Extintor operativo, vigente, señalizado y a altura accesible; ver detalle extintor | Ambas | ALTO | INCENDIO SIN CONTROL | No operar sin extintor apto |
| 70 | Detector multigás con bump test y calibración vigentes; ver detalle de multigás | Ambas | ALTO | INHALACIÓN DE GASES TÓXICOS / EXPLOSIÓN | No intervenir el buzón sin detector |
| 71 | Botiquín completo y con medicamentos vigentes, según R.D. del MTC; ver detalle | Ambas | MEDIO | ATENCIÓN TARDÍA DE LESIONES | Reponer antes de iniciar |
| 72 | Trípode de rescate con arnés y winche operativos y certificados; ver detalle | Ambas | ALTO | IMPOSIBILIDAD DE RESCATE EN BUZÓN | No intervenir el buzón sin trípode |
| 73 | Kit antiderrame completo (absorbente y bolsas) disponible y al alcance junto a la máquina | Ambas | MEDIO | CONTAMINACIÓN POR DERRAME | Reponer antes de iniciar |
| 74 | Conos, cinta, vallas o tranqueras suficientes para señalizar toda la zona de trabajo | Ambas | ALTO | ATROPELLO / INGRESO DE TERCEROS | No iniciar sin zona señalizada |
| 75 | Dos radios con manos libres, batería cargada y comunicación probada entre ambos buzones | Ambas | ALTO | FALTA DE AVISO ANTE EMERGENCIA | No operar sin comunicación |
| 76 | Linterna antiexplosiva LED con batería cargada y funcionamiento comprobado antes de usar | Ambas | MEDIO | IGNICIÓN EN ATMÓSFERA EXPLOSIVA / FALTA DE VISIBILIDAD | Reponer antes de iniciar |

#### BLOQUE 12 — Estacionamiento y Aseguramiento

| N° | Ítem de Verificación | Aplica | Crit. | Riesgo Asociado | Acción si es NO |
|---|---|---|---|---|---|
| 77 | Motor apagado y llave retirada al inspeccionar o intervenir la máquina en estacionamiento | Ambas | ALTO | ARRANQUE INESPERADO / ATRAPAMIENTO | Apagar y retirar la llave antes de intervenir |
| 78 | Freno trabado con su cadena de aseguramiento y tambor inmóvil con la máquina estacionada | Ambas | ALTO | GIRO INVOLUNTARIO DEL TAMBOR / ATRAPAMIENTO | No dejar la máquina sin asegurar el freno |
| 79 | Palanca de cambios en neutro y embrague desacoplado con la máquina estacionada o apagada | Ambas | ALTO | ARRANQUE Y MOVIMIENTO INESPERADO | Colocar en neutro y desacoplar antes de dejarla |
| 80 | Encroche desacoplado y tambor libre de tensión, sin carga colgando ni cable estirado | Ambas | ALTO | LIBERACIÓN BRUSCA DE TENSIÓN / CHICOTAZO | Liberar la tensión antes de intervenir |
| 81 | Máquina calzada con cuñas a ambos lados de las ruedas, sin posibilidad de desplazamiento | Ambas | MEDIO | DESPLAZAMIENTO INVOLUNTARIO / APLASTAMIENTO | Calzar antes de dejar la máquina |
| 82 | Cable recogido y ordenado, sin tensión residual ni tramos sueltos en el piso ni al paso | Ambas | MEDIO | TROPEZÓN / LÁTIGO DE CABLE | Recoger y ordenar el cable |

*(Ítem 79 corregido el 25/09/2026: la versión intermedia del Excel V1 lo tenía recortado a "…con la máquina apagada" (76 caracteres, fuera del rango 84-90); esta es la versión aprobada de 88 caracteres.)*

### 2.2 Detalle técnico — Extintor portátil (SI/NO/NA)

| Campo | Criterio |
|---|---|
| Tipo/capacidad | PQS clase ABC (6 lbs / 9 lbs) |
| Manómetro | Rango verde |
| Vigencia | Recarga vigente |
| Precinto | Intacto |
| Altura de instalación | Entre 1.0 y 1.5 m desde el suelo |
| Fijación | Soporte fijo, señalizado |

### 2.3 Detalle normativo — Botiquín (R.D. MTC) (SI/NO/NA)

| Campo | Criterio |
|---|---|
| Antisépticos | Alcohol, agua oxigenada, jabón (limpios) |
| Curación | Gasas, esparadrapo, vendas, algodón (limpios, no contaminados) |
| Instrumental | Tijeras punta roma, guantes |
| Medicamentos | Paracetamol, antiinflamatorio tópico |
| Otros | Linterna, manta térmica, instructivo |

### 2.4 Detalle técnico — Trípode de rescate (SI/NO/NA)

| Campo | Criterio |
|---|---|
| Estructura | Patas sin deformaciones, seguros de apertura funcionales |
| Winche/Cabrestante | Cable sin deshilachado ni corrosión, freno/trinquete operativo |
| Arnés de rescate | Correas sin cortes, hebillas sin fisuras, dentro de vida útil |
| Punto de anclaje | Gancho/mosquetón con seguro, sin deformación |
| Certificación | Etiqueta de inspección/carga vigente |

### 2.5 Detalle técnico — Detector Multigás (SI/NO/NA) (nuevo, 25/09/2026)

| Campo | Criterio |
|---|---|
| Carcasa | Sin fisuras ni golpes; pantalla visible y legible |
| Encendido | Autochequeo (autotest) sin error |
| Batería | No se descarga rápido; mantiene carga entre usos |
| Alarma sonora y visual | Funcionan al encender el equipo |
| Sensores (O₂, LEL, H₂S, CO) | Sin daño visible ni obstrucción en la entrada de aire |
| Bomba externa de muestreo | Succiona sin fugas ni ruidos anormales |
| Sonda de muestreo | 10 m íntegra, sin dobleces ni obstrucciones |
| Calibración | Vigente según etiqueta o certificado del fabricante |

*(No incluye bump test de gas como ítem de checklist — se acordó con el usuario omitirlo por no ser verificable sin equipo de prueba en campo; solo se verifica que el autochequeo del equipo pase sin error.)*

### 2.6 Detalle — EPP para Operación (SI/NO/NA) (nuevo, 25/09/2026)

| Campo | Criterio |
|---|---|
| Casco | Sin fisuras ni golpes; suspensión (arnés interno) completa |
| Chaleco reflectivo | Cintas legibles, sin roturas |
| Guantes multipropósito | Sin cortes ni desgaste |
| Lentes de seguridad | Sin rayaduras que limiten la visión |
| Zapatos de seguridad | Suela antideslizante y puntera sin daños |
| Orejeras o tapones | Almohadillas/cuerpo sin daño |

### 2.7 Detalle — EPP para Intervención en Buzón (SI/NO/NA) (nuevo, 25/09/2026)

| Campo | Criterio |
|---|---|
| Guantes de jebe largos | Sin cortes ni filtraciones, cubren el antebrazo |
| Botas de jebe caña alta o muslera | Sin perforaciones |
| Traje descartable contra riesgo biológico | Íntegro, sin roturas |
| Respirador media cara | Buen sello y filtros vigentes para gases tóxicos |

### 2.8 Regla cruzada con la skill `examen-sst-actividad`

Dificultad mínima **Muy Difícil** siempre para cualquier examen SST de esta actividad, sin ofrecer Sencillo/Difícil por defecto — confirmado por el usuario, por la criticidad de la actividad. No redactar preguntas de "qué hace primero" sobre un atrapamiento ya en curso (sección 1.3) — el enfoque debe ser siempre preventivo.

## 3. Buenas Prácticas de Trabajo (Fase 3, 6 viñetas — nuevo, 25/09/2026)

Ya generadas e insertadas en el Excel/Google Sheets (`Checklist_Maquina Balde V1`):

1. **INSPECCIONA ANTES DE OPERAR** — Verifica cada palanca antes de encender el equipo. (Enfoque: Inspección Previa)
2. **ASEGURA EL FRENO** — Traba la cadena antes de dejar la máquina. (Enfoque: Retención/Interlock)
3. **MANTÉN LA COMUNICACIÓN** — Usa la radio entre ambos buzones. (Enfoque: Zona de Maniobra/Vigía)
4. **MIDE EL AIRE ANTES DE INGRESAR** — Nunca intervengas el buzón sin verificar los gases. (Enfoque: Peligro Específico)
5. **USA TU EPP COMPLETO** — Protección total antes de intervenir el buzón. (Enfoque: Ergonómico/Acceso)
6. **NUNCA METAS LA MANO AL TAMBOR** — Apaga la máquina y usa un punzón para desenredar. (Enfoque: Alerta/Advertencia — sustituye la propuesta original de "señalización" por un hallazgo más crítico y específico de esta máquina)

También se generaron dos Anatomías del Equipo (454×256 px): Recuperador de Cable y Dragadora, cada una con su propio set de componentes etiquetados, e imágenes de referencia para las subtablas de Extintor, Botiquín, Trípode y Multigás.

## 4. Fuentes

1. Fotos anotadas por el usuario (DGM), 18/09/2026 — mecanismo de freno, embrague (tensor de faja) y encroche en dos tiempos, motivo del desacople, palanca de cambios y su ubicación.
2. Informe N°001-SST-2020, "Inspección Máquina de Balde", Daniel Ghersi Mendoza, 24-02-2020 — hallazgos de inspección y conclusión sobre el sistema de parada. Dos máquinas inspeccionadas: Recuperador de Cable y Dragadora, cliente SEDAPAL / Consorcio San Juan de Lurigancho — en cualquier salida de examen o documento derivado usar "la Empresa" / "el Cliente", nunca el nombre real.
3. Confirmación del usuario, 22/09/2026 — clasificación de la División Dragadoras y del caso Máquina de Balde (2 Subtipos).
4. Confirmación del usuario, 18/09/2026 — alcance del rol de ayudante frente al operador; secuencia real de re-encroche; falla de la palanca de cambios; ausencia de secuencia correcta ante atrapamiento ya en curso; dificultad mínima Muy Difícil para el examen SST de esta actividad.
5. Checklist de 64 ítems en 10 Bloques (BloqueSet específico de Máquina de Balde), trabajado por el usuario en otra conversación, 24/09/2026 — versión previa de la sección 2, ya reemplazada.
6. Revisión bloque por bloque en conversación con el usuario, 24-25/09/2026 — fotos de palancas freno/tensor, polea loca, guía de cable, guardas incompletas; PCO de Máquina de Balde (Word); 82 ítems finales en 12 Bloques, 6 subtablas de detalle, 6 viñetas de Buenas Prácticas y 2 Anatomías del Equipo, materializados en Excel/Google Sheets `Checklist_Maquina Balde V1`. Corrección de estructura (Bloque 7 de Guardas faltante, ítem 79 recortado).