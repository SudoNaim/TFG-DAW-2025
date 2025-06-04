// Asegúrate de que este código se ejecute DESPUÉS de que el HTML esté cargado.
// Si este es un archivo separado, envuélvelo en:
// document.addEventListener('DOMContentLoaded', function() { ... });
// Si lo añades a un homePage.js existente que ya tiene DOMContentLoaded,
// simplemente añade estas constantes y listeners dentro.

// --- LÓGICA PARA LA PÁGINA DE CONFIGURACIÓN ---

// Opciones de Cuenta
const opcionCambiarContrasena = document.getElementById('opcionCambiarContrasena');
const opcionCambiarCorreo = document.getElementById('opcionCambiarCorreo');
const opcionBorrarCuenta = document.getElementById('opcionBorrarCuenta');

// Opciones de Privacidad
const opcionGestionarAmigos = document.getElementById('opcionGestionarAmigos');
const opcionVisibilidadPerfil = document.getElementById('opcionVisibilidadPerfil');

// Opciones de Apariencia
const selectorTema = document.getElementById('selectorTema');

// Opciones de Notificaciones
const toggleNotificacionesCorreo = document.getElementById('toggleNotificacionesCorreo');
const toggleNotificacionesApp = document.getElementById('toggleNotificacionesApp');


// Event Listeners para las opciones (ejemplos)
if (opcionCambiarContrasena) {
    opcionCambiarContrasena.addEventListener('click', function(evento) {
        evento.preventDefault(); // Prevenir navegación si es un enlace '#'
        alert('Funcionalidad: Cambiar contraseña (a implementar)');
        // Aquí iría la lógica para mostrar un formulario de cambio de contraseña
    });
}

if (opcionCambiarCorreo) {
    opcionCambiarCorreo.addEventListener('click', function(evento) {
        evento.preventDefault();
        alert('Funcionalidad: Cambiar correo electrónico (a implementar)');
    });
}

if (opcionBorrarCuenta) {
    opcionBorrarCuenta.addEventListener('click', function(evento) {
        evento.preventDefault();
        if (confirm('¿Estás seguro de que quieres borrar tu cuenta? Esta acción no se puede deshacer.')) {
            alert('Funcionalidad: Borrar cuenta (a implementar CON MUCHO CUIDADO)');
            // Aquí iría una llamada a la API para borrar la cuenta
        }
    });
}

if (opcionGestionarAmigos) {
    opcionGestionarAmigos.addEventListener('click', function(evento) {
        evento.preventDefault();
        alert('Funcionalidad: Gestionar amigos bloqueados (a implementar)');
    });
}

if (opcionVisibilidadPerfil) {
    opcionVisibilidadPerfil.addEventListener('click', function(evento) {
        evento.preventDefault();
        alert('Funcionalidad: Cambiar visibilidad del perfil (a implementar)');
    });
}

if (selectorTema) {
    selectorTema.addEventListener('change', function(evento) {
        const temaSeleccionado = evento.target.value;
        alert(`Tema cambiado a: ${temaSeleccionado} (la implementación visual del cambio de tema está pendiente)`);
        // Aquí iría la lógica para cambiar clases en el body o cargar otra hoja de estilos
        if (temaSeleccionado === 'claro') {
            // document.body.classList.add('tema-claro');
            // document.body.classList.remove('tema-oscuro'); // Si tienes una para el oscuro por defecto
        } else {
            // document.body.classList.add('tema-oscuro');
            // document.body.classList.remove('tema-claro');
        }
    });
}

if (toggleNotificacionesCorreo) {
    toggleNotificacionesCorreo.addEventListener('change', function(evento) {
        if (evento.target.checked) {
            alert('Notificaciones por correo ACTIVADAS (simulado)');
        } else {
            alert('Notificaciones por correo DESACTIVADAS (simulado)');
        }
        // Aquí guardarías esta preferencia (ej. en localStorage o enviándola a la API)
    });
}

if (toggleNotificacionesApp) {
    toggleNotificacionesApp.addEventListener('change', function(evento) {
        if (evento.target.checked) {
            alert('Notificaciones push de la app ACTIVADAS (simulado)');
        } else {
            alert('Notificaciones push de la app DESACTIVADAS (simulado)');
        }
    });
}

// Lógica para manejar la navegación si esta página se carga dinámicamente:
// Por ejemplo, si en tu barra lateral haces clic en "Configuración",
// necesitarías un script que borre el contenido actual de <div class="contenido">
// y luego inserte el HTML de configuración y ejecute este script de configuración.
// Por ahora, este script asume que el HTML de configuración ya está presente en la página.