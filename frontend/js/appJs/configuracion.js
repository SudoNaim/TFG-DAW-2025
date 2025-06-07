// configuracion.js
// Prepara los formularios y listeners para configuración

document.addEventListener('DOMContentLoaded', () => {
    // Elementos clave
    const opcionCambiarContrasena = document.getElementById('opcionCambiarContrasena');
    const formCambiarContrasena = document.getElementById('formCambiarContrasena');
    const btnConfirmarPass = document.getElementById('btnConfirmarPass');

    const opcionCambiarCorreo = document.getElementById('opcionCambiarCorreo');
    const formCambiarCorreo = document.getElementById('formCambiarCorreo');
    const btnConfirmarCorreo = document.getElementById('btnConfirmarCorreo');

    const opcionBorrarCuenta = document.getElementById('opcionBorrarCuenta');

    // Mostrar/ocultar formularios
    opcionCambiarContrasena.addEventListener('click', e => {
        e.preventDefault();
        formCambiarContrasena.style.display = formCambiarContrasena.style.display === 'none' ? 'flex' : 'none';
    });

    opcionCambiarCorreo.addEventListener('click', e => {
        e.preventDefault();
        formCambiarCorreo.style.display = formCambiarCorreo.style.display === 'none' ? 'flex' : 'none';
    });

    // Simular envíos
    btnConfirmarPass.addEventListener('click', () => {
        // Aquí irá fetch PUT /usuario/{id}/password
        alert('Simulación: enviar nueva contraseña');
    });

    btnConfirmarCorreo.addEventListener('click', () => {
        // Aquí irá fetch PUT /usuario/{id}/email
        alert('Simulación: enviar nuevo correo');
    });

    opcionBorrarCuenta.addEventListener('click', e => {
        e.preventDefault();
        if (confirm('¿Estás seguro de borrar tu cuenta?')) {
            // Aquí fetch DELETE /usuario/{id}
            alert('Simulación: borrar cuenta');
        }
    });
});