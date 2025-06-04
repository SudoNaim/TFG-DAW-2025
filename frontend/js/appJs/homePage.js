
        // homePage.js (tu script actual, no se modifica para este cambio visual)
        document.addEventListener('DOMContentLoaded', function () {

            const listaPublicacionesContenedor = document.getElementById('listaPublicaciones');
            const botonesFiltro = document.querySelectorAll('.filtros-inicio button');
            // const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion'); // El botón sigue existiendo

            const todasLasPublicaciones = [
                {
                    id: 1,
                    urlImagen: 'https://placehold.co/220x150/ff9800/333?text=Peli+1',
                    titulo: 'Peliculón Increíble y con un Título Muy Largo',
                    valoracion: '9.5/10',
                    categoria: 'pelicula',
                    resena: 'Muy buena, la recomiendo mucho. Buenos efectos y trama que se extiende para probar el scroll y ver cómo se comporta el texto dentro de la tarjeta.'
                },
                {
                    id: 2,
                    urlImagen: 'https://placehold.co/220x150/4CAF50/fff?text=Serie+TOP',
                    titulo: 'Serie para Maratonear',
                    valoracion: '10/10',
                    categoria: 'serie',
                    resena: 'Engancha desde el primer capítulo. ¡No te la pierdas! Definitivamente una de las mejores del año.'
                },
                {
                    id: 3,
                    urlImagen: 'https://placehold.co/220x150/2196F3/fff?text=Música+Relax',
                    titulo: 'Disco para Relajarse',
                    valoracion: '8/10',
                    categoria: 'musica',
                    resena: 'Perfecto para desconectar después de un largo día de trabajo o estudio intenso.'
                },
                {
                    id: 4,
                    urlImagen: 'https://placehold.co/220x150/00BCD4/fff?text=Otra+Peli',
                    titulo: 'Película de Acción Trepidante',
                    valoracion: '7/10',
                    categoria: 'pelicula',
                    resena: 'Mucha acción y explosiones. Para pasar el rato y no pensar demasiado, cumple su cometido.'
                },
                {
                    id: 5,
                    urlImagen: 'https://placehold.co/220x150/E91E63/fff?text=Documental',
                    titulo: 'Documental Impactante',
                    valoracion: '9/10',
                    categoria: 'serie', // O podría ser 'documental' si tienes esa categoría
                    resena: 'Abre los ojos a una realidad desconocida. Muy bien investigado y presentado.'
                }
            ];

            function crearTarjetaHtmlParaPublicacion(publicacion) {
                const tarjetaDiv = document.createElement('div');
                tarjetaDiv.className = 'tarjeta-publicacion-inicio';

                if (publicacion.urlImagen) {
                    const imagenEl = document.createElement('img');
                    imagenEl.src = publicacion.urlImagen;
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
                    resenaEl.className = 'descripcion-publicacion'; // Añadida clase para control de altura
                    resenaEl.textContent = publicacion.resena;
                    tarjetaDiv.appendChild(resenaEl);
                }

                const categoriaEl = document.createElement('p'); // Cambiado a p para consistencia con otros textos
                categoriaEl.className = 'categoria'; 
                categoriaEl.textContent = `Categoría: ${publicacion.categoria}`;
                tarjetaDiv.appendChild(categoriaEl);
                
                return tarjetaDiv;
            }

            function mostrarPublicacionesEnContenido(publicacionesAMostrar) {
                if (!listaPublicacionesContenedor) return;
                listaPublicacionesContenedor.innerHTML = '';

                if (publicacionesAMostrar.length === 0) {
                    listaPublicacionesContenedor.innerHTML = '<p style="width:100%; text-align:center;">No hay publicaciones para mostrar en esta categoría.</p>';
                    return;
                }

                publicacionesAMostrar.forEach(function(publicacion) {
                    const tarjetaHtml = crearTarjetaHtmlParaPublicacion(publicacion);
                    listaPublicacionesContenedor.appendChild(tarjetaHtml);
                });
            }

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

            if (listaPublicacionesContenedor) {
                mostrarPublicacionesEnContenido(todasLasPublicaciones);
                 // Activar el primer botón de filtro ("Todo") por defecto
                if (botonesFiltro.length > 0) {
                    botonesFiltro.forEach(btn => btn.classList.remove('activo')); // Limpiar todos
                    botonesFiltro[0].classList.add('activo'); // Activar el primero
                }
            } else {
                console.error("No se encontró el elemento con ID 'listaPublicaciones'. Verifica tu HTML.");
            }
        });