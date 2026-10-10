import { auth, db } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export async function registrarUsuario(nombre, email, password) {
  try {
    const credencial = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credencial.user, { displayName: nombre.trim() });
    await setDoc(doc(db, "usuarios", credencial.user.uid), {
      nombre: nombre.trim(),
      email: email.trim(),
      mejorPuntaje: 0,
      creadoEn: serverTimestamp(),
    });
    return credencial.user;
  } catch (error) {
    console.error("Error en registrarUsuario:", error.code, error.message);
    throw error;
  }
}

export function iniciarSesion(email, password) {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function cerrarSesion() {
  return signOut(auth);
}

export function observarSesion(callback) {
  return onAuthStateChanged(auth, callback);
}

export function traducirErrorAuth(error) {
  const mapa = {
    "auth/email-already-in-use": "Ese correo ya tiene una cuenta registrada.",
    "auth/invalid-email": "El correo no tiene un formato válido.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-not-found": "No hay ninguna cuenta con ese correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Esperá un momento y probá de nuevo.",
  };
  return mapa[error.code] || "Ocurrió un error inesperado. Probá de nuevo.";
}
