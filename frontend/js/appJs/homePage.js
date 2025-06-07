// homePage.js
document.addEventListener('DOMContentLoaded', function () {
    const listaPublicacionesContenedor = document.getElementById('listaPublicaciones');
    const botonesFiltro = document.querySelectorAll('.filtros-inicio button');
    let todasLasPublicaciones = [];  // ← ahora vacía, se rellenará con fetch

    // 1) Función para cargar desde el backend
    async function cargarPublicaciones() {
        try {
            const userId = localStorage.getItem('user_id');
            const res = await fetch(`http://127.0.0.1:8000/posts/${userId}`);
            if (!res.ok) throw new Error('Error al recuperar publicaciones');
            todasLasPublicaciones = await res.json();
            mostrarPublicacionesEnContenido(todasLasPublicaciones);
        } catch (err) {
            console.error('Error cargando publicaciones:', err);
            listaPublicacionesContenedor.innerHTML =
              '<p style="width:100%; text-align:center;">No se pudieron cargar las publicaciones.</p>';
        }
    }

    // 2) Tu función existente de creación de tarjeta
    function crearTarjetaHtmlParaPublicacion(publicacion) {
        const tarjetaDiv = document.createElement('div');
        tarjetaDiv.className = 'tarjeta-publicacion-inicio';

        if (publicacion.imagen_url) {
            const imagenEl = document.createElement('img');
            imagenEl.src = publicacion.imagen_url;
            imagenEl.alt = publicacion.titulo;
            imagenEl.onerror = function() { 
                this.alt = 'Imagen no disponible';
                this.src = 'https://placehold.co/220x150/ccc/999?text=Error'; 
            };
            tarjetaDiv.appendChild(imagenEl);
        }

        const tituloEl = document.createElement('h3');
        tituloEl.textContent = publicacion.titulo;
        tarjetaDiv.appendChild(tituloEl);

        const valoracionEl = document.createElement('p');
        valoracionEl.textContent = `Valoración: ${publicacion.valoracion}`;
        tarjetaDiv.appendChild(valoracionEl);

        if (publicacion.resena) {
            const resenaEl = document.createElement('p');
            resenaEl.className = 'descripcion-publicacion';
            resenaEl.textContent = publicacion.resena;
            tarjetaDiv.appendChild(resenaEl);
        }

        const categoriaEl = document.createElement('p');
        categoriaEl.className = 'categoria'; 
        categoriaEl.textContent = `Categoría: ${publicacion.categoria}`;
        tarjetaDiv.appendChild(categoriaEl);
        
        return tarjetaDiv;
    }

    // 3) Tu función existente de mostrar en DOM
    function mostrarPublicacionesEnContenido(publicacionesAMostrar) {
        if (!listaPublicacionesContenedor) return;
        listaPublicacionesContenedor.innerHTML = '';

        if (publicacionesAMostrar.length === 0) {
            listaPublicacionesContenedor.innerHTML =
            '<p style="width:100%; text-align:center;">No hay publicaciones para mostrar en esta categoría.</p>';
            return;
        }

        publicacionesAMostrar.forEach(function(publicacion) {
            const tarjetaHtml = crearTarjetaHtmlParaPublicacion(publicacion);
            listaPublicacionesContenedor.appendChild(tarjetaHtml);
        });
    }

    // 4) Listener de filtros (idéntico al tuyo)
    if (botonesFiltro.length > 0) {
        botonesFiltro.forEach(function(boton) {
            boton.addEventListener('click', function() {
                botonesFiltro.forEach(btn => btn.classList.remove('activo'));
                this.classList.add('activo');
                const categoriaSeleccionada = this.dataset.categoria;

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
    }

    // 5) Inicialización
    cargarPublicaciones().then(() => {
        // Activar el primer filtro (“Todo”) solo tras cargar
        if (botonesFiltro.length > 0) {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            botonesFiltro[0].classList.add('activo');
        }
    });
});
