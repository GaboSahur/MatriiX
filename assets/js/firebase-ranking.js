import { auth, db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export async function guardarPartida({ puntaje, nivel }) {
  const usuario = auth.currentUser;
  if (!usuario) {
    throw new Error("Necesitás iniciar sesión para guardar tu puntaje en el ranking.");
  }

  await addDoc(collection(db, "partidas"), {
    uid: usuario.uid,
    nombre: usuario.displayName || "Jugador sin nombre",
    puntaje,
    nivel,
    creadoEn: serverTimestamp(),
  });

  const refPerfil = doc(db, "usuarios", usuario.uid);
  const snapPerfil = await getDoc(refPerfil);
  const mejorActual = snapPerfil.exists() ? snapPerfil.data().mejorPuntaje || 0 : 0;
  if (puntaje > mejorActual) {
    await updateDoc(refPerfil, { mejorPuntaje: puntaje });
  }
}

async function obtenerTopPartidas(fechaDesde) {
  const CANTIDAD_BRUTA = 50;
  const restricciones = [orderBy("puntaje", "desc"), limit(CANTIDAD_BRUTA)];
  if (fechaDesde) {
    restricciones.unshift(where("creadoEn", ">=", Timestamp.fromDate(fechaDesde)));
  }

  const consulta = query(collection(db, "partidas"), ...restricciones);
  const snapshot = await getDocs(consulta);

  const vistos = new Set();
  const resultado = [];

  snapshot.forEach((docSnap) => {
    const datos = docSnap.data();
    if (vistos.has(datos.uid)) return;
    vistos.add(datos.uid);
    resultado.push({ uid: datos.uid, nombre: datos.nombre, puntaje: datos.puntaje, nivel: datos.nivel });
  });

  return resultado.slice(0, 10);
}

export function obtenerRankingSemanal() {
  const hoy = new Date();
  const inicioSemana = new Date(hoy);
  inicioSemana.setDate(hoy.getDate() - hoy.getDay());
  inicioSemana.setHours(0, 0, 0, 0);
  return obtenerTopPartidas(inicioSemana);
}

export function obtenerRankingMensual() {
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  return obtenerTopPartidas(inicioMes);
}

export function obtenerRankingHistorico() {
  return obtenerTopPartidas(null);
}
