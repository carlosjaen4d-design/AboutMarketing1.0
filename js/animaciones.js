/**
 * animaciones.js
 * --------------------------------------------------------------
 * Activa animaciones de entrada cuando un elemento aparece
 * en pantalla usando IntersectionObserver.
 */

/**
 * Crea el observador que vigila elementos .reveal.
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
 */
function inicializarAnimacionesReveal() {
  const elementos = document.querySelectorAll('.reveal');
  if (elementos.length === 0) return;

  const observador = crearObservadorReveal();
  elementos.forEach((elemento) => observador.observe(elemento));
}

document.addEventListener('DOMContentLoaded', inicializarAnimacionesReveal);
