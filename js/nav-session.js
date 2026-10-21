(async () => {
 
  const { observarSesion, cerrarSesion } = await import("./firebase-auth.js");

  document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById("nav-cuenta");
    if (!contenedor) return;

    observarSesion((usuario) => {
      contenedor.innerHTML = usuario
        ? plantillasSesionActiva(usuario)
        : plantillaSinSesion();

      if (usuario) {
        document.getElementById("btn-cerrar-sesion").addEventListener("click", async () => {
          await cerrarSesion();
          window.location.href = "index.html";
        });
      }
    });
  });
})(); 

function plantillaSesionActiva(usuario) {
  const nombre = escaparHtml(usuario.displayName || usuario.email);
  return `
    <span class="nav-user">👤 ${nombre}</span>
    <button class="btn btn-ghost" id="btn-cerrar-sesion" type="button">Salir</button>
  `;
}

function plantillaSinSesion() {
  return `
    <a href="ingresar.html" class="btn btn-ghost">Ingresar</a>
    <a href="registro.html" class="btn btn-primary">Registrarme</a>
  `;
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}
