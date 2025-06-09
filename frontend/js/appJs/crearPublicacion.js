// crearPublicacion.js

// Espera a que todo el DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtengo el formulario de crear publicación y el botón de cancelar por su ID
    const formularioCrear = document.getElementById('formularioCrearPublicacion');
    const botonCancelar = document.getElementById('botonCancelarCreacion');

    // Si existe el formulario (por si acaso la página no lo tiene)
    if (formularioCrear) {
        // Escucho el evento submit del formulario
        formularioCrear.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evito que se recargue la página al enviar el formulario

            // Obtengo los valores de los campos del formulario
            const titulo = document.getElementById('tituloPublicacion').value.trim();
            const urlImagen = document.getElementById('urlImagenPublicacion').value.trim() || null;
            const valoracion = document.getElementById('valoracionPublicacion').value.trim();
            const categoria = document.getElementById('categoriaPublicacion').value;
            const resena = document.getElementById('resenaPublicacion').value.trim() || null;

            // Compruebo que los campos obligatorios no estén vacíos
            if (!titulo) {
                return alert('El campo "Título" es obligatorio.');
            }
            if (!valoracion) {
                return alert('El campo "Valoración" es obligatorio.');
            }
            if (!categoria) {
                return alert('Debes seleccionar una "Categoría".');
            }

            // Obtengo el ID del usuario desde el localStorage
            const userId = parseInt(localStorage.getItem('user_id'), 10);
            if (!userId) {
                return alert('No hay usuario logueado. Por favor haz login de nuevo.');
            }

            // Creo el objeto con los datos de la nueva publicación
            const nuevaPublicacion = {
                titulo: titulo,
                imagen_url: urlImagen,
                valoracion: parseFloat(valoracion),
                categoria: categoria,
                resena: resena,
                user_id: userId
            };

            try {
                // Hago la petición POST al backend para guardar la publicación
                const res = await fetch('http://127.0.0.1:8000/posts/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaPublicacion)
                });
                // Si la respuesta no es OK, muestro el error
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || `HTTP ${res.status}`);
                }

                // Si todo va bien, muestro mensaje de éxito y redirijo a la home
                const creado = await res.json();
                console.log(' Publicación creada:', creado);
                alert('¡Publicación guardada con éxito!');

                formularioCrear.reset(); // Limpio el formulario

                window.location.href = 'homePage.html'; // Redirijo a la página principal

            } catch (error) {
                // Si hay algún error, lo muestro por consola y con un alert
                console.error(' Error al guardar la publicación:', error);
                alert(`Error al guardar: ${error.message}`);
            }
        });
    }

    // Si existe el botón de cancelar
    if (botonCancelar) {
        // Escucho el click en el botón de cancelar
        botonCancelar.addEventListener('click', (e) => {
            e.preventDefault(); // Evito el comportamiento por defecto
            // Pregunto al usuario si está seguro de cancelar
            if (confirm('¿Seguro que quieres cancelar? Se perderán los datos.')) {
                formularioCrear.reset(); // Limpio el formulario
                window.location.href = 'homePage.html'; // Redirijo a la home
            }
        });
    }
});
