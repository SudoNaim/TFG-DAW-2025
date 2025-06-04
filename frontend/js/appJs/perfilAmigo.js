// js/perfilAmigo.js
document.addEventListener('DOMContentLoaded', function () {

    const cabeceraContenedor = document.getElementById('cabeceraPerfilAmigo');
    const nombrePerfilEl = cabeceraContenedor ? cabeceraContenedor.querySelector('.nombre-perfil-amigo') : null;
    const avatarPerfilEl = cabeceraContenedor ? cabeceraContenedor.querySelector('.avatar-perfil-amigo') : null;
    
    const tituloPublicacionesEl = document.getElementById('tituloPublicacionesAmigo');
    const rejillaPublicacionesContenedor = document.getElementById('rejillaPublicacionesAmigo');
    const botonesFiltroAmigo = document.querySelectorAll('#filtrosPublicacionesAmigo button');

    // --- SIMULACIÓN: CÓMO OBTENER EL ID DEL AMIGO ---
    // En una aplicación real, obtendrías esto de la URL (ej. ?id=usr_001)
    // o de un estado global si es una SPA.
    function obtenerIdAmigoDesdeURL() {
        const parametrosUrl = new URLSearchParams(window.location.search);
        return parametrosUrl.get('idAmigo'); // Asegúrate que el parámetro se llame 'idAmigo'
    }
    const idAmigoActual = obtenerIdAmigoDesdeURL() || "amigo1"; // ID de amigo por defecto para el ejemplo

    // --- DATOS DE EJEMPLO (Simulación de base de datos) ---
    const datosAmigos = {
        "amigo1": {
            nombre: "Elena Viajera",
            avatarUrl: "https://placehold.co/100x100/FFC107/000000?text=EV",
            publicaciones: [
                { id: "p1", urlImagen: 'https://placehold.co/220x150/4CAF50/FFFFFF?text=Viaje+Montaña', titulo: 'Aventura en la Montaña', valoracion: '10/10', categoria: 'pelicula', resena: '¡Una experiencia inolvidable! Las vistas eran espectaculares.' },
                { id: "p2", urlImagen: 'https://placehold.co/220x150/03A9F4/FFFFFF?text=Libro+Playa', titulo: 'Libro para la Playa', valoracion: '8/10', categoria: 'libro', resena: 'Lectura ligera y entretenida, perfecta para las vacaciones.' }
            ]
        },
        "amigo2": {
            nombre: "Carlos Gourmet",
            avatarUrl: "https://placehold.co/100x100/F44336/FFFFFF?text=CG",
            publicaciones: [
                { id: "p3", urlImagen: 'https://placehold.co/220x150/795548/FFFFFF?text=Restaurante+Nuevo', titulo: 'Nuevo Restaurante Fusión', valoracion: '9/10', categoria: 'otro', resena: 'Sabores únicos y presentación impecable. Volveré.' },
                { id: "p4", urlImagen: 'https://placehold.co/220x150/9C27B0/FFFFFF?text=Concierto+Rock', titulo: 'Concierto de Rock', valoracion: '10/10', categoria: 'musica', resena: '¡Qué energía! Una noche épica con mi banda favorita.' }
            ]
        }
        // Añade más amigos aquí
    };

    let amigoSeleccionadoDatos = null; // Para guardar los datos del amigo actual
    let publicacionesMostradas = [];   // Para guardar las publicaciones actualmente visibles (filtradas o todas)


    // --- FUNCIÓN PARA RENDERIZAR LA CABECERA DEL PERFIL ---
    function renderizarCabecera(datosAmigo) {
        if (nombrePerfilEl) {
            nombrePerfilEl.textContent = datosAmigo.nombre;
        }
        if (avatarPerfilEl) {
            avatarPerfilEl.src = datosAmigo.avatarUrl || 'https://placehold.co/100x100/888/FFF?text=?';
            avatarPerfilEl.alt = `Avatar de ${datosAmigo.nombre}`;
        }
        if (tituloPublicacionesEl) {
            tituloPublicacionesEl.textContent = `Publicaciones de ${datosAmigo.nombre}`;
        }
    }

    // --- FUNCIÓN PARA CREAR TARJETA HTML DE PUBLICACIÓN (REUTILIZANDO ESTILO) ---
    // Esta función es MUY SIMILAR a la que tendrías para tu propia página de inicio,
    // pero NO incluye opciones de editar/eliminar.
    function crearTarjetaPublicacionHtml(publicacion) {
        const tarjeta = document.createElement('div');
        // Reutilizamos la clase de la tarjeta de la página de inicio
        tarjeta.className = 'tarjeta-publicacion-inicio'; 

        if (publicacion.urlImagen) {
            const img = document.createElement('img');
            img.src = publicacion.urlImagen;
            img.alt = publicacion.titulo;
            // Fallback simple
            img.onerror = function() { 
                this.src = 'https://placehold.co/220x150/ccc/999?text=Error'; 
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
        categoriaSpan.className = 'categoria'; // Reutiliza la clase .categoria
        categoriaSpan.textContent = publicacion.categoria;
        tarjeta.appendChild(categoriaSpan);

        return tarjeta;
    }

    // --- FUNCIÓN PARA MOSTRAR LAS PUBLICACIONES DEL AMIGO ---
    function mostrarPublicacionesAmigo(listaPublicaciones) {
        if (!rejillaPublicacionesContenedor) return;
        rejillaPublicacionesContenedor.innerHTML = ''; // Limpiar

        if (!listaPublicaciones || listaPublicaciones.length === 0) {
            rejillaPublicacionesContenedor.innerHTML = '<p>Este amigo no tiene publicaciones para esta categoría.</p>';
            return;
        }
        listaPublicaciones.forEach(pub => {
            const tarjeta = crearTarjetaPublicacionHtml(pub);
            rejillaPublicacionesContenedor.appendChild(tarjeta);
        });
    }

    // --- LÓGICA DE FILTROS ---
    if (botonesFiltroAmigo.length > 0) {
        botonesFiltroAmigo.forEach(boton => {
            boton.addEventListener('click', function() {
                botonesFiltroAmigo.forEach(btn => btn.classList.remove('activo'));
                this.classList.add('activo');
                const categoria = this.dataset.categoria;

                if (!amigoSeleccionadoDatos) return; // Salir si no hay datos del amigo

                if (categoria === 'todo') {
                    publicacionesMostradas = amigoSeleccionadoDatos.publicaciones || [];
                } else {
                    publicacionesMostradas = (amigoSeleccionadoDatos.publicaciones || []).filter(pub => pub.categoria === categoria);
                }
                mostrarPublicacionesAmigo(publicacionesMostradas);
            });
        });
    }

    // --- CARGAR DATOS DEL PERFIL DEL AMIGO ---
    function cargarPerfil() {
        // Simulación: obtener datos del amigo según el idAmigoActual
        amigoSeleccionadoDatos = datosAmigos[idAmigoActual];

        if (amigoSeleccionadoDatos) {
            renderizarCabecera(amigoSeleccionadoDatos);
            publicacionesMostradas = amigoSeleccionadoDatos.publicaciones || [];
            mostrarPublicacionesAmigo(publicacionesMostradas);
            // Marcar el filtro "Todo" como activo por defecto
            const filtroTodo = document.querySelector('#filtrosPublicacionesAmigo button[data-categoria="todo"]');
            if (filtroTodo) filtroTodo.classList.add('activo');
        } else {
            console.error(`No se encontraron datos para el amigo ID: ${idAmigoActual}`);
            if (document.querySelector('.area-contenido')) { // Si usas .area-contenido en vez de .contenido
                document.querySelector('.area-contenido').innerHTML = '<h2>Perfil no encontrado</h2><p>No se pudo cargar la información de este amigo.</p>';
            } else if (document.querySelector('.contenido')) {
                 document.querySelector('.contenido').innerHTML = '<h2>Perfil no encontrado</h2><p>No se pudo cargar la información de este amigo.</p>';
            }
        }
    }

    // Cargar el perfil al iniciar
    if (idAmigoActual && (cabeceraContenedor || rejillaPublicacionesContenedor)) {
        cargarPerfil();
    } else if (!idAmigoActual) {
         console.error("No se proporcionó ID de amigo en la URL (ej. ?idAmigo=xxx)");
         if (document.querySelector('.area-contenido')) {
            document.querySelector('.area-contenido').innerHTML = '<h2>Error</h2><p>Falta el ID del amigo para mostrar el perfil.</p>';
         } else if (document.querySelector('.contenido')) {
            document.querySelector('.contenido').innerHTML = '<h2>Error</h2><p>Falta el ID del amigo para mostrar el perfil.</p>';
         }
    }

});