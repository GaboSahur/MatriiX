/**
 * firebase-config.js
 * -----------------------------------------------------------
 * Único lugar donde se inicializa Firebase. El resto de los
 * módulos (firebase-auth.js, firebase-ranking.js, firebase-ai.js)
 * importan `auth`, `db` y `ai` desde acá — así el proyecto entero
 * apunta siempre a la misma instancia.
 *
 * Se usa el SDK modular de Firebase servido directo desde su CDN
 * como módulos ES nativos: no hace falta npm, ni un bundler, ni
 * un paso de build. Funciona tal cual en GitHub Pages porque el
 * navegador entiende `import` de forma nativa (por eso
 * <script type="module"> en el HTML).
 *
 * Versión del SDK: 12.17.1. Subimos desde la 10.13.0 original
 * porque el producto de IA (firebase-ai.js) recién se agregó al
 * SDK en versiones 12.x — si alguna vez tenés que tocar esta
 * versión, cambiala en TODOS los imports de gstatic a la vez
 * (app, auth, firestore, ai, app-check), nunca mezcles versiones
 * entre ellos.
 *
 * ANTES DE USAR: reemplazá firebaseConfig con los valores de TU
 * proyecto (Firebase Console → ⚙ Configuración del proyecto →
 * Tus apps → "Config" del SDK). Instrucciones completas en
 * README.md.
 * -----------------------------------------------------------
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";
import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-ai.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-check.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP-Zzb9_9cQCglwHS76Y-QhtcB1rgFjMY",
  authDomain: "matrix-77d55.firebaseapp.com",
  projectId: "matrix-77d55",
  storageBucket: "matrix-77d55.firebasestorage.app",
  messagingSenderId: "533802082287",
  appId: "1:533802082287:web:ac5cadece071beec5d601a",
};

// Clave pública de reCAPTCHA v3 que te da Firebase al activar
// App Check (ver README → "Activar Firebase AI Logic"). Es una
// clave de SITIO (site key), no un secreto: está diseñada para
// vivir en el frontend, igual que firebaseConfig de arriba.
const RECAPTCHA_SITE_KEY = "TU_RECAPTCHA_SITE_KEY";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// App Check protege la API de Gemini para que nadie la use desde
// fuera de tu sitio (un bot, un scraper, otra página copiando tu
// código). Es obligatorio desde que Firebase lo exige para AI Logic.
// Si todavía no activaste AI Logic / App Check en la consola, esto
// no rompe nada: initializeAppCheck no falla por una key placeholder,
// simplemente las llamadas a Gemini van a fallar más adelante hasta
// que pongas la key real.
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

// Backend "Gemini Developer API" (GoogleAIBackend): es el que no
// necesita que actives el plan de pago Blaze, a diferencia del
// backend de Vertex AI / Agent Platform. Con el plan gratis Spark
// que ya tenés alcanza.
export const ai = getAI(app, { backend: new GoogleAIBackend() });

/**
 * Modelo compartido para texto simple (pistas, chat). Exportado
 * acá para que firebase-ai.js no tenga que repetir esta config.
 */
export const modeloTexto = getGenerativeModel(ai, { model: "gemini-2.0-flash" });
