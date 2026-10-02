/**
 * config.js
 * -----------------------------------------------------------
 * Configuración global del sitio. Cuando tengas el nombre
 * definitivo de tu marca, cambiá SOLO el valor de BRAND_NAME
 * (y si querés, BRAND_TAG) y se actualiza en todas las páginas
 * automáticamente vía common.js.
 * -----------------------------------------------------------
 */
const APP_CONFIG = {
  BRAND_NAME: "NumeraX", // <-- Reemplazá acá por el nombre real de tu marca
  BRAND_TAG: "Práctica de matemática, nivel avanzado",

  // Credenciales de DEMO para el panel de admin.
  // Esto es solo un candado de ejemplo en el navegador (localStorage).
  // Para producción real esto debe validarse en un backend con
  // contraseñas hasheadas, nunca en JavaScript del cliente.
  ADMIN_DEMO_USER: "admin",
  ADMIN_DEMO_PASS: "matematica2026",

  // Claves usadas en localStorage
  STORAGE_KEYS: {
    RANKING: "numerax_ranking",
    MESSAGES: "numerax_messages",
    SESSION: "numerax_admin_session",
  },
};
