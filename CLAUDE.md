# About Marketing 1.0 - Instrucciones para Claude Code

## Proyecto
Website de evento de marketing para 1º DAW del IES Alonso de Avellaneda.
Evento: 26 de marzo de 2026, 18:45h, 2 ponentes.

## Stack
- HTML5 semántico, CSS3 modular (custom properties), JS ES6+ modular, JSON para datos dinámicos
- Service Worker para offline support
- Sin frameworks ni bundlers

## Estructura
```
index.html          → Landing principal
pages/              → ponentes.html, agenda.html, noticias.html, contacto.html
css/                → variables.css, base.css, navbar.css, componentes.css
js/                 → navbar.js, animaciones.js, ticker.js, mejoras.js, ponentes.js, agenda.js, noticias.js, formulario.js
data/               → ponentes.json, agenda.json, noticias.json
assets/img/         → Imágenes del evento y ponentes
docs/               → INTERCONEXION-ARCHIVOS.md, MANTENIMIENTO-1DAW.md
```

## Sistema de Continuación Automática

**IMPORTANTE: Lee esto al inicio de cada sesión.**

Este proyecto usa un sistema de continuación para que el trabajo no se pierda entre sesiones.

### Al iniciar una sesión:
1. Lee `PLAN.md` para ver el roadmap completo y qué tareas están pendientes
2. Lee `.claude/continuation.md` para ver el estado exacto de la última sesión
3. Continúa desde el punto marcado como `## Estado Actual` en continuation.md

### Al finalizar una sesión (o antes de quedarte sin tokens):
1. Actualiza `.claude/continuation.md` con:
   - Qué se completó en esta sesión
   - En qué punto exacto te quedaste
   - Qué archivos se modificaron
   - Próximo paso concreto a ejecutar
2. Actualiza `PLAN.md` marcando las tareas completadas con [x]
3. Haz commit y push de los cambios

### Reglas de desarrollo:
- Branch de trabajo: usar el branch indicado en la tarea
- Commits descriptivos en español
- No romper funcionalidad existente
- Mantener la arquitectura modular (1 archivo = 1 responsabilidad)
- Documentar cambios en los archivos de docs/ si es relevante
- Respetar el diseño educativo del proyecto (comentarios claros para estudiantes)
