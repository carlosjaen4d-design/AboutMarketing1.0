/**
 * mejoras.js
 * ==============================================================
 * Este archivo centraliza TODAS las mejoras de diseño web moderno
 * añadidas al proyecto About Marketing.
 *
 * INTERCONEXIÓN:
 * - Se carga en TODAS las páginas (index.html y pages/*.html)
 * - Depende de: css/base.css (clases .scroll-progress, .tema-toggle, .cta-sticky-movil)
 * - Depende de: css/componentes.css (clases .btn-magnetico, .stat-animado, .hero__parallax-bg)
 * - Depende de: css/variables.css (variables CSS de tema)
 *
 * MEJORAS INCLUIDAS:
 * #9  — Barra de progreso de scroll
 * #10 — CTA sticky en móvil
 * #12 — Estadísticas animadas (contadores)
 * #20 — Parallax sutil en hero
 * #22 — Hover magnético en botones
 * #23 — Reveal de texto por palabras
 * #25 — Dark mode toggle
 * #26 — View Transitions API
 * #27 — Service Worker (registro)
 * #28 — Countdown (cuenta atrás al evento)
 *
 * ESTRUCTURA del archivo:
 * 1) Cada mejora tiene su propia función
 * 2) Todas se inicializan al final en inicializarMejoras()
 * 3) Cada función comprueba si los elementos necesarios existen
 *    antes de ejecutarse (así no da error en páginas que no los tienen)
 */


/* ══════════════════════════════════════════
   MEJORA #25 — DARK MODE TOGGLE
   ══════════════════════════════════════════

   Permite al usuario cambiar entre tema claro y oscuro.

   Funcionamiento:
   1) Al cargar la página, comprobamos si hay preferencia guardada
      en localStorage (memoria persistente del navegador).
   2) Si la hay, aplicamos ese tema.
   3) Si no la hay, respetamos la preferencia del sistema
      (prefers-color-scheme), que CSS maneja automáticamente.
   4) Al hacer clic en el botón, cambiamos el tema y lo guardamos.

   localStorage es un almacén clave-valor del navegador.
   Los datos persisten incluso cerrando la pestaña.
   Es como una "cookie" pero más fácil de usar.
*/

function inicializarDarkMode() {
  const boton = document.getElementById('tema-toggle');
  const icono = document.getElementById('tema-icono');
  if (!boton || !icono) return;

  // Símbolos para el botón: luna (☾) para modo claro, sol (☀) para oscuro
  const ICONO_CLARO = '\u263E'; // ☾ (luna — indica que puedes cambiar a oscuro)
  const ICONO_OSCURO = '\u2600'; // ☀ (sol — indica que puedes cambiar a claro)

  /**
   * Aplica el tema al documento.
   * data-theme en <html> es lo que CSS usa para cambiar colores.
   */
  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    icono.textContent = tema === 'dark' ? ICONO_OSCURO : ICONO_CLARO;
  }

  /**
   * Detecta qué tema debería estar activo al cargar.
   * Prioridad: localStorage > preferencia del sistema > claro por defecto
   */
  function obtenerTemaInicial() {
    // ¿Hay tema guardado por el usuario?
    const temaGuardado = localStorage.getItem('tema-preferido');
    if (temaGuardado) return temaGuardado;

    // ¿El sistema operativo está en modo oscuro?
    // window.matchMedia comprueba media queries desde JavaScript
    const sistemaOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return sistemaOscuro ? 'dark' : 'light';
  }

  // Aplicamos tema al cargar
  const temaInicial = obtenerTemaInicial();
  aplicarTema(temaInicial);

  // Al hacer clic: alternar entre dark y light
  boton.addEventListener('click', () => {
    const temaActual = document.documentElement.getAttribute('data-theme');
    const nuevoTema = temaActual === 'dark' ? 'light' : 'dark';

    aplicarTema(nuevoTema);
    // Guardamos la preferencia para que persista entre recargas
    localStorage.setItem('tema-preferido', nuevoTema);
  });
}


/* ══════════════════════════════════════════
   MEJORA #9 — BARRA DE PROGRESO DE SCROLL
   ══════════════════════════════════════════

   Una barra fina en la parte superior que muestra
   visualmente cuánto se ha scrolleado de la página.

   Cálculo:
   - scrollTop: cuántos píxeles hemos scrolleado
   - scrollHeight - clientHeight: cuánto scroll total hay disponible
   - porcentaje = scrollTop / scrollTotal * 100
*/

function inicializarScrollProgress() {
  const barra = document.getElementById('scroll-progress');
  if (!barra) return;

  function actualizarProgreso() {
    // Cuánto hemos scrolleado
    const scrollTop = window.scrollY;
    // Cuánto scroll hay disponible en total
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;

    // Evitamos dividir por 0 si la página no tiene scroll
    if (scrollTotal <= 0) {
      barra.style.width = '0%';
      return;
    }

    const porcentaje = (scrollTop / scrollTotal) * 100;
    barra.style.width = porcentaje + '%';
  }

  // { passive: true } mejora rendimiento del scroll
  window.addEventListener('scroll', actualizarProgreso, { passive: true });
  actualizarProgreso();
}


/* ══════════════════════════════════════════
   MEJORA #10 — CTA STICKY EN MÓVIL
   ══════════════════════════════════════════

   Un botón fijo en la parte inferior del móvil que aparece
   cuando el usuario hace scroll más allá del hero.

   Usamos IntersectionObserver para detectar si el hero
   ya no es visible → mostramos el botón.
*/

function inicializarCtaStickyMovil() {
  const ctaSticky = document.getElementById('cta-sticky');
  const hero = document.querySelector('.hero');
  if (!ctaSticky || !hero) return;

  // IntersectionObserver vigila si el hero está visible
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        // Si el hero NO es visible → mostrar CTA sticky
        // Si el hero SÍ es visible → ocultar CTA sticky
        ctaSticky.classList.toggle('visible', !entrada.isIntersecting);
      });
    },
    { threshold: 0 } // Se activa cuando el hero desaparece completamente
  );

  observador.observe(hero);
}


/* ══════════════════════════════════════════
   MEJORA #12 — ESTADÍSTICAS ANIMADAS
   ══════════════════════════════════════════

   Los valores numéricos se animan de 0 al valor final
   cuando entran en pantalla.

   Atributos HTML usados:
   - data-valor-final: el valor al que debe llegar (ej: "2")
   - data-es-numero="true": indica que es un número (para animar)

   Se usa requestAnimationFrame, que es la forma más eficiente
   de hacer animaciones suaves en JavaScript.
*/

function inicializarContadores() {
  const contadores = document.querySelectorAll('.stat-animado[data-es-numero="true"]');
  if (contadores.length === 0) return;

  /**
   * Anima un número de 0 al valor final en ~1 segundo.
   *
   * requestAnimationFrame ejecuta una función antes del próximo
   * repintado del navegador (~60 veces/segundo = 60fps).
   * Es MUCHO más suave que setInterval.
   */
  function animarContador(elemento) {
    const valorFinal = parseInt(elemento.dataset.valorFinal, 10);
    if (isNaN(valorFinal)) return;

    const duracion = 1000; // 1 segundo
    const inicio = performance.now();

    elemento.classList.add('contando');

    function paso(tiempoActual) {
      // Cuánto tiempo ha pasado desde el inicio
      const transcurrido = tiempoActual - inicio;
      // Progreso de 0 a 1 (0% a 100%)
      const progreso = Math.min(transcurrido / duracion, 1);

      // Valor actual basado en el progreso
      const valorActual = Math.round(valorFinal * progreso);
      elemento.textContent = valorActual;

      if (progreso < 1) {
        // Si no ha terminado, seguimos animando
        requestAnimationFrame(paso);
      } else {
        // Terminó: ponemos el valor final exacto
        elemento.textContent = valorFinal;
        elemento.classList.remove('contando');
      }
    }

    requestAnimationFrame(paso);
  }

  // Observamos cada contador para saber cuándo entra en pantalla
  const observador = new IntersectionObserver(
    (entradas, obs) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          animarContador(entrada.target);
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  contadores.forEach((contador) => observador.observe(contador));
}


/* ══════════════════════════════════════════
   MEJORA #20 — PARALLAX SUTIL EN HERO
   ══════════════════════════════════════════

   El fondo del hero se mueve a 0.3x la velocidad del scroll,
   creando una sensación de profundidad.

   IMPORTANTE: Respetamos prefers-reduced-motion.
   Si el usuario tiene "Reducir movimiento" activado en su sistema,
   NO aplicamos parallax (puede causar mareos).

   window.matchMedia funciona como @media en CSS, pero desde JavaScript.
*/

function inicializarParallax() {
  const fondoParallax = document.getElementById('hero-parallax');
  if (!fondoParallax) return;

  // Comprobamos si el usuario quiere reducir movimiento
  const prefiereReducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefiereReducirMovimiento) return;

  function actualizarParallax() {
    // Solo aplicamos parallax si el hero está en pantalla
    // (no tiene sentido calcular si ya pasamos de largo)
    if (window.scrollY > window.innerHeight) return;

    // El fondo se mueve a 0.3x la velocidad del scroll
    // translateY negativo = el fondo se mueve hacia arriba, más lento
    const desplazamiento = window.scrollY * 0.3;
    fondoParallax.style.transform = `translateY(${desplazamiento}px)`;
  }

  window.addEventListener('scroll', actualizarParallax, { passive: true });
}


/* ══════════════════════════════════════════
   MEJORA #22 — HOVER MAGNÉTICO EN BOTONES
   ══════════════════════════════════════════

   Los botones con clase .btn-magnetico se mueven ligeramente
   hacia el cursor cuando éste está cerca.

   Cálculo:
   1) Obtenemos la posición del botón en pantalla (getBoundingClientRect)
   2) Calculamos la distancia del cursor al centro del botón
   3) Aplicamos un pequeño desplazamiento proporcional a esa distancia

   El efecto se resetea cuando el cursor sale del botón (mouseleave).
*/

function inicializarBotonesMagneticos() {
  const botones = document.querySelectorAll('.btn-magnetico');
  if (botones.length === 0) return;

  // No aplicamos en dispositivos táctiles (no tienen hover)
  const esTactil = window.matchMedia('(hover: none)').matches;
  if (esTactil) return;

  botones.forEach((boton) => {
    boton.addEventListener('mousemove', (evento) => {
      // Posición y tamaño del botón en la pantalla
      const rect = boton.getBoundingClientRect();

      // Centro del botón
      const centroX = rect.left + rect.width / 2;
      const centroY = rect.top + rect.height / 2;

      // Distancia del cursor al centro del botón
      const deltaX = evento.clientX - centroX;
      const deltaY = evento.clientY - centroY;

      // Movemos el botón un 20% de la distancia (efecto sutil)
      const movX = deltaX * 0.2;
      const movY = deltaY * 0.2;

      boton.style.transform = `translate(${movX}px, ${movY}px)`;
    });

    // Al salir del botón, volvemos a la posición original
    boton.addEventListener('mouseleave', () => {
      boton.style.transform = 'translate(0, 0)';
    });
  });
}


/* ══════════════════════════════════════════
   MEJORA #23 — REVEAL DE TEXTO POR PALABRAS
   ══════════════════════════════════════════

   Envuelve cada palabra del título hero en un <span>
   y le aplica un delay de animación diferente,
   creando un efecto de cascada.

   El CSS (.hero__titulo .palabra) define la animación base.
   Aquí solo añadimos los delays.
*/

function inicializarRevealPalabras() {
  const titulo = document.querySelector('.hero__titulo');
  if (!titulo) return;

  // Guardamos el punto rojo (si existe) para reinsertarlo después
  const punto = titulo.querySelector('.hero__punto');

  // Obtenemos solo el texto (sin el HTML del punto)
  const textoOriginal = titulo.textContent.trim();

  // Separamos por palabras y envolvemos cada una en un <span>
  const palabras = textoOriginal.split(/\s+/);
  const htmlPalabras = palabras.map((palabra, indice) => {
    // Cada palabra tiene un delay mayor que la anterior (0.3s base + 0.08s * índice)
    const delay = 0.3 + (indice * 0.08);
    return `<span class="palabra" style="animation-delay:${delay}s">${palabra}</span>`;
  }).join(' ');

  // Reemplazamos el contenido del título
  titulo.innerHTML = htmlPalabras;

  // Re-insertamos el punto rojo si existía
  if (punto) {
    titulo.appendChild(punto);
  }
}


/* ══════════════════════════════════════════
   MEJORA #26 — VIEW TRANSITIONS API
   ══════════════════════════════════════════

   Las View Transitions permiten transiciones suaves
   entre navegaciones de página.

   En navegadores que soportan la API, interceptamos
   los clics en enlaces internos y usamos
   document.startViewTransition() para animar el cambio.

   Los estilos de la transición están en componentes.css
   (::view-transition-old, ::view-transition-new).

   NOTA: @view-transition { navigation: auto; } en CSS
   ya maneja esto automáticamente en Chrome 126+.
   Este JS es un fallback para versiones anteriores.
*/

function inicializarViewTransitions() {
  // Comprobamos si el navegador soporta View Transitions
  if (!document.startViewTransition) return;

  // Interceptamos clics en enlaces internos del sitio
  document.addEventListener('click', (evento) => {
    const enlace = evento.target.closest('a[href]');
    if (!enlace) return;

    const url = enlace.getAttribute('href');
    // Solo para enlaces internos (no externos, no anclas, no mailto)
    if (!url || url.startsWith('#') || url.startsWith('http') || url.startsWith('mailto')) return;

    // Prevenimos la navegación normal
    evento.preventDefault();

    // Iniciamos la View Transition y luego navegamos
    document.startViewTransition(() => {
      window.location.href = url;
    });
  });
}


/* ══════════════════════════════════════════
   MEJORA #27 — SERVICE WORKER (Registro)
   ══════════════════════════════════════════

   Un Service Worker es un script que corre en segundo plano,
   separado de la página web. Puede:
   - Cachear archivos para acceso offline
   - Interceptar peticiones de red
   - Enviar notificaciones push

   Aquí solo REGISTRAMOS el Service Worker.
   El archivo sw.js (que debe existir en la raíz) define qué cachear.

   NOTA: Los Service Workers SOLO funcionan con HTTPS o en localhost.
   En desarrollo local con file:// no funcionarán.
*/

function registrarServiceWorker() {
  // Comprobamos si el navegador soporta Service Workers
  if (!('serviceWorker' in navigator)) return;

  // Ruta relativa al SW según la ubicación de la página.
  // Necesario para que funcione en GitHub Pages (donde la raíz
  // no es "/" sino "/NombreRepo/").
  const rutaSW = window.location.pathname.includes('/pages/')
    ? '../sw.js'
    : 'sw.js';

  // Esperamos a que la página cargue completamente antes de registrar
  // (para no competir por ancho de banda con la carga inicial)
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(rutaSW).catch(() => {
      // Silenciamos el error — es esperado en desarrollo local
    });
  });
}


/* ══════════════════════════════════════════
   COUNTDOWN — Cuenta atrás al evento
   ══════════════════════════════════════════

   Muestra días, horas, minutos y segundos restantes hasta
   la fecha del evento (26 de marzo de 2026, 18:45h).

   ESTADOS:
   - Futuro → muestra la cuenta atrás con efecto flip
   - Hoy/en curso → muestra mensaje "EN DIRECTO" con punto rojo
   - Pasado → oculta el countdown completamente

   INTERCONEXIÓN:
   - HTML: #countdown, #countdown-dias/horas/minutos/segundos (index.html)
   - CSS: .countdown, .countdown__flip--activo (componentes.css)
   - Comparte fecha con: js/agenda.js (FECHA_EVENTO)

   setInterval ejecuta una función cada X milisegundos.
   Aquí la usamos para actualizar la cuenta atrás cada segundo (1000ms).
*/

function inicializarCountdown() {
  const contenedor = document.getElementById('countdown');
  if (!contenedor) return; // Solo existe en index.html

  // Fecha y hora exactas del evento (18:45h del 26 de marzo de 2026)
  const FECHA_EVENTO = new Date('2026-03-26T18:45:00');

  // Referencias a los elementos del DOM que muestran los números.
  // getElementById es más rápido que querySelector para IDs.
  const elDias = document.getElementById('countdown-dias');
  const elHoras = document.getElementById('countdown-horas');
  const elMinutos = document.getElementById('countdown-minutos');
  const elSegundos = document.getElementById('countdown-segundos');

  // Comprobamos que todos los elementos existen
  if (!elDias || !elHoras || !elMinutos || !elSegundos) return;

  /**
   * Actualiza UN bloque del countdown.
   * Si el valor ha cambiado, dispara la animación flip.
   *
   * @param {HTMLElement} elemento — El contenedor .countdown__flip
   * @param {number} valor — El número a mostrar (ej: 42)
   */
  function actualizarBloque(elemento, valor) {
    const numero = elemento.querySelector('.countdown__numero');
    // padStart(2, '0') convierte 5 en "05" — siempre 2 dígitos
    const textoNuevo = String(valor).padStart(2, '0');

    // Solo animar si el valor realmente cambió
    if (numero.textContent !== textoNuevo) {
      numero.textContent = textoNuevo;

      // Activar animación flip quitando y poniendo la clase.
      // El truco de void elemento.offsetWidth fuerza un "reflow",
      // que obliga al navegador a reiniciar la animación CSS.
      elemento.classList.remove('countdown__flip--activo');
      void elemento.offsetWidth; // Forzar reflow
      elemento.classList.add('countdown__flip--activo');
    }
  }

  /**
   * Función principal que calcula la diferencia de tiempo
   * y actualiza la interfaz.
   *
   * Math.floor() redondea hacia abajo (ej: 3.7 → 3).
   * El operador % (módulo) da el resto de la división.
   *
   * Ejemplo: 90 minutos → 90 % 60 = 30 (muestra 30 min, la hora sube a 1)
   */
  function actualizar() {
    const ahora = new Date();
    const diferencia = FECHA_EVENTO - ahora; // Milisegundos restantes

    // ESTADO: Evento ya pasó → ocultar countdown
    // Damos 3h de margen (duración estimada del evento)
    if (diferencia < -3 * 60 * 60 * 1000) {
      contenedor.classList.add('countdown--oculto');
      clearInterval(intervalo);
      return;
    }

    // ESTADO: Evento en curso (diferencia negativa pero dentro de las 3h)
    if (diferencia <= 0) {
      contenedor.classList.add('countdown--en-curso');
      contenedor.innerHTML = `
        <div class="countdown__mensaje-vivo">
          <span class="countdown__punto-vivo"></span>
          En directo ahora
        </div>
      `;
      clearInterval(intervalo);
      return;
    }

    // ESTADO: Futuro → calcular días, horas, minutos, segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

    actualizarBloque(elDias, dias);
    actualizarBloque(elHoras, horas);
    actualizarBloque(elMinutos, minutos);
    actualizarBloque(elSegundos, segundos);
  }

  // Primera actualización inmediata (sin esperar 1 segundo)
  actualizar();

  // Actualizar cada segundo (1000 milisegundos)
  const intervalo = setInterval(actualizar, 1000);
}


/* ══════════════════════════════════════════
   PUNTO DE ENTRADA — Inicialización
   ══════════════════════════════════════════

   Aquí llamamos a todas las funciones de inicialización.
   Cada una comprueba si los elementos necesarios existen,
   así que es seguro llamarlas en cualquier página.
*/

function inicializarMejoras() {
  // Mejora #25 — Dark mode (primero, para evitar flash de tema incorrecto)
  inicializarDarkMode();

  // Mejora #9 — Barra de progreso de scroll
  inicializarScrollProgress();

  // Mejora #10 — CTA sticky en móvil
  inicializarCtaStickyMovil();

  // Mejora #12 — Contadores animados
  inicializarContadores();

  // Mejora #20 — Parallax en hero
  inicializarParallax();

  // Mejora #22 — Botones magnéticos
  inicializarBotonesMagneticos();

  // Mejora #23 — Reveal de texto por palabras
  inicializarRevealPalabras();

  // Mejora #26 — View Transitions
  inicializarViewTransitions();

  // Mejora #27 — Service Worker
  registrarServiceWorker();

  // Countdown — Cuenta atrás al evento
  inicializarCountdown();
}

document.addEventListener('DOMContentLoaded', inicializarMejoras);
