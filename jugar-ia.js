/**
 * jugar-ia.js
 * -----------------------------------------------------------
 * Conecta game.js con Gemini sin que game.js sepa que existe
 * Firebase ni la IA. Escucha dos eventos que dispara el juego:
 *
 *   "numerax:pedir-problema-ia" -> responde con
 *        "numerax:problema-ia-listo" { enunciado, respuesta, pista }
 *   "numerax:pedir-pista-ia"    -> responde con
 *        "numerax:pista-ia-lista"    { texto }
 *
 * Regla de oro: el juego NUNCA se queda trabado esperando a la IA.
 * Cada llamada tiene un tiempo límite; si Gemini tarda de más, falla
 * o no hay conexión, el problema se resuelve con un plan B local
 * (un ejercicio simple armado acá mismo) y la pista simplemente no
 * se mejora (el jugador ya tiene la pista por reglas en pantalla).
 * -----------------------------------------------------------
 */
import { generarEjercicioIA, generarPistaIA } from "./firebase-ai.js";

const TIMEOUT_PROBLEMA_MS = 8000;
const TIMEOUT_PISTA_MS = 6000;

/** Rechaza la promesa si tarda más que `ms` milisegundos */
function conTimeout(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => setTimeout(() => rechazar(new Error("Tiempo de espera agotado")), ms)),
  ]);
}

/** Plan B: ejercicio local simple, escalado por la dificultad pedida */
function ejercicioDeRespaldo(dificultad) {
  const tope = 6 + dificultad * 6;
  const a = Math.floor(Math.random() * tope) + 2;
  const b = Math.floor(Math.random() * tope) + 2;
  return {
    enunciado: `${a} + ${b}`,
    respuesta: a + b,
    pista: `Sumá ${a} y ${b} de a poco: primero llevá uno de los dos a la decena más cercana.`,
  };
}

function emitir(nombre, detalle) {
  document.dispatchEvent(new CustomEvent(nombre, { detail: detalle }));
}

document.addEventListener("numerax:pedir-problema-ia", async (evento) => {
  const dificultad = evento.detail?.dificultad ?? 2;
  try {
    const ejercicio = await conTimeout(generarEjercicioIA(dificultad), TIMEOUT_PROBLEMA_MS);
    emitir("numerax:problema-ia-listo", ejercicio);
  } catch (error) {
    console.warn("La IA no pudo generar el ejercicio, uso el plan B:", error);
    emitir("numerax:problema-ia-listo", ejercicioDeRespaldo(dificultad));
  }
});

document.addEventListener("numerax:pedir-pista-ia", async (evento) => {
  try {
    const texto = await conTimeout(generarPistaIA(evento.detail), TIMEOUT_PISTA_MS);
    if (texto) emitir("numerax:pista-ia-lista", { texto });
  } catch (error) {
    console.warn("La IA no pudo mejorar la pista, queda la pista por reglas:", error);
  }
});
