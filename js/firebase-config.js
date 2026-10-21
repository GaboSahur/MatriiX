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


const RECAPTCHA_SITE_KEY = "TU_RECAPTCHA_SITE_KEY";

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(RECAPTCHA_SITE_KEY),
  isTokenAutoRefreshEnabled: true,
});

export const ai = getAI(app, { backend: new GoogleAIBackend() });

export const modeloTexto = getGenerativeModel(ai, { model: "gemini-2.0-flash" });
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
