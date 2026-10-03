/**
 * Genera ejercicios de porcentajes simples.
 * Ejemplos:
 * - 20% de 80
 * - 25% de 100
 */

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generarEjercicioPorcentajes() {
  const porcentaje = [10, 15, 20, 25, 30, 50, 75][
    aleatorioEntre(0, 6)
  ];
  const base = aleatorioEntre(10, 200);

  const resultado = (base * porcentaje) / 100;

  return {
    tema: "porcentajes",
    tipo: "calculo",
    enunciado: `¿Cuál es ${porcentaje}% de ${base}?`,
    respuesta: String(resultado),
    pista:
      "Convierte el porcentaje en una fracción o divide por 10 y multiplica.",
    datos: {
      porcentaje,
      base,
      resultado,
    },
  };
}
