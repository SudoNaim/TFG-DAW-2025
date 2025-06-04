// js/miPerfil.js
        document.addEventListener('DOMContentLoaded', function () {

            // --- Elementos del DOM para el Perfil Editable ---
            const cabeceraMiPerfilContenedor = document.getElementById('cabeceraMiPerfil');
            const miAvatarImgEl = document.getElementById('miAvatarActual');
            const btnCambiarAvatarEl = document.getElementById('botonCambiarMiAvatar');
            const inputMiAvatarEl = document.getElementById('inputMiAvatar');
            const miNombrePerfilEl = document.getElementById('miNombreDePerfil');
            const bioContenedorEl = document.getElementById('contenedorMiBio');
            const textoMiBioEl = document.getElementById('textoMiBioActual');
            const inputMiBioEl = document.getElementById('inputMiBio');
            const btnEditarBioEl = document.getElementById('botonEditarMiBio');
            const botonesAccionMiBioEl = document.getElementById('botonesAccionMiBio');
            const btnGuardarBioEl = document.getElementById('botonGuardarMiBio');
            const btnCancelarBioEl = document.getElementById('botonCancelarMiBio');

            // --- Elementos del DOM para las Publicaciones ---
            const tituloMisPublicacionesEl = document.getElementById('tituloMisPublicaciones');
            const rejillaMisPublicacionesContenedor = document.getElementById('rejillaMisPublicaciones');
            const botonesFiltroMisPublicaciones = document.querySelectorAll('#filtrosMisPublicaciones button');

            // --- DATOS DE EJEMPLO (Simula lo que vendría de tu API para el usuario logueado) ---
            let datosUsuarioActual = {
                idUsuario: "usuarioLogueado789",
                nombreUsuario: "Tu Nombre de Perfil", // Se actualizará al cargar
                avatarUrl: "https://placehold.co/100x100/ff9800/333?text=Yo",
                bio: "Esta es mi biografía personal. Me gusta compartir mis opiniones sobre lo que veo y escucho.",
                publicaciones: [
                    { id: "m_pub_1", urlImagen: 'https://placehold.co/220x150/2196F3/FFFFFF?text=Mi+Peli+A', titulo: 'Película que Vi Ayer', valoracion: '7/10', categoria: 'pelicula', resena: 'Estuvo entretenida, buenos efectos especiales.' },
                    { id: "m_pub_2", urlImagen: 'https://placehold.co/220x150/4CAF50/FFFFFF?text=Mi+Serie+B', titulo: 'Serie en Tendencia', valoracion: '9/10', categoria: 'serie', resena: 'Me tiene enganchado, cada capítulo es una sorpresa.' },
                    { id: "m_pub_3", urlImagen: 'https://placehold.co/220x150/E91E63/FFFFFF?text=Mi+Musica+C', titulo: 'Temazo Descubierto', valoracion: '10/10', categoria: 'musica', resena: 'No paro de escuchar esta canción, ¡es genial!' }
                ]
            };
            let misPublicacionesFiltradas = []; // Para las publicaciones actualmente visibles

            // --- FUNCIONES PARA LA CABECERA DEL PERFIL ---
            function cargarDatosCabecera(datos) {
                if (!datos) return;
                if (miNombrePerfilEl) miNombrePerfilEl.textContent = datos.nombreUsuario || "Nombre de Usuario";
                if (miAvatarImgEl) miAvatarImgEl.src = datos.avatarUrl || "https://placehold.co/100x100/888/FFF?text=?";
                if (textoMiBioEl) textoMiBioEl.textContent = datos.bio || "Añade una biografía...";
                if (inputMiBioEl) inputMiBioEl.value = datos.bio || ""; 
                if (tituloMisPublicacionesEl) tituloMisPublicacionesEl.textContent = `Mis Publicaciones (${(datos.publicaciones || []).length})`;
            }

            // --- LÓGICA PARA CAMBIAR AVATAR ---
            if (btnCambiarAvatarEl && inputMiAvatarEl) {
                btnCambiarAvatarEl.addEventListener('click', () => {
                    inputMiAvatarEl.click(); 
                });

                inputMiAvatarEl.addEventListener('change', function(evento) {
                    const archivo = evento.target.files[0];
                    if (archivo && archivo.type.startsWith('image/')) {
                        const lector = new FileReader();
                        lector.onload = function(e) {
                            if (miAvatarImgEl) miAvatarImgEl.src = e.target.result;
                            datosUsuarioActual.avatarUrl = e.target.result; 
                            console.log("Avatar actualizado (simulado).");
                            alert("Foto de perfil actualizada (simulado).");
                            // Aquí iría la lógica para enviar 'archivo' o 'e.target.result' al backend.
                        }
                        lector.readAsDataURL(archivo);
                    } else {
                        alert("Por favor, selecciona un archivo de imagen válido.");
                    }
                });
            }

            // --- LÓGICA PARA EDITAR BIOGRAFÍA ---
            if (btnEditarBioEl && textoMiBioEl && inputMiBioEl && botonesAccionMiBioEl && btnGuardarBioEl && btnCancelarBioEl) {
                btnEditarBioEl.addEventListener('click', () => {
                    textoMiBioEl.style.display = 'none';
                    inputMiBioEl.value = datosUsuarioActual.bio || ""; 
                    inputMiBioEl.style.display = 'block';
                    inputMiBioEl.focus();
                    btnEditarBioEl.style.display = 'none';
                    botonesAccionMiBioEl.style.display = 'flex';
                });

                btnGuardarBioEl.addEventListener('click', () => {
                    const nuevaBio = inputMiBioEl.value.trim();
                    console.log("Guardando nueva biografía (simulado):", nuevaBio);
                    
                    datosUsuarioActual.bio = nuevaBio; 
                    textoMiBioEl.textContent = nuevaBio || "Añade una biografía...";
                    
                    textoMiBioEl.style.display = 'block';
                    inputMiBioEl.style.display = 'none';
                    btnEditarBioEl.style.display = 'inline-block'; 
                    botonesAccionMiBioEl.style.display = 'none';
                    alert("Biografía guardada (simulado).");
                });

                btnCancelarBioEl.addEventListener('click', () => {
                    textoMiBioEl.style.display = 'block';
                    inputMiBioEl.style.display = 'none';
                    btnEditarBioEl.style.display = 'inline-block';
                    botonesAccionMiBioEl.style.display = 'none';
                });
            }

            // --- FUNCIÓN PARA CREAR TARJETA HTML DE PUBLICACIÓN (REUTILIZANDO ESTILO DE INICIO) ---
            function crearTarjetaPublicacionHtml(publicacion) {
                const tarjeta = document.createElement('div');
                tarjeta.className = 'tarjeta-publicacion-inicio'; 

                if (publicacion.urlImagen) {
                    const img = document.createElement('img');
                    img.src = publicacion.urlImagen;
                    img.alt = publicacion.titulo;
                    img.onerror = function() { 
                        this.src = 'https://placehold.co/220x150/ccc/999?text=ErrorImg'; 
                        this.alt = 'Imagen no disponible';
                    };
                    tarjeta.appendChild(img);
                }

                const tituloH3 = document.createElement('h3');
                tituloH3.textContent = publicacion.titulo;
                tarjeta.appendChild(tituloH3);

                const valoracionP = document.createElement('p');
                valoracionP.textContent = `Valoración: ${publicacion.valoracion}`;
                tarjeta.appendChild(valoracionP);

                if (publicacion.resena) {
                    const resenaP = document.createElement('p');
                    resenaP.textContent = publicacion.resena;
                    tarjeta.appendChild(resenaP);
                }

                const categoriaSpan = document.createElement('span');
                categoriaSpan.className = 'categoria'; 
                categoriaSpan.textContent = publicacion.categoria;
                tarjeta.appendChild(categoriaSpan);
                
                // Aquí podrías añadir botones de Editar/Eliminar para las propias publicaciones
                // Ejemplo:
                // const divAcciones = document.createElement('div');
                // divAcciones.style.marginTop = '10px'; // Espacio simple
                // const btnEditar = document.createElement('button');
                // btnEditar.textContent = 'Editar';
                // btnEditar.style.marginRight = '5px';
                // btnEditar.onclick = () => alert(`Editar: ${publicacion.titulo} (A IMPLEMENTAR)`);
                // const btnEliminar = document.createElement('button');
                // btnEliminar.textContent = 'Eliminar';
                // btnEliminar.onclick = () => { 
                //     if(confirm(`¿Seguro que quieres eliminar "${publicacion.titulo}"?`)) {
                //         alert(`Eliminar: ${publicacion.titulo} (A IMPLEMENTAR)`);
                //     }
                // };
                // divAcciones.appendChild(btnEditar);
                // divAcciones.appendChild(btnEliminar);
                // tarjeta.appendChild(divAcciones);

                return tarjeta;
            }

            // --- FUNCIÓN PARA MOSTRAR MIS PUBLICACIONES ---
            function mostrarMisPublicaciones(listaPublicaciones) {
                if (!rejillaMisPublicacionesContenedor) return;
                rejillaMisPublicacionesContenedor.innerHTML = ''; 

                if (!listaPublicaciones || listaPublicaciones.length === 0) {
                    rejillaMisPublicacionesContenedor.innerHTML = '<p style="color:#ccc; text-align:center; width:100%;">Aún no tienes publicaciones en esta categoría.</p>';
                    return;
                }
                listaPublicaciones.forEach(pub => {
                    const tarjeta = crearTarjetaPublicacionHtml(pub);
                    rejillaMisPublicacionesContenedor.appendChild(tarjeta);
                });
            }

            // --- LÓGICA DE FILTROS PARA MIS PUBLICACIONES ---
            if (botonesFiltroMisPublicaciones.length > 0) {
                botonesFiltroMisPublicaciones.forEach(boton => {
                    boton.addEventListener('click', function() {
                        botonesFiltroMisPublicaciones.forEach(btn => btn.classList.remove('activo'));
                        this.classList.add('activo');
                        const categoria = this.dataset.categoria;

                        if (!datosUsuarioActual) return; 

                        if (categoria === 'todo') {
                            misPublicacionesFiltradas = datosUsuarioActual.publicaciones || [];
                        } else {
                            misPublicacionesFiltradas = (datosUsuarioActual.publicaciones || []).filter(pub => pub.categoria === categoria);
                        }
                        mostrarMisPublicaciones(misPublicacionesFiltradas);
                    });
                });
            }

            // --- FUNCIÓN PRINCIPAL PARA CARGAR DATOS DE MI PERFIL ---
            function cargarMiPerfil() {
                // SIMULACIÓN: En una app real, harías un fetch para obtener estos datos.
                cargarDatosCabecera(datosUsuarioActual);
                misPublicacionesFiltradas = datosUsuarioActual.publicaciones || [];
                mostrarMisPublicaciones(misPublicacionesFiltradas);
                
                const filtroTodo = document.querySelector('#filtrosMisPublicaciones button[data-categoria="todo"]');
                if (filtroTodo) {
                    botonesFiltroMisPublicaciones.forEach(btn => btn.classList.remove('activo'));
                    filtroTodo.classList.add('activo');
                }
            }

            // --- INICIALIZACIÓN ---
            if (cabeceraMiPerfilContenedor) { 
                cargarMiPerfil();
            }
        });