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
 * MEJORA #3 — Focus trap en modal
 * --------------------------------
 * Cuando un modal está abierto, el foco del teclado queda
 * "atrapado" dentro del modal. No puede escapar al contenido
 * de detrás. Esto es OBLIGATORIO para accesibilidad (WCAG 2.4.3).
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
        <!-- REQUISITO 3: Enlace a la página individual del ponente -->
        <a href="#" class="btn btn-primario modal__enlace-pagina" id="modal-enlace-pagina"
           style="margin-top:var(--s-6); width:100%; justify-content:center;">
          Ver página completa
        </a>
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

/**
 * Variable para guardar qué elemento tenía el foco
 * ANTES de abrir el modal. Al cerrar, devolvemos el foco ahí.
 * Esto es una buena práctica de accesibilidad.
 */
let elementoConFocoAnterior = null;

/**
 * MEJORA #3 — Focus Trap (trampa de foco)
 * ------------------------------------------------
 * Cuando un modal está abierto, al pulsar Tab el foco
 * debe quedarse DENTRO del modal. No puede ir al contenido de detrás.
 *
 * Funcionamiento:
 * 1) Buscamos todos los elementos "focusables" dentro del modal
 * 2) Si el usuario pulsa Tab en el ÚLTIMO elemento, volvemos al PRIMERO
 * 3) Si pulsa Shift+Tab en el PRIMERO, volvemos al ÚLTIMO
 *
 * Esto crea un "ciclo cerrado" de navegación por teclado.
 */
function activarFocusTrap(modal) {
  // Selector que encuentra TODOS los elementos que pueden recibir foco
  const selectoresFocusables = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  function manejarTab(evento) {
    if (evento.key !== 'Tab') return;

    // Buscamos los elementos focusables CADA VEZ que se pulsa Tab
    // (por si el contenido del modal ha cambiado dinámicamente)
    const elementosFocusables = modal.querySelectorAll(selectoresFocusables);
    if (elementosFocusables.length === 0) return;

    const primerElemento = elementosFocusables[0];
    const ultimoElemento = elementosFocusables[elementosFocusables.length - 1];

    if (evento.shiftKey) {
      // Shift + Tab: si estamos en el primer elemento, ir al último
      if (document.activeElement === primerElemento) {
        evento.preventDefault();
        ultimoElemento.focus();
      }
    } else {
      // Tab normal: si estamos en el último elemento, ir al primero
      if (document.activeElement === ultimoElemento) {
        evento.preventDefault();
        primerElemento.focus();
      }
    }
  }

  // Guardamos referencia al handler para poder eliminarlo al cerrar
  modal._focusTrapHandler = manejarTab;
  document.addEventListener('keydown', manejarTab);
}

/**
 * Desactiva la trampa de foco cuando se cierra el modal.
 */
function desactivarFocusTrap(modal) {
  if (modal._focusTrapHandler) {
    document.removeEventListener('keydown', modal._focusTrapHandler);
    modal._focusTrapHandler = null;
  }
}

function abrirModalPonente(ponente) {
  const overlay = document.getElementById('modal-ponente');
  if (!overlay) return;

  // Guardamos el elemento que tenía el foco antes de abrir
  elementoConFocoAnterior = document.activeElement;

  document.getElementById('modal-foto').src = resolverRutaFotoModal(ponente);
  document.getElementById('modal-foto').alt = ponente.nombre;
  document.getElementById('modal-nombre').textContent = ponente.nombre;
  document.getElementById('modal-cargo').textContent = ponente.cargo;
  document.getElementById('modal-empresa').textContent = ponente.empresa;
  document.getElementById('modal-bio').textContent = ponente.bio;
  document.getElementById('modal-charla').textContent = ponente.charla;
  document.getElementById('modal-tags').innerHTML = crearHtmlTags(ponente.tags);

  pintarRedesSociales(ponente.rrss);

  // REQUISITO 3: Actualizar enlace a la página individual del ponente.
  // La ruta depende de si estamos en index.html o en pages/*.html.
  const enlacePagina = document.getElementById('modal-enlace-pagina');
  if (enlacePagina) {
    const rutaPonente = estamosEnSubpagina()
      ? `ponente.html?id=${ponente.id}`
      : `pages/ponente.html?id=${ponente.id}`;
    enlacePagina.href = rutaPonente;
  }

  overlay.classList.add('activo');
  document.body.style.overflow = 'hidden';

  // MEJORA #3: Activamos focus trap y movemos el foco al modal
  const modal = overlay.querySelector('.modal');
  activarFocusTrap(modal);

  // Ponemos el foco en el botón de cerrar (primer elemento interactivo)
  const botonCerrar = document.getElementById('modal-cerrar');
  if (botonCerrar) {
    botonCerrar.focus();
  }
}

function cerrarModalPonente() {
  const overlay = document.getElementById('modal-ponente');
  if (!overlay) return;

  // MEJORA #3: Desactivamos la trampa de foco
  const modal = overlay.querySelector('.modal');
  desactivarFocusTrap(modal);

  overlay.classList.remove('activo');
  document.body.style.overflow = '';

  // Devolvemos el foco al elemento que lo tenía antes de abrir el modal
  if (elementoConFocoAnterior) {
    elementoConFocoAnterior.focus();
    elementoConFocoAnterior = null;
  }
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
