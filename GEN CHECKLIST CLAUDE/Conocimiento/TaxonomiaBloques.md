# BLOQUES DE CHECKLIST — ESTÁNDAR Y MODELO BLOQUESET (GENÉRICO)

> Vive en `CHECKLIST ONLINE/Conocimiento/TaxonomiaBloques.md` en el repositorio `dghersi/dghersi.github.io`. Contiene únicamente el modelo genérico — poco volátil. El historial técnico específico por División (BloqueSets particulares, mecanismos, hallazgos de campo, mapeo de hallazgos a ítems) vive en archivos separados: `Conocimiento_<NombreDivision>.md`, uno por División, acumulativo. No mezclar ambos contenidos aquí.

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

Cuando una Clase o Subtipo necesita un BloqueSet distinto al estándar (bloques renombrados, agregados, eliminados o separados — ej. separar "hidráulico" de "eléctrico" en dos bloques propios), esa excepción se documenta en el `Conocimiento_<NombreDivision>.md` correspondiente, con su justificación técnica — no se fuerzan los 9 Bloques genéricos ni se acumula ese detalle en este archivo.

## 3. Índice de archivos `Conocimiento_<NombreDivision>.md` existentes

| División | Archivo | Estado |
|---|---|---|
| Dragadoras | `Conocimiento_Dragadoras.md` | Caso Máquina de Balde validado (BloqueSet de 10 Bloques) |
| Equipos Estacionarios | `Conocimiento_EquiposEstacionarios.md` | Caso Soldadora por Electrofusión validado |
| Maquinaria de Construcción | `Conocimiento_MaquinariaConstruccion.md` | Caso Excavadora/Retroexcavadora validado |

Actualizar esta tabla cada vez que se cree un `Conocimiento_<NombreDivision>.md` nuevo.
