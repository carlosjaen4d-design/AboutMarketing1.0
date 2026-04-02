/**
 * formulario.js
 * --------------------------------------------------------------
 * INTERCONEXIÓN DEL MÓDULO
 * - Espera un <form id="formulario-contacto"> en pages/contacto.html
 * - Espera estos IDs de campo: nombre, apellidos, email, mensaje, privacidad
 * - Espera estos IDs de error: error-nombre, error-apellidos, etc.
 * - Usa clases CSS de estado: .error, .visible, .oculto
 *
 * Si cambias un ID en HTML, debes actualizar este archivo.
 */

function obtenerElemento(id) {
  return document.getElementById(id);
}

function mostrarError(idError, mensaje) {
  const elementoError = obtenerElemento(idError);
  if (!elementoError) return;

  elementoError.textContent = mensaje;
  elementoError.classList.add('visible');
}

function ocultarError(idError) {
  const elementoError = obtenerElemento(idError);
  if (!elementoError) return;

  elementoError.textContent = '';
  elementoError.classList.remove('visible');
}

/**
 * Limpia estados visuales previos antes de volver a validar.
 */
function limpiarErroresFormulario() {
  document
    .querySelectorAll('.formulario__input.error, .formulario__textarea.error')
    .forEach((campo) => campo.classList.remove('error'));

  document
    .querySelectorAll('.formulario__error-msg')
    .forEach((mensaje) => {
      mensaje.textContent = '';
      mensaje.classList.remove('visible');
      mensaje.style.display = '';
    });
}

/**
 * Valida formato básico de email.
 */
function validarEmail(valor) {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(valor);
}

/**
 * Valida un solo campo.
 * Reglas:
 * - required
 * - email válido
 * - minlength
 */
function validarCampo(campo) {
  if (!campo) return true;

  const valor = campo.value.trim();
  const idError = `error-${campo.id}`;

  if (campo.hasAttribute('required') && valor === '') {
    mostrarError(idError, 'Este campo es obligatorio.');
    campo.classList.add('error');
    return false;
  }

  if (campo.type === 'email' && valor !== '' && !validarEmail(valor)) {
    mostrarError(idError, 'Introduce un email válido (ejemplo: nombre@dominio.com).');
    campo.classList.add('error');
    return false;
  }

  const minimo = campo.getAttribute('minlength');
  if (minimo && valor.length < Number(minimo)) {
    mostrarError(idError, `Mínimo ${minimo} caracteres.`);
    campo.classList.add('error');
    return false;
  }

  ocultarError(idError);
  campo.classList.remove('error');
  return true;
}

function validarCheckboxPrivacidad() {
  const privacidad = obtenerElemento('privacidad');
  if (!privacidad) return true;

  if (!privacidad.checked) {
    mostrarError('error-privacidad', 'Debes aceptar la política de privacidad.');
    return false;
  }

  ocultarError('error-privacidad');
  return true;
}

/**
 * Validación global del formulario.
 */
function validarFormulario() {
  const camposObligatorios = [
    obtenerElemento('nombre'),
    obtenerElemento('apellidos'),
    obtenerElemento('email'),
    obtenerElemento('mensaje')
  ];

  const camposValidos = camposObligatorios.every((campo) => validarCampo(campo));
  const privacidadValida = validarCheckboxPrivacidad();

  return camposValidos && privacidadValida;
}

/**
 * Simula envío (sin backend).
 * Interconexión HTML:
 * - #formulario-contenido se oculta
 * - #formulario-exito se muestra
 */
function simularEnvioFormulario() {
  const botonSubmit = document.querySelector('.formulario__submit');
  const contenidoFormulario = obtenerElemento('formulario-contenido');
  const panelExito = obtenerElemento('formulario-exito');

  if (botonSubmit) {
    botonSubmit.disabled = true;
    botonSubmit.textContent = 'Enviando...';
  }

  window.setTimeout(() => {
    if (contenidoFormulario) contenidoFormulario.classList.add('oculto');
    if (panelExito) panelExito.classList.add('visible');
  }, 1500);
}

/**
 * Añade validación en vivo (blur e input).
 */
function configurarValidacionEnTiempoReal(formulario) {
  const campos = formulario.querySelectorAll('.formulario__input, .formulario__textarea');

  campos.forEach((campo) => {
    campo.addEventListener('blur', () => {
      validarCampo(campo);
    });

    campo.addEventListener('input', () => {
      if (campo.classList.contains('error')) {
        validarCampo(campo);
      }
    });
  });
}

function inicializarFormulario() {
  const formulario = obtenerElemento('formulario-contacto');
  if (!formulario) return;

  configurarValidacionEnTiempoReal(formulario);

  formulario.addEventListener('submit', (evento) => {
    // Evita recarga y permite validar primero.
    evento.preventDefault();

    limpiarErroresFormulario();

    if (validarFormulario()) {
      simularEnvioFormulario();
    }
  });
}

document.addEventListener('DOMContentLoaded', inicializarFormulario);
