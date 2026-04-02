/**
 * ponentes.js
 * --------------------------------------------------------------
 * INTERCONEXIÓN DEL MÓDULO
 * - Datos: /data/ponentes.json
 * - Contenedor HTML: .ponentes__grid (index.html y pages/ponentes.html)
 * - Clases visuales: /css/componentes.css (bloques PONENTES y MODAL)
 *
 * Además, controla un modal de detalle con bloqueo de scroll.
 *
 * IMPORTANTE SOBRE IMÁGENES:
 * - foto / fotoRelativa: se usan en tarjetas (sección pósters)
 * - fotoModal / fotoModalRelativa: se usan en el modal
 */

function estamosEnSubpagina() {
  return window.location.pathname.includes('/pages/');
}

function obtenerRutaPonentes() {
  return estamosEnSubpagina() ? '../data/ponentes.json' : 'data/ponentes.json';
}

/**
 * Resuelve imagen para TARJETA (sección de pósters).
 */
function resolverRutaFotoTarjeta(ponente) {
  if (estamosEnSubpagina()) {
    if (ponente.fotoRelativa) return ponente.fotoRelativa;
    if (ponente.foto && ponente.foto.startsWith('assets/')) return `../${ponente.foto}`;
  }

  if (!estamosEnSubpagina() && ponente.foto && ponente.foto.startsWith('../')) {
    return ponente.foto.replace('../', '');
  }

  return ponente.foto;
}

/**
 * Resuelve imagen para MODAL.
 * Si no existe fotoModal, cae a foto normal como respaldo.
 */
function resolverRutaFotoModal(ponente) {
  if (estamosEnSubpagina()) {
    if (ponente.fotoModalRelativa) return ponente.fotoModalRelativa;
    if (ponente.fotoModal && ponente.fotoModal.startsWith('assets/')) return `../${ponente.fotoModal}`;

    // Fallback
    if (ponente.fotoRelativa) return ponente.fotoRelativa;
    if (ponente.foto && ponente.foto.startsWith('assets/')) return `../${ponente.foto}`;
  }

  if (!estamosEnSubpagina()) {
    if (ponente.fotoModal && ponente.fotoModal.startsWith('../')) return ponente.fotoModal.replace('../', '');
    if (ponente.fotoModal) return ponente.fotoModal;

    // Fallback
    if (ponente.foto && ponente.foto.startsWith('../')) return ponente.foto.replace('../', '');
  }

  return ponente.foto;
}

function crearHtmlTags(tags) {
  return tags
    .slice(0, 4)
    .map((tag) => `<span class="badge badge-acento">${tag}</span>`)
    .join('');
}

function crearTarjetaPonente(ponente, indice) {
  const tarjeta = document.createElement('article');
  const fotoTarjeta = resolverRutaFotoTarjeta(ponente);

  tarjeta.className = 'ponente-poster';
  tarjeta.dataset.id = ponente.id;

  if (indice === 1) tarjeta.style.transitionDelay = '0.1s';

  tarjeta.innerHTML = `
    <div class="ponente-poster__img-wrap">
      <img src="${fotoTarjeta}" alt="Cartel de ${ponente.nombre}" class="ponente-poster__img" loading="lazy">
      <div class="ponente-poster__overlay">
        <div class="ponente-poster__overlay-inner">
          <p class="ponente-poster__cargo">${ponente.cargo}</p>
          <p class="ponente-poster__empresa">${ponente.empresa}</p>
          <div class="ponente-poster__tags">${crearHtmlTags(ponente.tags)}</div>
          <div class="ponente-poster__charla">
            <span class="ponente-poster__charla-label">Charla</span>
            <p>${ponente.charla}</p>
          </div>
          <button type="button" class="btn btn-primario ponente-poster__btn" data-abrir-ponente="${ponente.id}">
            Ver perfil completo
          </button>
        </div>
      </div>
    </div>
    <div class="ponente-poster__nombre-bar">
      <span class="ponente-poster__nombre">${ponente.nombre}</span>
      <span class="ponente-poster__fecha">26.03</span>
    </div>
  `;

  const boton = tarjeta.querySelector('[data-abrir-ponente]');
  boton.addEventListener('click', (evento) => {
    evento.stopPropagation();
    abrirModalPonente(ponente);
  });

  return tarjeta;
}

function crearModalSiNoExiste() {
  if (document.querySelector('.modal-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-ponente';

  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-nombre">
      <div class="modal__header">
        <img class="modal__foto" src="" alt="" id="modal-foto">
        <div class="modal__info">
          <h2 class="modal__nombre" id="modal-nombre"></h2>
          <p class="modal__cargo" id="modal-cargo"></p>
          <p class="modal__empresa" id="modal-empresa"></p>
          <div class="modal__rrss" id="modal-rrss"></div>
        </div>
        <button type="button" class="modal__cerrar" id="modal-cerrar" aria-label="Cerrar modal">X</button>
      </div>
      <div class="modal__body">
        <p class="modal__seccion-titulo">Biografía</p>
        <p class="modal__bio" id="modal-bio"></p>
        <p class="modal__seccion-titulo">Charla</p>
        <div class="modal__charla-box">
          <p class="modal__charla-titulo" id="modal-charla"></p>
        </div>
        <p class="modal__seccion-titulo">Especialidades</p>
        <div class="modal__tags" id="modal-tags"></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('modal-cerrar').addEventListener('click', cerrarModalPonente);

  overlay.addEventListener('click', (evento) => {
    if (evento.target === overlay) cerrarModalPonente();
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') cerrarModalPonente();
  });
}

function pintarRedesSociales(redes) {
  const ICONOS = {
    linkedin: 'Li',
    twitter: 'Tw',
    instagram: 'Ig'
  };

  const contenedor = document.getElementById('modal-rrss');
  contenedor.innerHTML = '';

  Object.entries(redes || {}).forEach(([red, url]) => {
    if (!url) return;

    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.target = '_blank';
    enlace.rel = 'noopener noreferrer';
    enlace.className = 'modal__rrss-link';
    enlace.textContent = ICONOS[red] || red;

    contenedor.appendChild(enlace);
  });
}

function abrirModalPonente(ponente) {
  const overlay = document.getElementById('modal-ponente');
  if (!overlay) return;

  document.getElementById('modal-foto').src = resolverRutaFotoModal(ponente);
  document.getElementById('modal-foto').alt = ponente.nombre;
  document.getElementById('modal-nombre').textContent = ponente.nombre;
  document.getElementById('modal-cargo').textContent = ponente.cargo;
  document.getElementById('modal-empresa').textContent = ponente.empresa;
  document.getElementById('modal-bio').textContent = ponente.bio;
  document.getElementById('modal-charla').textContent = ponente.charla;
  document.getElementById('modal-tags').innerHTML = crearHtmlTags(ponente.tags);

  pintarRedesSociales(ponente.rrss);

  overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';
}

function cerrarModalPonente() {
  const overlay = document.getElementById('modal-ponente');
  if (!overlay) return;

  overlay.classList.remove('activo');
  document.body.style.overflow = '';
}

function animarTarjetas(contenedor) {
  const tarjetas = contenedor.querySelectorAll('.ponente-poster');

  tarjetas.forEach((tarjeta, indice) => {
    tarjeta.style.opacity = '0';
    tarjeta.style.transform = 'translateY(24px)';
    tarjeta.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

    window.setTimeout(() => {
      tarjeta.style.opacity = '1';
      tarjeta.style.transform = 'translateY(0)';
    }, indice * 120);
  });
}

async function cargarPonentes() {
  const contenedor = document.querySelector('.ponentes__grid');
  if (!contenedor) return;

  contenedor.innerHTML = [
    '<div class="skeleton" style="height:520px;border-radius:16px;"></div>',
    '<div class="skeleton" style="height:520px;border-radius:16px;"></div>'
  ].join('');

  try {
    const respuesta = await fetch(obtenerRutaPonentes());
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    const ponentes = await respuesta.json();

    contenedor.innerHTML = '';
    crearModalSiNoExiste();

    ponentes.forEach((ponente, indice) => {
      contenedor.appendChild(crearTarjetaPonente(ponente, indice));
    });

    animarTarjetas(contenedor);
  } catch (error) {
    console.error('No se pudieron cargar los ponentes:', error);
    contenedor.innerHTML = '<p style="color:rgba(255,255,255,0.4); text-align:center; padding:3rem; grid-column:1/-1;">No se pudieron cargar los ponentes.</p>';
  }
}

document.addEventListener('DOMContentLoaded', cargarPonentes);
