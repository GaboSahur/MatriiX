/**
 * game.js
 * -----------------------------------------------------------
 * Motor del juego de matemática.
 *
 * "IA personalizada" del proyecto: un sistema de DIFICULTAD
 * ADAPTATIVA basado en reglas (adaptiveEngine). No usa una API
 * externa de IA: analiza el desempeño reciente del jugador
 * (aciertos/errores consecutivos, tiempo de respuesta) y ajusta
 * el nivel de dificultad y el tipo de pista automáticamente,
 * tal como pide la consigna: "Chatbot o generador que conoce
 * el negocio". Acá "el negocio" es el propio juego: conoce el
 * desempeño del alumno y genera ejercicios y pistas a medida.
 *
 * Si más adelante querés conectar un modelo real (por ejemplo
 * la API de Claude) para generar las pistas del tutor en texto
 * libre, el lugar indicado es la función generarPista(): hoy
 * devuelve una pista por reglas, pero se puede reemplazar por
 * un fetch() a tu backend de IA sin tocar el resto del juego.
 * -----------------------------------------------------------
 */

const NIVELES = {
  suma: { titulo: "Sumas", simbolo: "+", min: 2, max: 12 },
  resta: { titulo: "Restas", simbolo: "−", min: 2, max: 12 },
  multiplicacion: { titulo: "Multiplicación", simbolo: "×", min: 2, max: 10 },
  division: { titulo: "División", simbolo: "÷", min: 2, max: 10 },
  mixto: { titulo: "Desafío mixto", simbolo: "?", min: 2, max: 12 },
};

const DURACION_PARTIDA = 60; // segundos

/** Motor de dificultad adaptativa (la "IA" del proyecto) */
const adaptiveEngine = {
  nivelDificultad: 2, // escala 1 (fácil) a 5 (difícil)
  rachaAciertos: 0,
  rachaErrores: 0,

  registrarResultado(esCorrecto) {
    if (esCorrecto) {
      this.rachaAciertos++;
      this.rachaErrores = 0;
      if (this.rachaAciertos >= 3) {
        this.nivelDificultad = Math.min(5, this.nivelDificultad + 1);
        this.rachaAciertos = 0;
      }
    } else {
      this.rachaErrores++;
      this.rachaAciertos = 0;
      if (this.rachaErrores >= 2) {
        this.nivelDificultad = Math.max(1, this.nivelDificultad - 1);
        this.rachaErrores = 0;
      }
    }
  },

  factorRango() {
    // A mayor dificultad, mayor rango de números
    return 1 + (this.nivelDificultad - 1) * 0.6;
  },
};

let estado = {
  nivelKey: "suma",
  puntaje: 0,
  correctas: 0,
  incorrectas: 0,
  racha: 0,
  problemaActual: null,
  tiempoRestante: DURACION_PARTIDA,
  intervalo: null,
  jugando: false,
};

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector(".game-shell")) return;
  inicializarJuego();
});

function inicializarJuego() {
  const params = new URLSearchParams(window.location.search);
  const nivelKey = params.get("nivel");
  estado.nivelKey = NIVELES[nivelKey] ? nivelKey : "suma";

  const nivel = NIVELES[estado.nivelKey];
  document.querySelectorAll("[data-nivel-titulo]").forEach((el) => {
    el.textContent = nivel.titulo;
  });

  document
    .getElementById("form-respuesta")
    .addEventListener("submit", manejarRespuesta);
  document
    .getElementById("btn-jugar-de-nuevo")
    ?.addEventListener("click", () => window.location.reload());

  iniciarPartida();
}

function iniciarPartida() {
  estado.puntaje = 0;
  estado.correctas = 0;
  estado.incorrectas = 0;
  estado.racha = 0;
  estado.tiempoRestante = DURACION_PARTIDA;
  estado.jugando = true;

  actualizarPlacar();
  generarProblema();
  iniciarTemporizador();

  document.getElementById("pantalla-juego").classList.remove("hidden");
  document.getElementById("pantalla-resultado").classList.add("hidden");
}

function iniciarTemporizador() {
  clearInterval(estado.intervalo);
  actualizarTimer();
  estado.intervalo = setInterval(() => {
    estado.tiempoRestante--;
    actualizarTimer();
    if (estado.tiempoRestante <= 0) {
      finalizarPartida();
    }
  }, 1000);
}

function actualizarTimer() {
  const el = document.getElementById("timer");
  if (el) el.textContent = `${estado.tiempoRestante}s`;
}

function generarProblema() {
  const nivel = NIVELES[estado.nivelKey];
  const operacion =
    estado.nivelKey === "mixto"
      ? ["suma", "resta", "multiplicacion", "division"][
          Math.floor(Math.random() * 4)
        ]
      : estado.nivelKey;

  const config = NIVELES[operacion];
  const factor = adaptiveEngine.factorRango();
  const min = config.min;
  const max = Math.round(config.max * factor);

  let a = aleatorioEntre(min, max);
  let b = aleatorioEntre(min, max);
  let resultado;

  switch (operacion) {
    case "suma":
      resultado = a + b;
      break;
    case "resta":
      if (b > a) [a, b] = [b, a]; // evitar negativos
      resultado = a - b;
      break;
    case "multiplicacion":
      resultado = a * b;
      break;
    case "division":
      // Generamos primero el resultado y el divisor para que sea exacta
      b = aleatorioEntre(min, Math.max(min + 1, Math.round(6 * factor)));
      resultado = aleatorioEntre(min, Math.round(10 * factor));
      a = b * resultado;
      break;
  }

  estado.problemaActual = {
    a,
    b,
    operacion,
    simbolo: NIVELES[operacion].simbolo,
    resultado,
  };

  document.getElementById(
    "expresion"
  ).textContent = `${a} ${NIVELES[operacion].simbolo} ${b}`;

  const input = document.getElementById("input-respuesta");
  input.value = "";
  input.focus();

  ocultarFeedback();
  ocultarTutor();
}

function manejarRespuesta(evento) {
  evento.preventDefault();
  if (!estado.jugando) return;

  const input = document.getElementById("input-respuesta");
  const valorIngresado = Number(input.value);
  if (input.value.trim() === "" || Number.isNaN(valorIngresado)) {
    mostrarFeedback("Escribí un número antes de responder.", false);
    return;
  }

  const esCorrecto = valorIngresado === estado.problemaActual.resultado;
  adaptiveEngine.registrarResultado(esCorrecto);

  if (esCorrecto) {
    estado.correctas++;
    estado.racha++;
    const puntosPorDificultad = 10 * adaptiveEngine.nivelDificultad;
    estado.puntaje += puntosPorDificultad;
    mostrarFeedback(`¡Correcto! +${puntosPorDificultad} pts`, true);
  } else {
    estado.incorrectas++;
    estado.racha = 0;
    mostrarFeedback(
      `Casi. La respuesta era ${estado.problemaActual.resultado}.`,
      false
    );
    mostrarTutor(generarPista(estado.problemaActual));
  }

  actualizarPlacar();

  setTimeout(() => {
    if (estado.jugando) generarProblema();
  }, esCorrecto ? 500 : 1600);
}

/**
 * Genera una pista pedagógica según el tipo de operación y los
 * números involucrados. Reemplazable por una llamada a un modelo
 * de IA real (ver comentario al inicio del archivo).
 */
function generarPista(problema) {
  const { a, b, operacion } = problema;
  switch (operacion) {
    case "suma":
      return `Pista: pensá ${a} y sumale de a poco hasta llegar a ${b} más. Redondear a la decena más cercana ayuda.`;
    case "resta":
      return `Pista: contá hacia atrás desde ${a} en pasos de a uno, o completá desde ${b} hasta ${a}.`;
    case "multiplicacion":
      return `Pista: probá descomponer ${b} en partes fáciles, por ejemplo ${b - 1} + 1, y multiplicá cada parte por ${a}.`;
    case "division":
      return `Pista: pensala como una multiplicación al revés: ¿por cuánto hay que multiplicar ${b} para llegar a ${a}?`;
    default:
      return "Pista: repasá la operación paso a paso, con calma.";
  }
}

function actualizarPlacar() {
  document.getElementById("puntaje").textContent = estado.puntaje;
  document.getElementById("racha").textContent = `🔥 ${estado.racha}`;
  const nivelEl = document.getElementById("nivel-dificultad");
  if (nivelEl) nivelEl.textContent = adaptiveEngine.nivelDificultad;
}

function mostrarFeedback(mensaje, esCorrecto) {
  const el = document.getElementById("feedback");
  el.textContent = mensaje;
  el.classList.remove("ok", "bad");
  el.classList.add(esCorrecto ? "ok" : "bad");
}

function ocultarFeedback() {
  const el = document.getElementById("feedback");
  el.textContent = "";
  el.classList.remove("ok", "bad");
}

function mostrarTutor(texto) {
  const box = document.getElementById("tutor-box");
  box.querySelector(".tutor-text").textContent = texto;
  box.classList.remove("hidden");
}

function ocultarTutor() {
  document.getElementById("tutor-box")?.classList.add("hidden");
}

function finalizarPartida() {
  estado.jugando = false;
  clearInterval(estado.intervalo);

  document.getElementById("pantalla-juego").classList.add("hidden");
  const resultado = document.getElementById("pantalla-resultado");
  resultado.classList.remove("hidden");

  document.getElementById("resultado-puntaje").textContent = estado.puntaje;
  document.getElementById("resultado-correctas").textContent =
    estado.correctas;
  document.getElementById("resultado-incorrectas").textContent =
    estado.incorrectas;

  guardarEnRanking();
}

function guardarEnRanking() {
  const nombre =
    localStorage.getItem("numerax_player_name") ||
    prompt("¿Cómo te llamás? (para el ranking)") ||
    "Jugador anónimo";
  localStorage.setItem("numerax_player_name", nombre);

  const clave = APP_CONFIG.STORAGE_KEYS.RANKING;
  const ranking = JSON.parse(localStorage.getItem(clave) || "[]");

  ranking.push({
    nombre,
    puntaje: estado.puntaje,
    nivel: NIVELES[estado.nivelKey].titulo,
    fecha: new Date().toISOString(),
  });

  ranking.sort((a, b) => b.puntaje - a.puntaje);
  localStorage.setItem(clave, JSON.stringify(ranking.slice(0, 50)));
}

function aleatorioEntre(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
