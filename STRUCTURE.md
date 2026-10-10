# Estructura segura de MatriiX

Este repositorio mantiene los archivos legacy en la raíz para no romper la web estática actual, y añade una estructura organizada en carpetas nuevas para una migración progresiva.

## Estructura recomendada

assets/
  css/
  js/
    app/
    auth/
    common/
    firebase/
    forms/
    generators/
server/
  backend/
  package.json

## Nota

- Los archivos originales en la raíz se conservan por compatibilidad.
- La nueva estructura está preparada para ir migrando rutas sin romper el sitio.
- El archivo `.env` no se sube al repositorio; se usa `.env.example` como plantilla.
