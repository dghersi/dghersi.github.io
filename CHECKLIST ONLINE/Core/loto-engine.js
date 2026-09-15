// Motor de Evaluación LOTO y Reglas de Criticidad
function evaluateLoto(answers) {
  // Retorna true si al menos un ítem con criticidad ALTO tiene respuesta "NO"
  return Object.values(answers).some(a => a.val === "NO" && a.crit === "ALTO");
}