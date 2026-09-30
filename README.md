# NumeraX — Juego de matemática con ranking global (HTML + CSS + JS + Firebase)

Sitio armado con **HTML, CSS y JavaScript puro** (módulos ES6 nativos, sin
build step ni frameworks), pensado para el Proyecto Final Avanzado de
Jóvenes creaTIvos. Cubre los entregables de la consigna:

| Consigna | Dónde está |
|---|---|
| Página de inicio con marca propia | `index.html` |
| Catálogo de productos/servicios | `catalogo.html` (catálogo de niveles del juego) |
| Formulario de contacto real | `contacto.html` + `js/contacto.js` |
| Panel de administrador con login | `login.html` + `admin.html` + `js/auth.js` |
| Funcionalidad con IA personalizada | `js/game.js` → `adaptiveEngine` (dificultad adaptativa + tutor de pistas) |
| **Registro y ranking de usuarios** | `registro.html`, `ingresar.html`, `ranking.html` + Firebase |

## Cómo probarlo

Abrí `index.html` en el navegador. **Ojo**: como ahora usa `import`
(módulos ES6) para todo lo de Firebase, algunos navegadores bloquean esos
imports si abrís el archivo directo con `file://`. Usá un servidor local
para desarrollar:

```bash
npx serve .
```

o la extensión **Live Server** de VS Code. En GitHub Pages funciona sin
problema porque ahí sí se sirve por `https://`.

## Primer paso: poné tu nombre de marca

Abrí `js/config.js` y cambiá `BRAND_NAME`. Se actualiza solo en todo el sitio.

---

## Configurar Firebase (obligatorio para que el registro y el ranking funcionen)

El juego en sí (`jugar.html` sin sesión iniciada) funciona sin Firebase.
Pero para que el registro, login y ranking global anden, seguí estos pasos:

### 1. Creá el proyecto

1. Andá a [console.firebase.google.com](https://console.firebase.google.com) y creá un proyecto nuevo (es gratis, no pide tarjeta).
2. Dentro del proyecto, tocá el ícono `</>` para agregar una "app web". Ponele un nombre (ej: "numerax-web") y **no** marques Firebase Hosting (ya usás GitHub Pages).
3. Firebase te va a mostrar un bloque `firebaseConfig` con 6 valores (`apiKey`, `authDomain`, etc.). Copialos.

### 2. Pegá tu configuración

Abrí `js/firebase-config.js` y reemplazá el objeto `firebaseConfig` por el que te dio Firebase:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

### 3. Activá Authentication

En el panel de Firebase: **Build → Authentication → Get started → Sign-in method**.
Activá el proveedor **"Correo electrónico/contraseña"** (Email/Password). Con eso alcanza.

### 4. Activá Firestore

**Build → Firestore Database → Create database**. Elegí modo de producción
(las reglas de abajo se encargan de la seguridad) y la región más cercana
(ej: `southamerica-east1`).

### 5. Configurá las reglas de seguridad

En **Firestore Database → Reglas**, pegá esto y publicá:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Perfil de cada usuario: solo su dueño puede escribir en el suyo.
    match /usuarios/{uid} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == uid;
    }

    // Partidas jugadas: cualquiera puede leer (para armar el ranking),
    // pero solo se puede crear una partida a nombre de uno mismo,
    // y no se puede editar ni borrar después de creada.
    match /partidas/{partidaId} {
      allow read: if true;
      allow create: if request.auth != null
                    && request.resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

Esto evita que alguien, editando el JavaScript en su navegador, guarde
puntajes a nombre de otro usuario o infle su propio puntaje escribiendo
directo en la base sin pasar por el juego.

### 6. Primer uso: creá el índice compuesto

Los rankings semanal y mensual filtran por fecha *y* ordenan por puntaje
al mismo tiempo — Firestore necesita un índice compuesto para eso, y no
lo crea solo. La primera vez que abras `ranking.html` con datos reales,
si ves un error en la consola del navegador que dice algo como *"The
query requires an index"*, **tiene un link adentro del mismo mensaje de
error**: tocalo, te lleva directo a crear el índice con un clic en la
consola de Firebase. Tarda 1-2 minutos en activarse.

---

## Estructura

```
mathquest/
├── index.html            Home + demo interactiva
├── catalogo.html          Catálogo de los 5 niveles
├── jugar.html              Pantalla de juego
├── contacto.html          Formulario de contacto
├── registro.html           Crear cuenta de jugador
├── ingresar.html            Iniciar sesión de jugador
├── ranking.html              Ranking global (semanal/mensual/histórico)
├── login.html                 Ingreso al panel admin (demo, no relacionado a Firebase)
├── admin.html                  Panel: mensajes de contacto + historial local
├── css/style.css               Toda la identidad visual
└── js/
    ├── config.js               Nombre de marca + credenciales demo del admin
    ├── common.js                Menú, marca, año del footer
    ├── game.js                   Motor del juego + IA adaptativa
    ├── contacto.js                Validación del formulario de contacto
    ├── auth.js                     Login del panel admin (demo local, no Firebase)
    ├── firebase-config.js          Inicializa Firebase (poné acá tus claves)
    ├── firebase-auth.js            Registro/login/logout de jugadores
    ├── firebase-ranking.js         Guardar partidas + consultar rankings
    ├── nav-session.js              Pinta "Ingresar/Registrarme" o "Hola, X" en el header
    ├── registro.js                 Lógica de registro.html
    ├── ingresar.js                 Lógica de ingresar.html
    ├── ranking-page.js             Lógica de ranking.html (tabs + tabla)
    └── jugar-cloud.js              Conecta el fin de partida con el ranking global
```

## Cómo funciona el ranking (modelo de datos)

Dos colecciones en Firestore:

- **`usuarios/{uid}`** → `{ nombre, email, mejorPuntaje, creadoEn }`
  Un documento por jugador, con su mejor puntaje histórico.
- **`partidas/{autoId}`** → `{ uid, nombre, puntaje, nivel, creadoEn }`
  Un documento nuevo por cada partida jugada (logueado).

Los rankings semanal y mensual filtran `partidas` por `creadoEn >= inicio
del período` y ordenan por `puntaje`. Como cada jugador puede tener
varias partidas en el mismo período, `firebase-ranking.js` pide de más
(50 resultados) y se queda con la **primera aparición de cada jugador**
—que, al venir ordenado de mayor a menor puntaje, es justo su mejor
marca de ese período— hasta completar el top 10. Es una forma simple de
lograr "un puesto por jugador" sin necesitar una consulta más compleja.

## game.js sigue funcionando solo (sin Firebase)

`game.js` no importa nada de Firebase: al terminar una partida, solo
dispara un evento (`numerax:partida-finalizada`) con el resultado.
`jugar-cloud.js` —un módulo aparte— escucha ese evento y, si hay sesión
iniciada, lo sincroniza con Firestore. Si sacás `jugar-cloud.js` de
`jugar.html`, el juego sigue andando perfecto, simplemente no se guarda
en el ranking global. Esta separación evita que el motor del juego
dependa de una librería externa para funcionar.

## Sobre la "IA personalizada"

`game.js` implementa un motor de **dificultad adaptativa basado en
reglas** (sube el nivel tras 3 aciertos seguidos, lo baja tras 2 errores)
y un tutor que genera pistas según el tipo de operación. No llama a
ninguna API externa de IA — ver el comentario al principio de
`js/game.js` para más detalle si querés conectar un modelo real más
adelante.

## Login de administrador (demo, separado de las cuentas de jugador)

- Usuario: `admin` · Contraseña: `matematica2026` (en `js/config.js`)

Este login **no tiene nada que ver con Firebase**: es el mismo candado
de demostración de antes, para el panel de mensajes de contacto. Las
cuentas de jugador (registro/ingresar) sí son reales, manejadas por
Firebase Authentication.

## Reglas del proyecto que ya cumple

- Responsive (probado desde 360px de ancho).
- Código separado en HTML / CSS / JS, con comentarios explicando decisiones técnicas.
- Sin frameworks: Firebase se usa vía su SDK modular como imports nativos de JS, sin npm ni bundler.

## Pendiente de tu lado

1. Reemplazar `BRAND_NAME` en `js/config.js`.
2. Crear tu proyecto de Firebase y completar `js/firebase-config.js` (ver arriba).
3. Activar Email/Password en Authentication y crear Firestore con las reglas de seguridad de arriba.
4. Probar el registro/login, jugar una partida logueado, y confirmar que aparece en `ranking.html`.
5. Subir todo a un repo de GitHub (mínimo 15 commits) y publicar con GitHub Pages.
