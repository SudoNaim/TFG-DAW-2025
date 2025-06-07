// crearPublicacion.js
document.addEventListener('DOMContentLoaded', () => {
    const formularioCrear = document.getElementById('formularioCrearPublicacion');
    const botonCancelar = document.getElementById('botonCancelarCreacion');

    if (formularioCrear) {
        formularioCrear.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1) Recogemos campos del formulario
            const titulo = document.getElementById('tituloPublicacion').value.trim();
            const urlImagen = document.getElementById('urlImagenPublicacion').value.trim() || null;
            const valoracion = document.getElementById('valoracionPublicacion').value.trim();
            const categoria = document.getElementById('categoriaPublicacion').value;
            const resena = document.getElementById('resenaPublicacion').value.trim() || null;

            // 2) Validaciones básicas
            if (!titulo) {
                return alert('El campo "Título" es obligatorio.');
            }
            if (!valoracion) {
                return alert('El campo "Valoración" es obligatorio.');
            }
            if (!categoria) {
                return alert('Debes seleccionar una "Categoría".');
            }

            // 3) Construimos el objeto con el user_id
            const userId = parseInt(localStorage.getItem('user_id'), 10);
            if (!userId) {
                return alert('No hay usuario logueado. Por favor haz login de nuevo.');
            }

            const nuevaPublicacion = {
                titulo: titulo,
                imagen_url: urlImagen,
                valoracion: parseFloat(valoracion),
                categoria: categoria,
                resena: resena,
                user_id: userId
            };

            try {
                // 4) Enviamos al backend
                const res = await fetch('http://127.0.0.1:8000/posts/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevaPublicacion)
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || `HTTP ${res.status}`);
                }

                const creado = await res.json();
                console.log('✅ Publicación creada:', creado);
                alert('¡Publicación guardada con éxito!');

                // 5) Limpiamos el formulario
                formularioCrear.reset();

                // 6) Redirigimos al home para que recargue lista
                window.location.href = 'homePage.html';

            } catch (error) {
                console.error('❌ Error al guardar la publicación:', error);
                alert(`Error al guardar: ${error.message}`);
            }
        });
    }

    if (botonCancelar) {
        botonCancelar.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Seguro que quieres cancelar? Se perderán los datos.')) {
                formularioCrear.reset();
                window.location.href = 'homePage.html';
            }
        });
    }
});
