// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

    const formularioCrear = document.getElementById('formularioCrearPublicacion');
    const botonCancelar = document.getElementById('botonCancelarCreacion');

    if (formularioCrear) {
        formularioCrear.addEventListener('submit', function (evento) {
            evento.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

            // Recoger los datos del formulario
            const titulo = document.getElementById('tituloPublicacion').value;
            const urlImagen = document.getElementById('urlImagenPublicacion').value;
            const valoracion = document.getElementById('valoracionPublicacion').value;
            const categoria = document.getElementById('categoriaPublicacion').value;
            const resena = document.getElementById('resenaPublicacion').value;

            // Validaciones básicas (puedes añadir más)
            if (!titulo.trim()) {
                alert('El campo "Título" es obligatorio.');
                return;
            }
            if (!valoracion.trim()) {
                alert('El campo "Valoración" es obligatorio.');
                return;
            }
            if (!categoria) {
                alert('Debes seleccionar una "Categoría".');
                return;
            }

            // Crear el objeto JSON como lo especificaste (el id se generaría en el backend)
            const nuevaPublicacion = {
                // id: // Este lo generaría el backend o un sistema de IDs en el frontend si no hay backend
                urlImagen: urlImagen.trim() || null, // Si está vacío, enviar null o no enviarlo
                titulo: titulo.trim(),
                valoracion: valoracion.trim(),
                categoria: categoria,
                resena: resena.trim() || null // Si está vacío, enviar null o no enviarlo
            };

            console.log('Datos de la nueva publicación a enviar:', nuevaPublicacion);
            alert('Publicación lista para enviar (simulado).\nMira la consola para ver el objeto JSON.');

            // AQUÍ IRÍA LA LÓGICA PARA ENVIAR `nuevaPublicacion` A TU API
            // Ejemplo con fetch (necesitarás un endpoint en tu backend):
            /*
            fetch('URL_DE_TU_API_PARA_CREAR_PUBLICACIONES', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': 'Bearer ' + localStorage.getItem('tokenUsuarioLikely') // Si necesitas token
                },
                body: JSON.stringify(nuevaPublicacion)
            })
            .then(respuesta => {
                if (!respuesta.ok) {
                    // Si la respuesta no es OK, intenta obtener el mensaje de error del cuerpo
                    return respuesta.json().then(errorInfo => {
                        throw new Error(errorInfo.detalle || `Error del servidor: ${respuesta.status}`);
                    });
                }
                return respuesta.json();
            })
            .then(datos => {
                console.log('Publicación guardada:', datos);
                alert('¡Publicación guardada con éxito!');
                // Opcional: Limpiar el formulario
                formularioCrear.reset(); 
                // Opcional: Redirigir a la página de inicio o donde se vean las publicaciones
                // window.location.href = 'URL_A_LA_PAGINA_DE_INICIO'; 
            })
            .catch(error => {
                console.error('Error al guardar la publicación:', error);
                alert(`Error al guardar: ${error.message}`);
            });
            */

            // Por ahora, solo limpiamos el formulario para simular que se ha enviado
            // formularioCrear.reset();
        });
    }

    if (botonCancelar) {
        botonCancelar.addEventListener('click', function(evento) {
            evento.preventDefault();
            // Preguntar si está seguro o simplemente redirigir
            if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los datos no guardados.')) {
                alert('Creación cancelada.');
                // Aquí podrías redirigir a la página anterior o a la de inicio
                // Ejemplo: window.location.href = 'URL_DE_LA_PAGINA_ANTERIOR_O_INICIO';
                formularioCrear.reset(); // Limpia el formulario
            }
        });
    }
});