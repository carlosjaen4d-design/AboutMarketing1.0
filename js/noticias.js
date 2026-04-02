/**
 * noticias.js
 * --------------------------------------------------------------
 * INTERCONEXIÓN DEL MÓDULO
 * - Lee datos de: /data/noticias.json
 * - Pinta en: .noticias__grid (index.html y pages/noticias.html)
 * - Clases visuales en: /css/componentes.css (bloque NOTICIAS)
 *
 * También crea un modal con estilos inline.
 */

function estamosEnSubpagina() {
  return window.location.pathname.includes('/pages/');
}

function obtenerRutaNoticias() {
  return estamosEnSubpagina() ? '../data/noticias.json' : 'data/noticias.json';
}

/**
 * Interconexión de rutas de imagen:
 * - Si JSON guarda "assets/..." y estamos en /pages -> añadir "../"
 * - Si JSON guarda "../assets/..." y estamos en portada -> quitar "../"
 */
function resolverRutaImagen(rutaOriginal) {
  if (!rutaOriginal) return '';

  if (estamosEnSubpagina() && rutaOriginal.startsWith('assets/')) {
    return `../${rutaOriginal}`;
  }

  if (!estamosEnSubpagina() && rutaOriginal.startsWith('../')) {
    return rutaOriginal.replace('../', '');
  }

  return rutaOriginal;
}

function formatearFecha(fechaISO) {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Crea una tarjeta de noticia.
 * Clases usadas aquí deben existir en css/componentes.css.
 */
function crearTarjetaNoticia(noticia) {
  const tarjeta = document.createElement('article');
  const fechaBonita = formatearFecha(noticia.fecha);
  const rutaImagen = resolverRutaImagen(noticia.imagen);

  tarjeta.className = 'noticia-card';
  tarjeta.innerHTML = `
    <div class="noticia-card__imagen">
      <img src="${rutaImagen}" alt="${noticia.titulo}" loading="lazy">
    </div>
    <div class="noticia-card__body">
      <div class="noticia-card__meta">
        <span class="badge badge-azul">${noticia.categoria}</span>
        <span class="noticia-card__fecha">${fechaBonita}</span>
      </div>
      <h3 class="noticia-card__titulo">${noticia.titulo}</h3>
      <p class="noticia-card__resumen">${noticia.resumen}</p>
    </div>
  `;

  // Interconexión comportamiento: click de tarjeta -> modal.
  tarjeta.addEventListener('click', () => {
    abrirModalNoticia(noticia, fechaBonita, rutaImagen);
  });

  return tarjeta;
}

function crearOverlayModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-noticia-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    backdrop-filter: blur(4px);
  `;
  return overlay;
}

function crearContenidoModal(noticia, fechaBonita, rutaImagen) {
  const modal = document.createElement('article');
  modal.style.cssText = `
    background: var(--color-card);
    border: 1px solid var(--color-borde);
    border-radius: 16px;
    max-width: 620px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    padding: 2rem;
  `;

  modal.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;gap:1rem;">
      <span class="badge badge-azul">${noticia.categoria}</span>
      <button type="button" data-cerrar-modal="true" style="background:var(--color-borde);border:none;border-radius:50%;width:36px;height:36px;color:var(--color-texto);cursor:pointer;font-size:1rem;">X</button>
    </div>
    <h2 style="font-family:var(--fuente-display);font-size:2rem;color:var(--color-blanco);margin-bottom:0.5rem;line-height:1.1;">${noticia.titulo}</h2>
    <p style="color:var(--color-texto-suave);font-size:0.875rem;margin-bottom:1.5rem;">${fechaBonita}</p>
    <img src="${rutaImagen}" alt="${noticia.titulo}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:1.5rem;">
    <p style="color:var(--color-texto);line-height:1.7;">${noticia.contenido}</p>
  `;

  return modal;
}

function cerrarModal(overlay) {
  if (!overlay) return;
  overlay.remove();
  // Rehabilita scroll principal al cerrar.
  document.body.style.overflow = '';
}

function abrirModalNoticia(noticia, fechaBonita, rutaImagen) {
  const overlay = crearOverlayModal();
  const modal = crearContenidoModal(noticia, fechaBonita, rutaImagen);

  overlay.appendChild(modal);

  // Cierre por fondo o por botón X.
  overlay.addEventListener('click', (evento) => {
    const clicFondo = evento.target === overlay;
    const clicBotonCerrar = evento.target.closest('[data-cerrar-modal="true"]');

    if (clicFondo || clicBotonCerrar) {
      cerrarModal(overlay);
    }
  });

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

async function cargarNoticias() {
  const contenedor = document.querySelector('.noticias__grid');
  if (!contenedor) return;

  try {
    const respuesta = await fetch(obtenerRutaNoticias());
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    const noticias = await respuesta.json();
    contenedor.innerHTML = '';

    noticias.forEach((noticia) => {
      contenedor.appendChild(crearTarjetaNoticia(noticia));
    });
  } catch (error) {
    console.error('No se pudieron cargar las noticias:', error);
    contenedor.innerHTML = '<p style="color: var(--color-texto-suave); text-align:center; padding:2rem;">No se pudieron cargar las noticias.</p>';
  }
}

document.addEventListener('DOMContentLoaded', cargarNoticias);
