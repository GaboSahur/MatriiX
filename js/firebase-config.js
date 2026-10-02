/**
 * firebase-config.js
 * -----------------------------------------------------------
 * Único lugar donde se inicializa Firebase. El resto de los
 * módulos (firebase-auth.js, firebase-ranking.js) importan
 * `auth` y `db` desde acá — así el proyecto entero apunta
 * siempre a la misma instancia.
 *
 * Se usa el SDK modular de Firebase v10 servido directo desde
 * su CDN como módulos ES nativos: no hace falta npm, ni un
 * bundler, ni un paso de build. Funciona tal cual en GitHub
 * Pages porque el navegador entiende `import` de forma nativa
 * (por eso <script type="module"> en el HTML).
 *
 * ANTES DE USAR: reemplazá firebaseConfig con los valores de
 * TU proyecto (Firebase Console → ⚙ Configuración del proyecto
 * → Tus apps → "Config" del SDK). Instrucciones completas en
 * README.md.
 * -----------------------------------------------------------
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAP-Zzb9_9cQCglwHS76Y-QhtcB1rgFjMY",
  authDomain: "matrix-77d55.firebaseapp.com",
  projectId: "matrix-77d55",
  storageBucket: "matrix-77d55.firebasestorage.app",
  messagingSenderId: "533802082287",
  appId: "1:533802082287:web:ac5cadece071beec5d601a",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
