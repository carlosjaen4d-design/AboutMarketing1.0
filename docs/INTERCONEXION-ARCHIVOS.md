# Mapa de Interconexión del Proyecto

Este documento explica **cómo se conectan entre sí** los archivos del proyecto.

## 1) Capa HTML (estructura)

- `index.html` y `pages/*.html` contienen los contenedores vacíos que luego rellena JavaScript:
  - `.ponentes__grid`
  - `.agenda__lista`
  - `.noticias__grid`
  - `#formulario-contacto`
- También cargan los scripts al final del `<body>`.

Si eliminas o renombras un contenedor, el JS asociado dejará de funcionar.

## 2) Capa JSON (datos)

- `data/ponentes.json` alimenta `js/ponentes.js`.
- `data/agenda.json` alimenta `js/agenda.js`.
- `data/noticias.json` alimenta `js/noticias.js`.

Relación de claves críticas:

- `ponentes.json`: `id`, `nombre`, `cargo`, `empresa`, `foto`, `fotoRelativa`, `tags`, `bio`, `rrss`, `charla`.
- `agenda.json`: `hora`, `titulo`, `tipo`, `ponente`, `sala`, `duracion`, `descripcion`.
- `noticias.json`: `titulo`, `fecha`, `categoria`, `imagen`, `resumen`, `contenido`.

Si cambias un nombre de clave en JSON, debes cambiar el JS que lo lee.

## 3) Capa JS (comportamiento)

- `js/navbar.js`: controla menú móvil, estado activo y scroll en navbar.
- `js/animaciones.js`: aplica `.visible` a elementos `.reveal`.
- `js/ticker.js`: rellena tracks con `data-ticker="true"`.
- `js/ponentes.js`: renderiza pósters y modal de ponentes.
- `js/agenda.js`: renderiza la línea de tiempo.
- `js/noticias.js`: renderiza cards + modal de noticia.
- `js/formulario.js`: valida y simula envío de inscripción.

## 4) Capa CSS (presentación)

- `css/variables.css`: tokens globales (colores, tipografías, espacios).
- `css/base.css`: estilos base y utilidades comunes (`.badge`, `.skeleton`, `.reveal`).
- `css/navbar.css`: estilos específicos de info bar + navbar.
- `css/componentes.css`: estilos de componentes dinámicos (cards, agenda, modal, formulario, footer).

Las clases que el JS inyecta (`.agenda-item__*`, `.noticia-card__*`, `.ponente-poster__*`) se deben mantener sincronizadas con `componentes.css`.

## 5) Rutas relativas (muy importante)

El proyecto usa dos contextos:

- Portada (`index.html`) -> rutas tipo `data/...` y `assets/...`
- Subpáginas (`pages/*.html`) -> rutas tipo `../data/...` y `../assets/...`

Por eso varios módulos JS detectan `window.location.pathname.includes('/pages/')`.

## 6) Flujo completo de ejemplo (Noticias)

1. `index.html` incluye `<div class="noticias__grid"></div>`.
2. `index.html` carga `js/noticias.js`.
3. `noticias.js` hace `fetch('data/noticias.json')`.
4. Por cada objeto JSON crea una tarjeta `.noticia-card`.
5. `componentes.css` da estilo a esa tarjeta.
6. Al hacer click, `noticias.js` abre un modal.

## 7) Checklist antes de tocar algo

- Si tocas HTML: comprobar que no rompes selectores usados por JS.
- Si tocas JSON: comprobar que mantienes las claves esperadas.
- Si tocas JS: comprobar que las clases generadas existen en CSS.
- Si tocas CSS: comprobar que las clases siguen apareciendo en HTML/JS.
- Revisar consola del navegador después de cada cambio.
