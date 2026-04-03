/**
 * animaciones.js
 * --------------------------------------------------------------
 * Activa animaciones de entrada cuando un elemento aparece
 * en pantalla usando IntersectionObserver.
 *
 * MEJORA #17 — Scroll-driven animations (progressive enhancement)
 * ----------------------------------------------------------------
 * Si el navegador soporta scroll-driven animations de CSS
 * (animation-timeline: view()), NO ejecutamos el JavaScript.
 * El CSS se encarga solo (ver componentes.css).
 *
 * Si el navegador NO las soporta, usamos IntersectionObserver
 * como antes (fallback).
 *
 * Esto se llama "progressive enhancement":
 * - Navegadores modernos → CSS puro (más eficiente)
 * - Navegadores antiguos → JavaScript (funciona igual)
 */

/**
 * Comprueba si el navegador soporta scroll-driven animations.
 * CSS.supports() pregunta al navegador: "¿entiendes esta propiedad?"
 * Si devuelve true, no necesitamos JavaScript para las animaciones.
 */
function soportaScrollDrivenAnimations() {
  return CSS.supports && CSS.supports('animation-timeline', 'view()');
}

/**
 * Crea el observador que vigila elementos .reveal.
 *
 * IntersectionObserver es una API del navegador que nos avisa
 * cuando un elemento entra o sale del viewport (la zona visible).
 *
 * Es MUCHO más eficiente que escuchar el evento scroll,
 * porque el navegador optimiza internamente las comprobaciones.
 */
function crearObservadorReveal() {
  return new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        // isIntersecting = true cuando el elemento entra en viewport.
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');

          // Dejamos de observar ese elemento porque ya se animó.
          observador.unobserve(entrada.target);
        }
      });
    },
    {
      // Se activa cuando el 12% del elemento es visible.
      threshold: 0.12,

      // Lo dispara un poco antes para efecto más suave.
      rootMargin: '0px 0px -40px 0px'
    }
  );
}

/**
 * Inicializa animaciones para todos los nodos .reveal.
 *
 * MEJORA #17: Si el navegador soporta scroll-driven animations,
 * no ejecutamos nada aquí. El CSS se encarga solo.
 */
function inicializarAnimacionesReveal() {
  // Si el navegador soporta scroll-driven animations de CSS,
  // no necesitamos JavaScript para las animaciones reveal.
  if (soportaScrollDrivenAnimations()) {
    return;
  }

  const elementos = document.querySelectorAll('.reveal');
  if (elementos.length === 0) return;

  const observador = crearObservadorReveal();
  elementos.forEach((elemento) => observador.observe(elemento));
}

document.addEventListener('DOMContentLoaded', inicializarAnimacionesReveal);
