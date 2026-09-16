// Data Universal: Inspecciones Transversales y Opciones Decisoras de Hallazgos
const universalChecklist = {
  extintor: [
    { id: "ext_1", t: "Tipo / Capacidad: PQS clase ABC (6 lbs / 9 lbs)", c: "ALTO" },
    { id: "ext_2", t: "Manómetro: Indicador dentro del rango verde operativo", c: "ALTO" },
    { id: "ext_3", t: "Vigencia: Tarjeta de inspección y recarga vigente", c: "ALTO" },
    { id: "ext_4", t: "Precinto: Precinto de seguridad e pasador intactos", c: "MEDIO" },
    { id: "ext_5", t: "Fijación: Soporte fijo, señalizado y de fácil acceso", c: "MEDIO" }
  ],
  botiquin: [
    { id: "bot_1", t: "Antisépticos: Alcohol, agua oxigenada, jabón antiséptico (limpios)", c: "MEDIO" },
    { id: "bot_2", t: "Curación: Gasas, esparadrapo, vendas, algodón (sin contaminar)", c: "MEDIO" },
    { id: "bot_3", t: "Instrumental: Tijeras de punta roma, guantes de examen", c: "MEDIO" },
    { id: "bot_4", t: "Medicamentos: Paracetamol, antiinflamatorio tópico", c: "MEDIO" },
    { id: "bot_5", t: "Otros: Linterna, manta térmica, instructivo de primeros auxilios", c: "MEDIO" }
  ],
  opcionesBloqueo: [
    "Digital + Tarjeta Física en Switch Master",
    "Digital + Llave Retirada y Entregada a SST",
    "Solo Bloqueo Digital en Sistema",
    "No Requiere Bloqueo (Falla Menor)"
  ],
  estadosNoConforme: [
    "EQUIPO NO OPERATIVO (BLOQUEO LOTO)",
    "EQUIPO OPERATIVO CONOBSERVACIONES MENORES",
    "EQUIPO APTO Y OPERATIVO"
  ]
};