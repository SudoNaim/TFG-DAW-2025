// Espera a que todo el DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
  // Obtengo el id del usuario guardado en localStorage
  const userId = localStorage.getItem('user_id');
  // Si no hay usuario, redirijo al login
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  // Referencias a los elementos del DOM que voy a usar
  const opcionCambiarContrasena = document.getElementById('opcionCambiarContrasena');
  const formCambiarContrasena = document.getElementById('formCambiarContrasena');
  const inputPassActual = document.getElementById('inputPassActual');
  const inputPassNueva = document.getElementById('inputPassNueva');
  const btnConfirmarPass = document.getElementById('btnConfirmarPass');
  const opcionCambiarCorreo = document.getElementById('opcionCambiarCorreo');
  const formCambiarCorreo = document.getElementById('formCambiarCorreo');
  const inputNuevoCorreo = document.getElementById('inputNuevoCorreo');
  const btnConfirmarCorreo = document.getElementById('btnConfirmarCorreo');
  const opcionBorrarCuenta = document.getElementById('opcionBorrarCuenta');

  // Mostrar/ocultar el formulario de cambiar contraseña al hacer click
  opcionCambiarContrasena.addEventListener('click', e => {
    e.preventDefault();
    // Si el formulario está visible, lo oculto, si no, lo muestro
    formCambiarContrasena.style.display =
      formCambiarContrasena.style.display === 'flex' ? 'none' : 'flex';
  });

  // Mostrar/ocultar el formulario de cambiar correo al hacer click
  opcionCambiarCorreo.addEventListener('click', e => {
    e.preventDefault();
    formCambiarCorreo.style.display =
      formCambiarCorreo.style.display === 'flex' ? 'none' : 'flex';
  });

  // Evento para confirmar el cambio de contraseña
  btnConfirmarPass.addEventListener('click', async e => {
    e.preventDefault();
    // Cojo los valores de los inputs y quito espacios
    const current = inputPassActual.value.trim();
    const next = inputPassNueva.value.trim();
    // Si falta algún campo, aviso al usuario
    if (!current || !next) {
      return alert('Completa ambos campos de contraseña.');
    }
    try {
      // Llamo al backend para cambiar la contraseña
      const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: current, new_password: next })
      });
      // Si hay error, lo muestro
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error cambiando contraseña');
      }
      // Si todo va bien, muestro el mensaje de éxito
      const { message } = await res.json();
      alert(message);
      // Limpio los campos y oculto el formulario
      inputPassActual.value = '';
      inputPassNueva.value = '';
      formCambiarContrasena.style.display = 'none';
    } catch (err) {
      // Si hay algún error, lo muestro por consola y aviso al usuario
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  });

  // Evento para confirmar el cambio de correo electrónico
  btnConfirmarCorreo.addEventListener('click', async e => {
    e.preventDefault();
    // Cojo el valor del input y quito espacios
    const email = inputNuevoCorreo.value.trim();
    // Si no hay email, aviso
    if (!email) {
      return alert('Introduce el nuevo correo electrónico.');
    }
    try {
      // Llamo al backend para cambiar el correo
      const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // Si hay error, lo muestro
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error cambiando correo');
      }
      // Si todo va bien, muestro el mensaje de éxito
      const { message } = await res.json();
      alert(message);
      // Limpio el campo y oculto el formulario
      inputNuevoCorreo.value = '';
      formCambiarCorreo.style.display = 'none';
    } catch (err) {
      // Si hay algún error, lo muestro por consola y aviso al usuario
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  });

  // Evento para borrar la cuenta (de momento solo simula)
  opcionBorrarCuenta.addEventListener('click', e => {
    e.preventDefault();
    // Pregunto al usuario si está seguro
    if (confirm('¿Seguro que quieres borrar tu cuenta?')) {
      // Solo muestro un mensaje porque el endpoint no está hecho aún
      alert('Simulación: DELETE /perfil/{userId} (endpoint aún no implementado)');
    }
  });
});
