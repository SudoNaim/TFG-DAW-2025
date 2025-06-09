// homePage.js

// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {
    // Obtengo el contenedor donde se mostrarán las publicaciones
    const listaPublicacionesContenedor = document.getElementById('listaPublicaciones');
    // Selecciono todos los botones de filtro de la página de inicio
    const botonesFiltro = document.querySelectorAll('.filtros-inicio button');
    // Aquí guardo todas las publicaciones que se cargan desde el backend
    let todasLasPublicaciones = [];

    // Función asíncrona para cargar las publicaciones del usuario
    async function cargarPublicaciones() {
        try {
            // Obtengo el ID del usuario guardado en localStorage
            const userId = localStorage.getItem('user_id');
            // Hago la petición al backend para obtener las publicaciones de ese usuario
            const res = await fetch(`http://127.0.0.1:8000/posts/${userId}`);
            // Si la respuesta no es correcta, lanzo un error
            if (!res.ok) throw new Error('Error al recuperar publicaciones');
            // Guardo las publicaciones en la variable global
            todasLasPublicaciones = await res.json();
            // Muestro las publicaciones en el contenedor
            mostrarPublicacionesEnContenido(todasLasPublicaciones);
        } catch (err) {
            // Si hay algún error, lo muestro por consola y aviso al usuario en la web
            console.error('Error cargando publicaciones:', err);
            listaPublicacionesContenedor.innerHTML =
                '<p style="width:100%; text-align:center;">No se pudieron cargar las publicaciones.</p>';
        }
    }

    // Esta función crea el HTML de una tarjeta para cada publicación
    function crearTarjetaHtmlParaPublicacion(publicacion) {
        // Creo el div principal de la tarjeta
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'tarjeta-publicacion-inicio';

        // Creo la imagen de la publicación (si no hay, pongo una por defecto)
        const img = document.createElement('img');
        const texto = encodeURIComponent(publicacion.titulo || 'No+Image');
        img.src = publicacion.imagen_url || `https://placehold.co/220x150/777/fff?text=${texto}`;
        img.alt = publicacion.titulo;
        // Si la imagen falla, pongo otra imagen de error
        img.onerror = () => {
            img.src = `https://placehold.co/220x150/ccc/999?text=${texto}`;
            img.alt = 'Imagen no disponible';
        };
        tarjetaDiv.appendChild(img);

        // Título de la publicación
        const tituloEl = document.createElement('h3');
        tituloEl.textContent = publicacion.titulo;
        tarjetaDiv.appendChild(tituloEl);

        // Valoración de la publicación
        const valoracionEl = document.createElement('p');
        valoracionEl.textContent = `Valoración: ${publicacion.valoracion}`;
        tarjetaDiv.appendChild(valoracionEl);

        // Si la publicación tiene reseña, la muestro
        if (publicacion.resena) {
            const resenaEl = document.createElement('p');
            resenaEl.className = 'descripcion-publicacion';
            resenaEl.textContent = publicacion.resena;
            tarjetaDiv.appendChild(resenaEl);
        }

        // Muestro la categoría de la publicación
        const categoriaEl = document.createElement('p');
        categoriaEl.className = 'categoria';
        categoriaEl.textContent = `Categoría: ${publicacion.categoria}`;
        tarjetaDiv.appendChild(categoriaEl);

        // Devuelvo la tarjeta ya montada
        return tarjetaDiv;
    }

    // Esta función muestra las publicaciones que recibe en el contenedor de la página
    function mostrarPublicacionesEnContenido(publicacionesAMostrar) {
        // Si no existe el contenedor, salgo de la función
        if (!listaPublicacionesContenedor) return;
        // Limpio el contenedor antes de mostrar nuevas publicaciones
        listaPublicacionesContenedor.innerHTML = '';

        // Si no hay publicaciones para mostrar, aviso al usuario
        if (publicacionesAMostrar.length === 0) {
            listaPublicacionesContenedor.innerHTML =
                '<p style="width:100%; text-align:center;">No hay publicaciones para mostrar en esta categoría.</p>';
            return;
        }

        // Recorro todas las publicaciones y las añado al contenedor
        publicacionesAMostrar.forEach(function (publicacion) {
            const tarjetaHtml = crearTarjetaHtmlParaPublicacion(publicacion);
            listaPublicacionesContenedor.appendChild(tarjetaHtml);
        });
    }

    // Si hay botones de filtro, les añado el evento click
    if (botonesFiltro.length > 0) {
        botonesFiltro.forEach(function (boton) {
            boton.addEventListener('click', function () {
                // Quito la clase 'activo' de todos los botones
                botonesFiltro.forEach(btn => btn.classList.remove('activo'));
                // Pongo la clase 'activo' solo al botón que se ha pulsado
                this.classList.add('activo');
                // Obtengo la categoría seleccionada del botón
                const categoriaSeleccionada = this.dataset.categoria;

                // Si el filtro es 'todo', muestro todas las publicaciones
                if (categoriaSeleccionada === 'todo') {
                    mostrarPublicacionesEnContenido(todasLasPublicaciones);
                } else {
                    // Si no, filtro las publicaciones por la categoría seleccionada
                    const publicacionesFiltradas = todasLasPublicaciones.filter(function (publicacion) {
                        return publicacion.categoria === categoriaSeleccionada;
                    });
                    mostrarPublicacionesEnContenido(publicacionesFiltradas);
                }
            });
        });
    }

    // Cargo las publicaciones al cargar la página y marco el primer filtro como activo
    cargarPublicaciones().then(() => {
        if (botonesFiltro.length > 0) {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            botonesFiltro[0].classList.add('activo');
        }
    });
});
