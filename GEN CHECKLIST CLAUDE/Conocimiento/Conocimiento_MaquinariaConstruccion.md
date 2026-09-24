# CONOCIMIENTO — DIVISIÓN: MAQUINARIA DE CONSTRUCCIÓN

> Vive en `CHECKLIST ONLINE/Conocimiento/Conocimiento_MaquinariaConstruccion.md`. Archivo acumulativo — se añade contenido nuevo por cada máquina/caso validado de esta División, nunca se reemplaza.

## Caso validado: Excavadora / Retroexcavadora (Clase 1 — Movimiento de tierras)

BloqueSet: estándar de 9 Bloques (sin excepciones — ver `TaxonomiaBloques.md`).

Checklist combinado de 38 ítems, ajustado para que un mismo formulario sirva a ambos equipos usando N/A donde un ítem no aplica a uno de los dos. Usado como caso de prueba para la migración de datos a Firestore del Proyecto GeneradorPython.

### Diferencias técnicas resueltas entre Excavadora y Retroexcavadora

- **Sistema de Traslación:** orugas (Excavadora) vs. llantas + presión + pernos (Retroexcavadora).
- **Sistemas de Control:** freno de servicio (Retroexcavadora) vs. control de traslación/freno hidrostático (Excavadora); freno de parqueo común a ambos; gatos estabilizadores exclusivos de Retroexcavadora (ubicados en este bloque, no en Sistema de Traslación).
- **Componentes Esenciales:** cucharón/pines/boom frontal aplica a ambos; brazo excavador trasero exclusivo de Retroexcavadora.
- **Cabina:** ítem de asiento giratorio 180° exclusivo de Retroexcavadora.

### Pendiente

El detalle ítem por ítem (los 38 ítems completos con criticidad/riesgo/acción) todavía no se ha trasladado a este archivo — solo existe el resumen de diferencias técnicas de arriba. Completar cuando se retome este caso.
