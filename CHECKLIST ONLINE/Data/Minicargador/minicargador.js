// Matriz de 27 Ítems Técnicos del Minicargador
const minicargadorBloques = [
  {
    bloque: "Entorno, EPP y condiciones previas",
    items: [
      { n: "1", t: "EPP Obligatorio: Portar casco, chaleco reflectivo, botas de acero y antiparras en buen estado.", c: "ALTO", r: "ATROPELLO / IMPACTO", a: "Detener inspección hasta portar EPP completo." },
      { n: "2", t: "Condición del Terreno: Suelo estable, firme, nivelado y libre de líneas eléctricas expuestas.", c: "ALTO", r: "VOLCADURA / ELECTROCUCIÓN", a: "Delimitar zona o solicitar nivelación del suelo." },
      { n: "3", t: "Fugas en Suelo: Piso inferior limpio sin goteo fresco de aceite, refrigerante ni diésel.", c: "MEDIO", r: "CONTAMINACIÓN / CAÍDAS", a: "Identificar origen y limpiar derrame en piso." }
    ]
  },
  {
    bloque: "Cabina, Visibilidad y señalización",
    items: [
      { n: "4", t: "Estructura ROPS/FOPS: Cabina intacta sin fisuras, deformaciones ni soldaduras no reglamentarias.", c: "ALTO", r: "APLASTAMIENTO POR VUELCO", a: "NO APTO PARA OPERAR. Aplicar LOTO inmediato." },
      { n: "5", t: "Cinturón de Seguridad: Anclaje firme, correa sin desgaste y hebilla de traba muy segura.", c: "ALTO", r: "EYECCIÓN DEL OPERADOR", a: "NO APTO PARA OPERAR. Reemplazar el cinturón." },
      { n: "6", t: "Espejos y Parabrisas: Cristales limpios sin trizaduras; espejos con ajuste de vista 360°.", c: "MEDIO", r: "COLISIÓN / PUNTOS CIEGOS", a: "Limpiar o cambiar espejo antes de movilizar." },
      { n: "7", t: "Alarma y Bocina: Tono de la bocina audible a >10m y alarma de reversa operativa al 100% en campo.", c: "ALTO", r: "ATROPELLO A PEATONES", a: "NO APTO PARA OPERAR. Reparar sistema eléctrico." }
    ]
  },
  {
    bloque: "Prueba funcional / en vacío y Condiciones de Operación",
    items: [
      { n: "8", t: "Panel de Control: Testigos de aceite, temperatura y batería apagan tras el arranque del motor.", c: "ALTO", r: "DAÑO SEVERO AL MOTOR", a: "Apagar motor de inmediato si persiste alerta." },
      { n: "9", t: "Escape y Ruidos: Operación pareja del motor sin golpeteos ni emisión de humo denso azul o negro.", c: "MEDIO", r: "PÉRDIDA DE POTENCIA", a: "Reportar a mantenimiento preventivo." }
    ]
  },
  {
    bloque: "Sistema hidráulico & Sistema eléctrico",
    items: [
      { n: "10", t: "Cilindros Hidráulicos: Vástagos pulidos sin rayas profundas y sellos sin fugas activas de aceite.", c: "ALTO", r: "CAÍDA DE CARGA / INESTABILIDAD", a: "NO APTO PARA OPERAR. Bloqueo LOTO inmediato." },
      { n: "11", t: "Mangueras y Acoples: Líneas de alta presión sin deformaciones ni goteos en conectores de presión.", c: "ALTO", r: "REVENTÓN DE MANGUERA", a: "NO APTO PARA OPERAR. Sustituir manguera." },
      { n: "12", t: "Batería y Master: Bornes limpios y apretados; interruptor cortacorriente operativo y con traba.", c: "MEDIO", r: "CORTOCIRCUITO / INCENDIO", a: "Ajustar bornes y limpiar sulfato." }
    ]
  },
  {
    bloque: "Componentes Esenciales",
    items: [
      { n: "13", t: "Brazos de Elevación: Estructura del boom libre de fisuras en soldaduras de pivote o por torsión.", c: "ALTO", r: "COLAPSO ESTRUCTURAL", a: "NO APTO PARA OPERAR. Reportar a taller." },
      { n: "14", t: "Cucharón y Dientes: Cuchilla sin grietas; dientes y punteras con pernos bien fijos y sin juego.", c: "MEDIO", r: "DESPRENDIMIENTO DE DIENTE", a: "Ajustar o cambiar pernos de sujeción." },
      { n: "15", t: "Acople Quick Attach: Pasadores y cuñas de traba enganchados al 100% dentro del aditamento.", c: "ALTO", r: "CAÍDA DEL ADITAMENTO", a: "NO APTO PARA OPERAR. Enganchar trabas." }
    ]
  },
  {
    bloque: "Sistemas de Control",
    items: [
      { n: "16", t: "Barra Interlock: Al subir la barra se inhabilitan joysticks y la tracción al instante en cabina.", c: "ALTO", r: "MOVIMIENTO INVOLUNTARIO", a: "NO APTO PARA OPERAR. Reparar sensor." },
      { n: "17", t: "Joysticks de Mando: Retorno automático a posición neutra de forma suave, precisa y sin trabas.", c: "ALTO", r: "ACCIONAMIENTO NO DESEADO", a: "NO APTO PARA OPERAR. Ajustar mandos." },
      { n: "18", t: "Freno de Parqueo: Inmovilización completa de la máquina al activar switch o levantar la barra.", c: "ALTO", r: "DESPLAZAMIENTO INVOLUNTARIO", a: "NO APTO PARA OPERAR. Corregir freno." }
    ]
  },
  {
    bloque: "Sistema de traslación",
    items: [
      { n: "19", t: "Estado de Neumáticos: Llantas sin cortes profundos, flancos sanos y aire a PSI recomendado.", c: "MEDIO", r: "PINCHAZO / DESESTABILIDAD", a: "Calibrar PSI o reemplazar neumático." },
      { n: "20", t: "Pernos de Rueda: Totalidad de tuercas presentes, ajustadas con torque y rin sin grieta visible.", c: "ALTO", r: "DESPRENDIMIENTO DE RUEDA", a: "NO APTO PARA OPERAR. Apretar tuercas." },
      { n: "21", t: "Tensión de Oruga: Flecha de oruga dentro de norma de fábrica; rodillos libres de barro o rocas.", c: "MEDIO", r: "DESORUGAMIENTO EN CAMPO", a: "Limpiar y ajustar tensión hidráulica." }
    ]
  },
  {
    bloque: "Equipo y Sistema de Emergencia",
    items: [
      { n: "22", t: "Extintor PQS: Unidad ABC de 6-9 lbs con manómetro en verde y recarga vigente en tarjeta visible.", c: "ALTO", r: "INCAPACIDAD CONTRA FUEGO", a: "NO APTO PARA OPERAR. Remplazar extintor." },
      { n: "23", t: "Kit Antiderrames: Paños absorbentes, salchichas y bolsas de disposición final 100% completos.", c: "MEDIO", r: "IMPACTO AMBIENTAL", a: "Completar insumos de absorción." },
      { n: "24", t: "Parada de Emergencia: Switch de corte de combustible y energía accesible y 100% funcional hoy.", c: "ALTO", r: "IMPOSIBILIDAD DE CORTE", a: "NO APTO PARA OPERAR. Reparar switch." }
    ]
  },
  {
    bloque: "Estacionamiento de Maquinaria y aseguramiento",
    items: [
      { n: "25", t: "Posición de Cucharón: Cucharón apoyado de forma plana directamente en el suelo (nunca en aire).", c: "MEDIO", r: "CAÍDA POR PÉRDIDA PRESIÓN", a: "Bajar aditamento al nivel del suelo." },
      { n: "26", t: "Aseguramiento Cabina: Freno de parqueo activo, barra arriba e interruptor cortacorriente apagado.", c: "ALTO", r: "USO NO AUTORIZADO", a: "Aplicar protocolo de apagado seguro." },
      { n: "27", t: "Cooldown de Turbo: Mantener el motor en ralentí durante 3 minutos completos previas al apagado.", c: "MEDIO", r: "DAÑO PREMATURO DE TURBO", a: "Esperar 3 min antes del corte final." }
    ]
  }
];

// Data/Minicargador/minicargador.js - Configuración Específica
const CLOUD_BASE = "https://res.cloudinary.com/ovirred3/image/upload/Checklists_PWA/Assets/Minicargador";

export const minicargadorData = {
  id: "minicargador",
  nombre: "Minicargador Frontal",
  bloques: minicargadorBloques,
  assets: {
    anatomiaUrl: `${CLOUD_BASE}/anatomia.png`,
    zonificacionUrl: `${CLOUD_BASE}/zonificacion.png`,
    buenasPracticas: [
      `${CLOUD_BASE}/bp-1.jpg`,
      `${CLOUD_BASE}/bp-2.jpg`,
      `${CLOUD_BASE}/bp-3.jpg`,
      `${CLOUD_BASE}/bp-4.jpg`,
      `${CLOUD_BASE}/bp-5.jpg`,
      `${CLOUD_BASE}/bp-6.jpg`
    ]
  }
};