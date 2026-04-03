/**
 * navbar.js
 * --------------------------------------------------------------
 * Objetivo: controlar el comportamiento de la barra de navegación.
 *
 * Qué hace:
 * 1) Abre/cierra menú móvil.
 * 2) Cambia estilo al hacer scroll.
 * 3) Marca el enlace activo según la URL.
 *
 * MEJORA #9 (parcial) — Cierre de menú con Escape
 * Se añade el cierre del menú al pulsar la tecla Escape,
 * mejorando la accesibilidad para navegación por teclado.
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
 * Cierra el menú móvil.
 * Se extrae a función separada para reutilizar
 * en click fuera, Escape, y navegación.
 */
function cerrarMenuMovil(hamburguesa, menu) {
  hamburguesa.classList.remove('abierto');
  menu.classList.remove('abierto');
  hamburguesa.setAttribute('aria-expanded', 'false');
}

/**
 * Control de menú hamburguesa en móvil.
 *
 * MEJORA: Se añade cierre con tecla Escape (accesibilidad WCAG 2.1.1).
 * Todos los elementos interactivos que se abren (menús, modales, dropdowns)
 * deben poder cerrarse con Escape.
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
      cerrarMenuMovil(hamburguesa, menu);
    }
  });

  // MEJORA: Cerrar menú con tecla Escape.
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && menu.classList.contains('abierto')) {
      cerrarMenuMovil(hamburguesa, menu);
      // Devolvemos el foco al botón hamburguesa para que el usuario
      // sepa dónde está (buena práctica de accesibilidad).
      hamburguesa.focus();
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
  // { passive: true } le dice al navegador que NO vamos a llamar
  // a preventDefault(), así puede optimizar el scroll.
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
