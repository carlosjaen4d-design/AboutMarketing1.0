/**
 * agenda.js
 * --------------------------------------------------------------
 * INTERCONEXIÓN DEL MÓDULO
 * - Lee datos de: /data/agenda.json
 * - Inserta HTML en: .agenda__lista (definido en index.html y pages/agenda.html)
 * - Las clases que crea aquí (.agenda-item, .agenda-item__hora, etc.)
 *   se estilizan en: /css/componentes.css (bloque AGENDA)
 *
 * Si cambias un nombre de clase aquí, debes actualizar también componentes.css.
 * Si cambias claves del JSON (hora, titulo, tipo, etc.), debes actualizar este archivo.
 */

// Relación manual id -> nombre visible.
// Interconecta agenda.json (campo "ponente") con el texto mostrado en pantalla.
const NOMBRES_PONENTES = {
  'luis-montalvo': 'Luis Montalvo',
  'raquel-linde': 'Raquel Linde',
  'ana-garcia': 'Ana García',
  'carlos-ruiz': 'Carlos Ruiz'
};

/**
 * Detecta si estamos en /pages para construir rutas correctas.
 * Interconexión crítica:
 * - index.html usa "data/..."
 * - pages/*.html usa "../data/..."
 */
function estamosEnSubpagina() {
  return window.location.pathname.includes('/pages/');
}

function obtenerRutaAgenda() {
  return estamosEnSubpagina() ? '../data/agenda.json' : 'data/agenda.json';
}

function obtenerNombrePonente(id) {
  return NOMBRES_PONENTES[id] || id;
}

/**
 * Convierte el "tipo" del JSON en:
 * - texto del badge
 * - clase CSS del badge
 *
 * Interconexión:
 * - Tipos válidos definidos en data/agenda.json
 * - Clases badge definidas en css/base.css
 */
function obtenerBadgePorTipo(tipo) {
  switch (tipo) {
    case 'pausa':
      return { clase: 'badge-acento', texto: 'Pausa' };
    case 'organizacion':
      return { clase: 'badge-acento', texto: 'Organización' };
    case 'especial':
      return { clase: 'badge-rojo', texto: 'Especial' };
    default:
      return { clase: 'badge-azul', texto: 'Ponencia' };
  }
}

/**
 * Crea una tarjeta de agenda con clases BEM.
 * Cada clase aquí debe existir en css/componentes.css.
 */
function crearElementoAgenda(item) {
  const elemento = document.createElement('article');
  const badge = obtenerBadgePorTipo(item.tipo);

  // Clase modificadora por tipo: agenda-item--ponencia | --pausa | --especial...
  // Interconecta con selectores CSS específicos por tipo.
  elemento.classList.add('agenda-item', `agenda-item--${item.tipo}`);

  const lineaPonente = item.ponente
    ? `<p class="agenda-item__ponente">Ponente: ${obtenerNombrePonente(item.ponente)}</p>`
    : '';

  elemento.innerHTML = `
    <div class="agenda-item__hora">${item.hora}</div>
    <div class="agenda-item__contenido">
      <div class="agenda-item__head">
        <span class="badge ${badge.clase}">${badge.texto}</span>
      </div>
      <h3 class="agenda-item__titulo">${item.titulo}</h3>
      ${lineaPonente}
      <div class="agenda-item__meta">
        <span>Sala: ${item.sala}</span>
        <span>Duración: ${item.duracion}</span>
      </div>
      <p class="agenda-item__descripcion">${item.descripcion}</p>
    </div>
  `;

  return elemento;
}

/**
 * Flujo principal:
 * 1) localizar contenedor existente en HTML
 * 2) pedir JSON
 * 3) transformar JSON en nodos HTML
 * 4) inyectar en el DOM
 */
async function cargarAgenda() {
  const contenedor = document.querySelector('.agenda__lista');
  if (!contenedor) return; // Evita ejecutar en páginas que no tienen agenda.

  try {
    const respuesta = await fetch(obtenerRutaAgenda());
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    const agenda = await respuesta.json();
    contenedor.innerHTML = '';

    agenda.forEach((item) => {
      contenedor.appendChild(crearElementoAgenda(item));
    });
  } catch (error) {
    console.error('No se pudo cargar la agenda:', error);
    contenedor.innerHTML = '<p style="color: var(--color-texto-suave); text-align:center; padding:2rem;">No se pudo cargar la agenda.</p>';
  }
}

// Punto de interconexión con el ciclo de vida del documento.
document.addEventListener('DOMContentLoaded', cargarAgenda);
