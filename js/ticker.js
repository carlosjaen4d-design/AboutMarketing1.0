/**
 * ticker.js
 * --------------------------------------------------------------
 * Componente reutilizable para cintas animadas de texto.
 *
 * Uso en HTML:
 * - data-ticker="true"        -> activa el track
 * - data-ticker-reverse="true" -> invierte dirección
 */

// Palabras que aparecerán en el ticker.
// Para personalizar la cinta, solo modifica este array.
const PALABRAS_TICKER = [
  'Estrategia',
  'Campaña',
  'Audiencia',
  'Cliente',
  'Marca',
  'Producto',
  'Mercado',
  'Segmentación',
  'Posicionamiento',
  'SEO',
  'SEM',
  'Tráfico',
  'Orgánico',
  'Publicidad',
  'Engagement',
  'Comunidad',
  'Influencer',
  'Newsletter',
  'Automatización',
  'CRM',
  'B2B',
  'B2C',
  'Omnicanalidad',
  'Experiencia',
  'Usabilidad',
  'Interfaz',
  'Analítica'
];

/**
 * Crea un elemento visual de palabra + separador.
 */
function crearItemTicker(texto) {
  const item = document.createElement('div');
  item.className = 'ticker__item';
  item.innerHTML = `${texto} <span class="sep">&middot;</span>`;
  return item;
}

/**
 * Inserta contenido dentro de un track concreto.
 */
function poblarTrack(track) {
  if (!track) return;

  // Si ya tiene hijos, no lo rellenamos otra vez.
  if (track.childElementCount > 0) return;

  // Duplicamos lista para simular scroll continuo.
  for (let repeticion = 0; repeticion < 2; repeticion += 1) {
    PALABRAS_TICKER.forEach((palabra) => {
      track.appendChild(crearItemTicker(palabra));
    });
  }

  // Invertir sentido si el HTML lo indica.
  if (track.dataset.tickerReverse === 'true') {
    track.style.animationDirection = 'reverse';
  }
}

/**
 * Busca todos los tracks marcados y los inicializa.
 */
function inicializarTickers() {
  const tracks = document.querySelectorAll('.ticker__track[data-ticker="true"]');
  tracks.forEach((track) => poblarTrack(track));
}

document.addEventListener('DOMContentLoaded', inicializarTickers);
