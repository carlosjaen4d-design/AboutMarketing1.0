/**
 * navbar.js
 * --------------------------------------------------------------
 * Objetivo: controlar el comportamiento de la barra de navegación.
 *
 * Qué hace:
 * 1) Abre/cierra menú móvil.
 * 2) Cambia estilo al hacer scroll.
 * 3) Marca el enlace activo según la URL.
 */

/**
 * Comprueba si un enlace del menú corresponde a la ruta actual.
 */
function esEnlaceActivo(href, rutaActual) {
  if (!href || href === '#') return false;

  // En subpáginas eliminamos "../" para comparar mejor.
  const hrefNormalizado = href.replace('../', '');

  // Caso especial de portada.
  const estamosEnIndex = rutaActual.endsWith('index.html') || rutaActual.endsWith('/');
  if (estamosEnIndex && (hrefNormalizado === 'index.html' || href === '../index.html')) {
    return true;
  }

  return rutaActual.includes(hrefNormalizado);
}

/**
 * Control de menú hamburguesa en móvil.
 */
function configurarMenuMovil(hamburguesa, menu) {
  if (!hamburguesa || !menu) return;

  // Click en el botón: abrir/cerrar menú.
  hamburguesa.addEventListener('click', () => {
    const abierto = hamburguesa.classList.toggle('abierto');
    menu.classList.toggle('abierto');

    // Accesibilidad: refleja estado del botón.
    hamburguesa.setAttribute('aria-expanded', String(abierto));
  });

  // Click fuera del menú: cerrarlo.
  document.addEventListener('click', (evento) => {
    const clickFueraMenu = !menu.contains(evento.target);
    const clickFueraBoton = !hamburguesa.contains(evento.target);

    if (clickFueraMenu && clickFueraBoton) {
      hamburguesa.classList.remove('abierto');
      menu.classList.remove('abierto');
      hamburguesa.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Activa clase .scrolled cuando hay desplazamiento vertical.
 */
function configurarEfectoScroll(navbar) {
  if (!navbar) return;

  const actualizarEstado = () => {
    const hayScroll = window.scrollY > 30;
    navbar.classList.toggle('scrolled', hayScroll);
  };

  // Escuchamos scroll con passive para mejor rendimiento.
  window.addEventListener('scroll', actualizarEstado, { passive: true });

  // Ejecutamos una vez al inicio para estado correcto.
  actualizarEstado();
}

/**
 * Recorre enlaces del menú y añade clase activo si corresponde.
 */
function marcarEnlaceActivo(enlaces) {
  const rutaActual = window.location.pathname;

  enlaces.forEach((enlace) => {
    const href = enlace.getAttribute('href');
    if (esEnlaceActivo(href, rutaActual)) {
      enlace.classList.add('activo');
    }
  });
}

/**
 * Punto de entrada del módulo.
 */
function inicializarNavbar() {
  const hamburguesa = document.querySelector('.navbar__hamburguesa');
  const menu = document.querySelector('.navbar__menu');
  const navbar = document.querySelector('.navbar');
  const enlaces = document.querySelectorAll('.navbar__link');

  configurarMenuMovil(hamburguesa, menu);
  configurarEfectoScroll(navbar);
  marcarEnlaceActivo(enlaces);
}

document.addEventListener('DOMContentLoaded', inicializarNavbar);
