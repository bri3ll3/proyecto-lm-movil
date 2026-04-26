/* ============================================
   CONTACTO.JS - Validación del formulario de contacto
   ============================================ */

var formContacto, campoNombre, campoCorreo;

var nombresValidos = ['alex', 'juan', 'ana', 'pedro'];

function validarNombre() {
  var valor = campoNombre.value.trim().toLowerCase();
  if (nombresValidos.indexOf(valor) === -1) {
    campoNombre.setCustomValidity('El usuario introducido no existe');
  } else {
    campoNombre.setCustomValidity('');
  }
}

function validarCorreo() {
  var valor = campoCorreo.value.trim();
  // Verificar que sea email válido Y que acabe en .es
  if (campoCorreo.validity.typeMismatch || !valor.endsWith('.es')) {
    campoCorreo.setCustomValidity('Debes introducir una dirección de correo española (acabada en .es)');
  } else {
    campoCorreo.setCustomValidity('');
  }
}

function iniciar() {
  formContacto  = document.getElementById('formContacto');
  campoNombre   = document.getElementById('nombre');
  campoCorreo   = document.getElementById('correo');

  campoNombre.addEventListener('input', validarNombre, false);
  campoCorreo.addEventListener('input', validarCorreo, false);
}

window.addEventListener('load', iniciar, false);
