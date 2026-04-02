# About Marketing - Web oficial del evento

Proyecto web del evento **About Marketing** (1.º DAW, IES Alonso de Avellaneda).

La web está construida con HTML, CSS, JavaScript y JSON, y sigue una estructura modular para facilitar el mantenimiento por parte de alumnado que está empezando.

## Tecnologías

- HTML5 semántico
- CSS3 modular
- JavaScript moderno (ES6+)
- JSON para contenido dinámico

## Estructura del proyecto

- `index.html`: portada
- `pages/`: subpáginas (`ponentes`, `agenda`, `noticias`, `contacto`)
- `css/`: estilos por responsabilidad
- `js/`: lógica por componente
- `data/`: datos JSON
- `assets/img/`: recursos gráficos
- `docs/`: documentación académica de mantenimiento

## Cómo ejecutar

1. Abre la carpeta en VS Code.
2. Usa una extensión tipo **Live Server**.
3. Lanza `index.html` con servidor local.

No abras los HTML con doble clic porque `fetch()` necesita contexto HTTP local para leer los JSON.

## Documentación para estudio

- `docs/MANTENIMIENTO-1DAW.md`: guía práctica de mantenimiento por componente.
- `docs/INTERCONEXION-ARCHIVOS.md`: mapa completo de interconexión HTML-CSS-JS-JSON.

## Mantenimiento rápido

Si tocas una parte, revisa su cadena completa:

1. HTML (contenedor)
2. JS (render o comportamiento)
3. JSON (datos)
4. CSS (clases generadas o usadas)

## Autoría

Proyecto desarrollado por alumnado de **1.º DAW** para Lenguaje de Marcas.
