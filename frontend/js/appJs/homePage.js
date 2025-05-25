// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {

    const listaPublicacionesContenedor = document.getElementById('listaPublicaciones');
    const botonesFiltro = document.querySelectorAll('.filtros-inicio button');
    const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion');

    // DATOS DE EJEMPLO (simulando lo que vendría de tu API)
    const todasLasPublicaciones = [
        {
            id: 1,
            urlImagen: 'https://placehold.co/200x150/ff9800/333?text=Peli+1',
            titulo: 'Peliculón Increíble',
            valoracion: '9.5/10',
            categoria: 'pelicula',
            resena: 'Muy buena, la recomiendo mucho. Buenos efectos y trama.'
        },
        {
            id: 2,
            urlImagen: 'https://placehold.co/200x150/4CAF50/fff?text=Serie+TOP',
            titulo: 'Serie para Maratonear',
            valoracion: '10/10',
            categoria: 'serie',
            resena: 'Engancha desde el primer capítulo. ¡No te la pierdas!'
        },
        {
            id: 3,
            urlImagen: 'https://placehold.co/200x150/2196F3/fff?text=Música+Relax',
            titulo: 'Disco para Relajarse',
            valoracion: '8/10',
            categoria: 'musica',
            resena: 'Perfecto para desconectar después de un largo día.'
        },
        {
            id: 4,
            urlImagen: 'https://placehold.co/200x150/00BCD4/fff?text=Otra+Peli',
            titulo: 'Película de Acción',
            valoracion: '7/10',
            categoria: 'pelicula',
            resena: 'Mucha acción y explosiones. Para pasar el rato.'
        }
        // Puedes añadir más objetos aquí
    ];

    // Función para crear el HTML de una tarjeta de publicación
    function crearTarjetaHtmlParaPublicacion(publicacion) {
        // Creamos un div para la tarjeta
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'tarjeta-publicacion-inicio'; // Le asignamos su clase CSS

        // Creamos y añadimos la imagen (si existe)
        if (publicacion.urlImagen) {
            const imagenEl = document.createElement('img');
            imagenEl.src = publicacion.urlImagen;
            imagenEl.alt = publicacion.titulo; // Texto alternativo para accesibilidad
            // Fallback simple si la imagen no carga
            imagenEl.onerror = function() { 
                this.alt = 'Imagen no disponible';
                this.src = 'https://placehold.co/200x150/ccc/999?text=Error'; 
            };
            tarjetaDiv.appendChild(imagenEl);
        }

        // Creamos y añadimos el título
        const tituloEl = document.createElement('h3');
        tituloEl.textContent = publicacion.titulo;
        tarjetaDiv.appendChild(tituloEl);

        // Creamos y añadimos la valoración
        const valoracionEl = document.createElement('p');
        valoracionEl.textContent = `Valoración: ${publicacion.valoracion}`;
        tarjetaDiv.appendChild(valoracionEl);

        // Creamos y añadimos la reseña (si existe)
        if (publicacion.resena) {
            const resenaEl = document.createElement('p');
            resenaEl.textContent = publicacion.resena;
            tarjetaDiv.appendChild(resenaEl);
        }

        // Creamos y añadimos la categoría
        const categoriaEl = document.createElement('p');
        categoriaEl.className = 'categoria'; // Para darle un estilo específico si quieres
        categoriaEl.textContent = `Categoría: ${publicacion.categoria}`;
        tarjetaDiv.appendChild(categoriaEl);
        
        return tarjetaDiv; // Devolvemos el div de la tarjeta completo
    }

    // Función para mostrar las publicaciones en el HTML
    function mostrarPublicacionesEnContenido(publicacionesAMostrar) {
        // Primero, limpiamos el contenedor por si ya había algo
        listaPublicacionesContenedor.innerHTML = '';

        if (publicacionesAMostrar.length === 0) {
            listaPublicacionesContenedor.innerHTML = '<p>No hay publicaciones para mostrar en esta categoría.</p>';
            return;
        }

        // Por cada publicación en la lista, creamos su tarjeta y la añadimos al contenedor
        publicacionesAMostrar.forEach(function(publicacion) {
            const tarjetaHtml = crearTarjetaHtmlParaPublicacion(publicacion);
            listaPublicacionesContenedor.appendChild(tarjetaHtml);
        });
    }

    // Lógica para los botones de filtro
    botonesFiltro.forEach(function(boton) {
        boton.addEventListener('click', function() {
            // Quitar clase 'activo' de todos los botones
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            // Añadir clase 'activo' al botón clickeado
            this.classList.add('activo');

            const categoriaSeleccionada = this.dataset.categoria; // 'todo', 'pelicula', 'serie', etc.

            if (categoriaSeleccionada === 'todo') {
                mostrarPublicacionesEnContenido(todasLasPublicaciones);
            } else {
                const publicacionesFiltradas = todasLasPublicaciones.filter(function(publicacion) {
                    return publicacion.categoria === categoriaSeleccionada;
                });
                mostrarPublicacionesEnContenido(publicacionesFiltradas);
            }
        });
    });

    // Lógica para el botón de "Nueva Publicación" (acción de ejemplo)
    if (btnNuevaPublicacion) {
        btnNuevaPublicacion.addEventListener('click', function() {
            alert('Aquí iría la lógica para crear una nueva publicación (ej. mostrar un formulario).');
        });
    }

    // Al cargar la página, mostrar todas las publicaciones por defecto
    if (listaPublicacionesContenedor) { // Solo si existe el contenedor
        mostrarPublicacionesEnContenido(todasLasPublicaciones);
    } else {
        console.error("No se encontró el elemento con ID 'listaPublicaciones'. Verifica tu HTML.");
    }

});