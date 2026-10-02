/**
 * firebase-config.js
 * -----------------------------------------------------------
 * Único lugar donde se inicializa Firebase.
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