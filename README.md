# NumeraX — Juego de matemática (nivel moderado, HTML + CSS + JS)

Sitio armado con **HTML, CSS y JavaScript puro** (sin frameworks ni backend),
pensado como punto de partida para el Proyecto Final Avanzado de Jóvenes
creaTIvos. Cubre los entregables de la consigna adaptados a un juego:

| Consigna | Dónde está |
|---|---|
| Página de inicio con marca propia | `index.html` |
| Catálogo de productos/servicios | `catalogo.html` (catálogo de niveles del juego) |
| Formulario de contacto real | `contacto.html` + `js/contacto.js` |
| Panel de administrador con login | `login.html` + `admin.html` + `js/auth.js` |
| Funcionalidad con IA personalizada | `js/game.js` → `adaptiveEngine` (dificultad adaptativa + tutor de pistas) |

## Cómo probarlo

Solo abrí `index.html` en el navegador (no necesita servidor ni instalación).
Para desarrollarlo con recarga automática podés usar la extensión **Live
Server** de VS Code, o correr `npx serve .` desde esta carpeta.

## Primer paso: poné tu nombre de marca

Abrí `js/config.js` y cambiá esta línea:

```js
BRAND_NAME: "NumeraX",
```

Se actualiza solo en todas las páginas (header, footer, título de pestaña).

## Estructura

```
mathquest/
├── index.html        Home + demo interactiva
├── catalogo.html      Catálogo de los 5 niveles
├── jugar.html          Pantalla de juego
├── contacto.html      Formulario de contacto
├── login.html          Ingreso al panel admin
├── admin.html          Panel: ranking + mensajes
├── css/style.css       Toda la identidad visual
└── js/
    ├── config.js       Nombre de marca + credenciales demo
    ├── common.js        Menú, marca, año del footer
    ├── game.js           Motor del juego + IA adaptativa
    ├── contacto.js       Validación del formulario
    └── auth.js            Login + panel admin
```

## Sobre la "IA personalizada"

No se llama a ninguna API externa (para eso hace falta un backend con una
API key protegida, algo para más adelante en la ruta). En cambio, `game.js`
implementa un motor de **dificultad adaptativa basado en reglas**: sube el
nivel después de 3 aciertos seguidos, lo baja después de 2 errores seguidos,
y genera pistas de texto según el tipo de operación en la que fallaste. Es
una forma honesta de mostrar personalización sin depender de servicios
externos ni exponer claves en el cliente.

Si más adelante querés conectar un modelo de IA real (por ejemplo para que
el tutor escriba pistas con lenguaje más natural), el lugar indicado es la
función `generarPista()` en `js/game.js`: hoy devuelve texto fijo por
reglas, pero se puede reemplazar por un `fetch()` a tu propio backend.

## Login de administrador (demo)

- Usuario: `admin`
- Contraseña: `matematica2026`

Se validan en el navegador (`js/config.js`) y solo sirven para mostrar el
flujo del panel privado. **No es un login seguro de verdad**: cualquiera
que abra el código fuente puede ver la contraseña. Para producción real
hace falta un backend que valide credenciales con hash y devuelva un token
de sesión — eso corresponde a las semanas de "Backend + React" del roadmap.

## Dónde vive la información (localStorage)

Como todavía no hay backend, los datos se guardan en el navegador de quien
usa la página (`localStorage`), no en un servidor compartido:

- `numerax_ranking` → puntajes de las partidas jugadas.
- `numerax_messages` → mensajes enviados por el formulario de contacto.

Esto significa que el ranking y los mensajes que ves en `admin.html` son
solo los generados **en ese mismo navegador**. Cuando construyan el
backend (base de datos + API), reemplazan estas llamadas a `localStorage`
por `fetch()` a sus propios endpoints, y ahí sí todos los jugadores
comparten el mismo ranking real.

## Reglas del proyecto que ya cumple

- Es responsive (probado desde 360px de ancho).
- No usa librerías externas más que fuentes de Google Fonts.
- Código separado en HTML / CSS / JS, con comentarios explicando decisiones
  técnicas (especialmente en `game.js` y `auth.js`).

## Pendiente de tu lado

- Reemplazar `BRAND_NAME` con tu nombre definitivo.
- Subir esta carpeta a un repo de GitHub y hacer al menos 15 commits.
- Publicarlo en GitHub Pages.
- Cuando lleguen a la etapa de backend, migrar `localStorage` a una base de
  datos real detrás de una API.
