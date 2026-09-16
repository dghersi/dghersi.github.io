// Core/loto-engine.js - Motor de Evaluación LOTO y Reglas de Criticidad

function evaluateLoto(answers) {
  // Retorna true si al menos un ítem de criticidad ALTO tiene respuesta "NO"
  let hasCriticalFail = false;
  const failedItems = [];

  for (const key in answers) {
    if (answers[key].val === "NO") {
      failedItems.push(answers[key]);
      if (answers[key].crit === "ALTO") {
        hasCriticalFail = true;
      }
    }
  }

  return {
    isLoto: hasCriticalFail,
    failedCount: failedItems.length,
    failedItems: failedItems
  };
}

// Exportación global
window.evaluateLoto = evaluateLoto;