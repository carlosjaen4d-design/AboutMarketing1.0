# Guia de Mantenimiento (1o DAW)

## 1. Objetivo
Esta guia explica como mantener y modificar el proyecto por componentes, sin romper otras partes del sitio.

Principio clave: **una responsabilidad por archivo**.

## 2. Arquitectura modular
- `index.html` y `pages/*.html`: estructura de cada pagina.
- `css/variables.css`: colores, tipografias, espaciado y radios.
- `css/base.css`: reset, estilos globales, botones y utilidades.
- `css/navbar.css`: solo barra superior y menu movil.
- `css/componentes.css`: componentes visuales (hero, cards, agenda, footer, etc.).
- `js/navbar.js`: comportamiento del menu.
- `js/animaciones.js`: animaciones con `IntersectionObserver`.
- `js/ticker.js`: cintas de palabras animadas.
- `js/ponentes.js`: tarjetas y modal de ponentes.
- `js/agenda.js`: timeline de agenda desde JSON.
- `js/noticias.js`: cards y modal de noticias.
- `js/formulario.js`: validacion del formulario.
- `data/*.json`: datos editables del sitio.

## 3. Como alterar cada componente

### Navbar
- Estructura: HTML en cada pagina (`<nav class="navbar">`).
- Estilo: `css/navbar.css`.
- Comportamiento: `js/navbar.js`.
- Cambio tipico: editar enlaces en HTML y comprobar clase activa.

### Hero y secciones de portada
- Estructura: `index.html`.
- Estilo: `css/componentes.css` (bloques `HERO`, `TICKER`, `CTA`, etc.).
- Cambio tipico: textos en HTML y estilo en CSS.

### Ponentes
- Datos: `data/ponentes.json`.
- Renderizado: `js/ponentes.js`.
- Estilo tarjeta/modal: `css/componentes.css`.
- Cambio tipico:
  1. anadir objeto en JSON,
  2. comprobar que `foto`/`fotoRelativa` apunta bien,
  3. revisar visualmente tarjeta y modal.

### Agenda
- Datos: `data/agenda.json`.
- Renderizado: `js/agenda.js`.
- Estilo timeline: `css/componentes.css`.
- Cambio tipico: actualizar horas, titulos, tipo y descripcion en JSON.

### Noticias
- Datos: `data/noticias.json`.
- Renderizado: `js/noticias.js`.
- Estilo cards/modal: `css/componentes.css`.
- Cambio tipico:
  1. anadir noticia en JSON,
  2. revisar `fecha` en formato `YYYY-MM-DD`,
  3. comprobar ruta de imagen.

### Formulario
- Estructura: `pages/contacto.html`.
- Estilo: `css/componentes.css` (bloque `FORMULARIO`).
- Validacion: `js/formulario.js`.
- Cambio tipico: si anades un campo obligatorio, incluye su validacion en `validarFormulario`.

### Tickers
- Estructura: elementos `.ticker__track` en HTML.
- Comportamiento: `js/ticker.js`.
- Para activar un track: atributo `data-ticker="true"`.
- Para invertir direccion: `data-ticker-reverse="true"`.

## 4. Reglas de mantenibilidad
- No mezclar JS inline en HTML.
- No duplicar logica entre archivos.
- Mantener nombres de clase coherentes (`bloque__elemento--modificador`).
- Documentar funciones con comentarios cortos y utiles.
- Si cambias un JSON, revisar todas las paginas que lo consumen.

## 5. Flujo recomendado de cambios
1. Cambia datos (JSON) o estructura (HTML).
2. Ajusta estilo (CSS).
3. Ajusta comportamiento (JS).
4. Prueba portada + subpaginas.
5. Revisa consola del navegador (sin errores).

## 6. Referencias academicas
- HTML semantico:
  https://developer.mozilla.org/es/docs/Glossary/Semantics
- CSS custom properties:
  https://developer.mozilla.org/es/docs/Web/CSS/Using_CSS_custom_properties
- Fetch API:
  https://developer.mozilla.org/es/docs/Web/API/Fetch_API
- Manipulacion del DOM:
  https://developer.mozilla.org/es/docs/Web/API/Document_Object_Model
- IntersectionObserver:
  https://developer.mozilla.org/es/docs/Web/API/Intersection_Observer_API
- Validacion de formularios:
  https://developer.mozilla.org/es/docs/Learn/Forms/Form_validation

## 7. Checklist rapido antes de entregar
- [ ] No hay rutas rotas de imagen o JSON.
- [ ] No hay JS inline en HTML.
- [ ] No hay errores en consola.
- [ ] Todas las funciones JS tienen nombre claro y responsabilidad unica.
- [ ] Se mantiene consistencia visual en movil y escritorio.
