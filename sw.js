/**
 * sw.js — Service Worker
 * ==============================================================
 * MEJORA #27 — Soporte offline básico y caché de assets
 *
 * ¿Qué es un Service Worker?
 * Es un script que el navegador ejecuta EN SEGUNDO PLANO,
 * separado de la página web. Actúa como un "intermediario"
 * entre la web y la red.
 *
 * Puede interceptar peticiones de red y decidir:
 * - ¿Uso la versión cacheada? (rápido, funciona offline)
 * - ¿Pido al servidor la versión nueva? (siempre actualizado)
 *
 * CICLO DE VIDA:
 * 1) INSTALL → Se cachean los archivos estáticos
 * 2) ACTIVATE → Se limpian cachés antiguas
 * 3) FETCH → Se interceptan peticiones de red
 *
 * NOTA: Solo funciona con HTTPS o en localhost.
 * En desarrollo con file:// NO funcionará.
 *
 * INTERCONEXIÓN:
 * - Registrado desde: js/mejoras.js (función registrarServiceWorker)
 * - Debe estar en la RAÍZ del proyecto (no en /js/)
 */

// Nombre de la caché. Cambiar la versión fuerza una actualización.
const NOMBRE_CACHE = 'about-marketing-v1';

// Archivos que se cachearán en la instalación.
// Son los archivos "core" que necesitamos para que la web
// funcione sin conexión a internet.
const ARCHIVOS_CORE = [
  '/',
  '/index.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/navbar.css',
  '/css/componentes.css',
  '/js/navbar.js',
  '/js/animaciones.js',
  '/js/ticker.js',
  '/js/mejoras.js'
];

/**
 * EVENTO INSTALL — Se ejecuta cuando el Service Worker se instala.
 *
 * Aquí pre-cacheamos los archivos core.
 * self.skipWaiting() hace que el nuevo SW se active inmediatamente
 * sin esperar a que se cierren todas las pestañas.
 */
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(NOMBRE_CACHE)
      .then((cache) => cache.addAll(ARCHIVOS_CORE))
      .then(() => self.skipWaiting())
  );
});

/**
 * EVENTO ACTIVATE — Se ejecuta cuando el SW toma el control.
 *
 * Aquí limpiamos cachés antiguas (de versiones anteriores).
 * clients.claim() hace que el SW controle todas las pestañas
 * abiertas inmediatamente.
 */
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nombres) => {
        return Promise.all(
          nombres
            .filter((nombre) => nombre !== NOMBRE_CACHE)
            .map((nombre) => caches.delete(nombre))
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * EVENTO FETCH — Se ejecuta cada vez que la página pide un recurso.
 *
 * Estrategia: "Stale While Revalidate"
 * 1) Si el recurso está en caché → lo devolvemos inmediatamente (rápido)
 * 2) Al mismo tiempo, pedimos la versión nueva al servidor
 * 3) Si la obtenemos, actualizamos la caché para la próxima vez
 *
 * Así la web es rápida Y se mantiene actualizada.
 */
self.addEventListener('fetch', (evento) => {
  // Solo cacheamos peticiones GET (no POST, PUT, DELETE...)
  if (evento.request.method !== 'GET') return;

  evento.respondWith(
    caches.match(evento.request).then((respuestaCache) => {
      // Pedimos al servidor en paralelo
      const peticionRed = fetch(evento.request)
        .then((respuestaRed) => {
          // Si la respuesta es válida, la guardamos en caché
          if (respuestaRed && respuestaRed.status === 200) {
            const copia = respuestaRed.clone();
            caches.open(NOMBRE_CACHE).then((cache) => {
              cache.put(evento.request, copia);
            });
          }
          return respuestaRed;
        })
        .catch(() => {
          // Si falla la red y tenemos caché, devolvemos la caché
          // (esto es lo que permite funcionar offline)
          return respuestaCache;
        });

      // Devolvemos la caché si existe, si no esperamos a la red
      return respuestaCache || peticionRed;
    })
  );
});
