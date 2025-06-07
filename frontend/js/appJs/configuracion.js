// configuracion.js

document.addEventListener('DOMContentLoaded', () => {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  // Elementos de DOM
  const opcionCambiarContrasena = document.getElementById('opcionCambiarContrasena');
  const formCambiarContrasena   = document.getElementById('formCambiarContrasena');
  const inputPassActual         = document.getElementById('inputPassActual');
  const inputPassNueva          = document.getElementById('inputPassNueva');
  const btnConfirmarPass        = document.getElementById('btnConfirmarPass');

  const opcionCambiarCorreo     = document.getElementById('opcionCambiarCorreo');
  const formCambiarCorreo       = document.getElementById('formCambiarCorreo');
  const inputNuevoCorreo        = document.getElementById('inputNuevoCorreo');
  const btnConfirmarCorreo      = document.getElementById('btnConfirmarCorreo');

  const opcionBorrarCuenta      = document.getElementById('opcionBorrarCuenta');

  // Toggle de formularios
  opcionCambiarContrasena.addEventListener('click', e => {
    e.preventDefault();
    formCambiarContrasena.style.display =
      formCambiarContrasena.style.display === 'flex' ? 'none' : 'flex';
  });

  opcionCambiarCorreo.addEventListener('click', e => {
    e.preventDefault();
    formCambiarCorreo.style.display =
      formCambiarCorreo.style.display === 'flex' ? 'none' : 'flex';
  });

  // Cambiar contraseña
  btnConfirmarPass.addEventListener('click', async e => {
    e.preventDefault();
    const current = inputPassActual.value.trim();
    const next    = inputPassNueva.value.trim();
    if (!current || !next) {
      return alert('Completa ambos campos de contraseña.');
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password: current, new_password: next })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error cambiando contraseña');
      }
      const { message } = await res.json();
      alert(message);
      inputPassActual.value = '';
      inputPassNueva.value  = '';
      formCambiarContrasena.style.display = 'none';
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  });

  // Cambiar correo
  btnConfirmarCorreo.addEventListener('click', async e => {
    e.preventDefault();
    const email = inputNuevoCorreo.value.trim();
    if (!email) {
      return alert('Introduce el nuevo correo electrónico.');
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}/email`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Error cambiando correo');
      }
      const { message } = await res.json();
      alert(message);
      inputNuevoCorreo.value = '';
      formCambiarCorreo.style.display = 'none';
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  });

  // Borrar cuenta (pendiente backend)
  opcionBorrarCuenta.addEventListener('click', e => {
    e.preventDefault();
    if (confirm('¿Seguro que quieres borrar tu cuenta?')) {
      alert('Simulación: DELETE /perfil/{userId} (endpoint aún no implementado)');
    }
  });
});
