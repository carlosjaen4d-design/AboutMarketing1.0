/**
 * ponente-detalle.js
 * --------------------------------------------------------------
 * REQUISITO 3 — Página individual de cada ponente, generada dinámicamente.
 *
 * INTERCONEXIÓN DEL MÓDULO:
 * - Lee datos de: /data/ponentes.json
 * - Se ejecuta en: pages/ponente.html (plantilla vacía)
 * - Recibe el ID del ponente vía URL: ?id=luis-montalvo
 * - Las clases .ponente-detalle* se estilizan en: css/componentes.css
 *
 * PATRÓN USADO: Template Page Pattern
 * ------------------------------------
 * Una sola página HTML actúa como plantilla. JavaScript lee el
 * parámetro ?id= de la URL con URLSearchParams y busca el ponente
 * correspondiente en el JSON. Si lo encuentra, rellena la página.
 * Si no, muestra un error amigable.
 *
 * URLSearchParams es una API nativa del navegador (2025+) para
 * leer parámetros de la URL sin parsear manualmente.
 *
 * Ejemplo de URL: ponente.html?id=luis-montalvo
 *   → new URLSearchParams(window.location.search).get('id')
 *   → devuelve "luis-montalvo"
 */

/**
 * Detecta si estamos en /pages/ para construir rutas correctas.
 * Mismo patrón que ponentes.js y agenda.js.
 */
function estamosEnSubpaginaDetalle() {
  return window.location.pathname.includes('/pages/');
}

/**
 * Construye la ruta al JSON de ponentes según la ubicación actual.
 */
function obtenerRutaPonentesDetalle() {
  return estamosEnSubpaginaDetalle()
    ? '../data/ponentes.json'
    : 'data/ponentes.json';
}

/**
 * Lee el parámetro "id" de la URL actual.
 *
 * URLSearchParams — API moderna para leer parámetros de URL.
 * Es la alternativa limpia a parsear window.location.search manualmente.
 *
 * Ejemplo:
 *   URL: ponente.html?id=luis-montalvo
 *   → obtenerIdDesdeURL() retorna "luis-montalvo"
 *
 *   URL: ponente.html (sin parámetro)
 *   → obtenerIdDesdeURL() retorna null
 */
function obtenerIdDesdeURL() {
  const parametros = new URLSearchParams(window.location.search);
  return parametros.get('id');
}

/**
 * Resuelve la ruta de la foto del ponente según la ubicación.
 * Reutiliza la misma lógica que resolverRutaFotoModal() de ponentes.js.
 */
function resolverRutaFotoDetalle(ponente) {
  if (estamosEnSubpaginaDetalle()) {
    if (ponente.fotoModalRelativa) return ponente.fotoModalRelativa;
    if (ponente.fotoModal && ponente.fotoModal.startsWith('assets/')) {
      return `../${ponente.fotoModal}`;
    }
    // Fallback a foto normal
    if (ponente.fotoRelativa) return ponente.fotoRelativa;
    if (ponente.foto && ponente.foto.startsWith('assets/')) {
      return `../${ponente.foto}`;
    }
  }

  // Desde raíz
  if (ponente.fotoModal) return ponente.fotoModal;
  return ponente.foto;
}

/**
 * Actualiza el breadcrumb y el <title> de la página con el nombre del ponente.
 * Así el navegador muestra "Luis Montalvo | About Marketing" en la pestaña.
 */
function actualizarBreadcrumb(nombre) {
  const spanNombre = document.getElementById('breadcrumb-nombre');
  if (spanNombre) spanNombre.textContent = nombre;

  const tituloPage = document.getElementById('page-titulo');
  if (tituloPage) tituloPage.textContent = nombre;

  document.title = `${nombre} | About Marketing`;
}

/**
 * Genera el HTML completo del perfil del ponente.
 * Incluye: foto, nombre, cargo, empresa, RRSS, biografía, charla y tags.
 *
 * Interconexión de clases con css/componentes.css:
 * - .ponente-detalle__layout → grid de 2 columnas (foto | info)
 * - .ponente-detalle__foto → imagen principal
 * - .ponente-detalle__nombre → título grande
 * - .ponente-detalle__cargo → subtítulo en script
 * - .ponente-detalle__empresa → empresa en mayúsculas
 * - .ponente-detalle__rrss → enlaces a redes sociales
 * - .ponente-detalle__bio → texto de biografía
 * - .ponente-detalle__charla-box → caja destacada con la charla
 * - .ponente-detalle__tags → badges de especialidades
 * - .ponente-detalle__volver → botón para volver al listado
 */
function renderizarDetalle(ponente) {
  const foto = resolverRutaFotoDetalle(ponente);

  // Generar enlaces de RRSS
  const ICONOS_RRSS = { linkedin: 'Li', twitter: 'Tw', instagram: 'Ig' };
  const enlacesRRSS = Object.entries(ponente.rrss || {})
    .filter(([, url]) => url)
    .map(([red, url]) =>
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="modal__rrss-link">${ICONOS_RRSS[red] || red}</a>`
    )
    .join('');

  // Generar tags/badges
  const tags = (ponente.tags || [])
    .map((tag) => `<span class="badge badge-acento">${tag}</span>`)
    .join('');

  return `
    <div class="ponente-detalle__layout">
      <div class="ponente-detalle__foto-wrap">
        <img class="ponente-detalle__foto"
             src="${foto}"
             alt="Foto de ${ponente.nombre}"
             width="280" height="380">
      </div>

      <div class="ponente-detalle__info">
        <h2 class="ponente-detalle__nombre">${ponente.nombre}</h2>
        <p class="ponente-detalle__cargo">${ponente.cargo}</p>
        <p class="ponente-detalle__empresa">${ponente.empresa}</p>

        ${enlacesRRSS ? `<div class="ponente-detalle__rrss">${enlacesRRSS}</div>` : ''}

        <div class="ponente-detalle__seccion">
          <h3 class="ponente-detalle__seccion-titulo">Biografía</h3>
          <p class="ponente-detalle__bio">${ponente.bio}</p>
        </div>

        <div class="ponente-detalle__seccion">
          <h3 class="ponente-detalle__seccion-titulo">Charla en About Marketing</h3>
          <div class="ponente-detalle__charla-box">
            <p class="ponente-detalle__charla-titulo">${ponente.charla}</p>
          </div>
        </div>

        <div class="ponente-detalle__seccion">
          <h3 class="ponente-detalle__seccion-titulo">Especialidades</h3>
          <div class="ponente-detalle__tags">${tags}</div>
        </div>

        <a href="ponentes.html" class="btn ponente-detalle__volver">
          &larr; Volver al listado de ponentes
        </a>
      </div>
    </div>
  `;
}

/**
 * Muestra un mensaje de error amigable si el ponente no se encuentra
 * o si no se pasa un parámetro ?id= válido.
 */
function mostrarError() {
  const contenedor = document.getElementById('ponente-detalle');
  if (!contenedor) return;

  actualizarBreadcrumb('No encontrado');

  contenedor.innerHTML = `
    <div class="ponente-detalle__error">
      <p class="ponente-detalle__error-titulo">Ponente no encontrado</p>
      <p class="ponente-detalle__error-texto">
        No hemos encontrado un ponente con ese identificador.
        Comprueba la URL o vuelve al listado.
      </p>
      <a href="ponentes.html" class="btn btn-primario">Ver todos los ponentes</a>
    </div>
  `;
}

/**
 * Flujo principal del módulo:
 * 1) Leer ?id= de la URL
 * 2) Fetch al JSON de ponentes
 * 3) Buscar el ponente por id
 * 4) Renderizar perfil completo o mostrar error
 *
 * Es async porque usa fetch (petición de red).
 */
async function cargarDetallePonente() {
  const contenedor = document.getElementById('ponente-detalle');
  if (!contenedor) return;

  // 1) Leer el id del ponente desde la URL
  const id = obtenerIdDesdeURL();
  if (!id) {
    mostrarError();
    return;
  }

  try {
    // 2) Pedir el JSON de ponentes
    const respuesta = await fetch(obtenerRutaPonentesDetalle());
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    const ponentes = await respuesta.json();

    // 3) Buscar el ponente cuyo id coincida con el parámetro de la URL
    const ponente = ponentes.find((p) => p.id === id);

    if (!ponente) {
      mostrarError();
      return;
    }

    // 4) Renderizar el perfil completo
    actualizarBreadcrumb(ponente.nombre);
    contenedor.innerHTML = renderizarDetalle(ponente);

  } catch (error) {
    console.error('No se pudo cargar el detalle del ponente:', error);
    mostrarError();
  }
}

// Punto de interconexión con el ciclo de vida del documento.
document.addEventListener('DOMContentLoaded', cargarDetallePonente);
