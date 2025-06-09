// Espera a que todo el DOM esté cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Selecciono los elementos del DOM que voy a usar en la cabecera del perfil
    const cabeceraMiPerfilContenedor = document.getElementById('cabeceraMiPerfil');
    const miAvatarImgEl = document.getElementById('miAvatarActual');
    const miNombrePerfilEl = document.getElementById('miNombreDePerfil');
    const miFriendCodeEl = document.getElementById('miFriendCode');
    const textoMiBioEl = document.getElementById('textoMiBioActual');
    const inputMiBioEl = document.getElementById('inputMiBio');
    const btnEditarBioEl = document.getElementById('botonEditarMiBio');
    const botonesAccionMiBioEl = document.getElementById('botonesAccionMiBio');
    const btnGuardarBioEl = document.getElementById('botonGuardarMiBio');
    const btnCancelarBioEl = document.getElementById('botonCancelarMiBio');

    // Elementos para las publicaciones del usuario
    const tituloMisPublicacionesEl = document.getElementById('tituloMisPublicaciones');
    const rejillaMisPublicacionesContenedor = document.getElementById('rejillaMisPublicaciones');
    const botonesFiltroMisPublicaciones = document.querySelectorAll('#filtrosMisPublicaciones button');

    // Variables para guardar los datos del usuario y sus publicaciones filtradas
    let datosUsuarioActual = null;
    let misPublicacionesFiltradas = [];

    // Función para cargar los datos del usuario en la cabecera del perfil
    function cargarDatosCabecera(datos) {
        miAvatarImgEl.src = datos.avatarUrl || 'https://placehold.co/100x100/888/FFF?text=?'; // Si no hay avatar, pongo uno por defecto
        miNombrePerfilEl.textContent = datos.nombreUsuario || 'Nombre de Usuario';
        miFriendCodeEl.textContent = `Código amigo: ${datos.friend_code || '—'}`;
        textoMiBioEl.textContent = datos.bio || 'Añade una biografía...';
        inputMiBioEl.value = datos.bio || '';
        tituloMisPublicacionesEl.textContent = 'Mis Publicaciones';
    }

    // Función para crear el HTML de una tarjeta de publicación
    function crearTarjetaPublicacionHtml(publicacion) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-publicacion-inicio';

        // Imagen de la publicación (si no hay, pongo una imagen por defecto)
        const img = document.createElement('img');
        const texto = encodeURIComponent(publicacion.titulo || 'No+Image');
        img.src = publicacion.urlImagen || `https://placehold.co/220x150/777/fff?text=${texto}`;
        img.alt = publicacion.titulo;
        img.onerror = () => {
            img.src = `https://placehold.co/220x150/ccc/999?text=${texto}`;
            img.alt = 'Imagen no disponible';
        };
        tarjeta.appendChild(img);

        // Título de la publicación
        const tituloH3 = document.createElement('h3');
        tituloH3.textContent = publicacion.titulo;
        tarjeta.appendChild(tituloH3);

        // Valoración de la publicación
        const valoracionP = document.createElement('p');
        valoracionP.textContent = `Valoración: ${publicacion.valoracion}`;
        tarjeta.appendChild(valoracionP);

        // Si hay reseña, la muestro
        if (publicacion.resena) {
            const resenaP = document.createElement('p');
            resenaP.className = 'descripcion-publicacion';
            resenaP.textContent = publicacion.resena;
            tarjeta.appendChild(resenaP);
        }

        // Muestro la categoría de la publicación
        const categoriaSpan = document.createElement('span');
        categoriaSpan.className = 'categoria';
        categoriaSpan.textContent = publicacion.categoria;
        tarjeta.appendChild(categoriaSpan);

        return tarjeta;
    }

    // Función para mostrar las publicaciones del usuario en la rejilla
    function mostrarMisPublicaciones(lista) {
        rejillaMisPublicacionesContenedor.innerHTML = '';
        if (!lista.length) {
            // Si no hay publicaciones, muestro un mensaje
            rejillaMisPublicacionesContenedor.innerHTML =
                '<p style="color:#ccc; text-align:center; width:100%">Aún no tienes publicaciones en esta categoría.</p>';
            return;
        }
        // Por cada publicación, creo su tarjeta y la añado al contenedor
        lista.forEach(pub => {
            rejillaMisPublicacionesContenedor.appendChild(crearTarjetaPublicacionHtml(pub));
        });
    }

    // Si hay botones de filtro, les añado el evento para filtrar las publicaciones
    if (botonesFiltroMisPublicaciones.length) {
        botonesFiltroMisPublicaciones.forEach(boton => {
            boton.addEventListener('click', () => {
                // Quito la clase 'activo' de todos los botones y la pongo solo en el que se ha pulsado
                botonesFiltroMisPublicaciones.forEach(b => b.classList.remove('activo'));
                boton.classList.add('activo');
                const cat = boton.dataset.categoria;
                // Si el filtro es 'todo', muestro todas las publicaciones, si no, solo las de esa categoría
                misPublicacionesFiltradas =
                    cat === 'todo'
                        ? datosUsuarioActual.publicaciones
                        : datosUsuarioActual.publicaciones.filter(p => p.categoria === cat);
                mostrarMisPublicaciones(misPublicacionesFiltradas);
            });
        });
    }

    // Función para cargar los datos del perfil del usuario desde el backend
    async function cargarMiPerfil() {
        const userId = localStorage.getItem('user_id'); // Cojo el id del usuario del localStorage
        if (!userId) return window.location.href = 'login.html'; // Si no hay usuario, lo mando al login

        try {
            // Hago la petición al backend para obtener los datos del perfil
            const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}`);
            if (!res.ok) throw new Error('Error al cargar perfil');
            datosUsuarioActual = await res.json();
            cargarDatosCabecera(datosUsuarioActual); // Cargo los datos en la cabecera
            misPublicacionesFiltradas = datosUsuarioActual.publicaciones;
            mostrarMisPublicaciones(misPublicacionesFiltradas); // Muestro las publicaciones
            // Pongo el filtro 'todo' como activo por defecto
            const filtroTodo = document.querySelector('#filtrosMisPublicaciones button[data-categoria="todo"]');
            if (filtroTodo) {
                botonesFiltroMisPublicaciones.forEach(b => b.classList.remove('activo'));
                filtroTodo.classList.add('activo');
            }
        } catch (err) {
            // Si hay error, lo muestro por consola y en la cabecera
            console.error(err);
            cabeceraMiPerfilContenedor.innerHTML =
                '<p style="text-align:center; width:100%">Error al cargar perfil.</p>';
        }
    }

    // Si existe el contenedor de la cabecera, cargo el perfil
    if (cabeceraMiPerfilContenedor) cargarMiPerfil();

    // Lógica para editar la biografía del usuario
    if (btnEditarBioEl && btnGuardarBioEl && btnCancelarBioEl) {
        // Cuando pulso el botón de editar, muestro el input y los botones de guardar/cancelar
        btnEditarBioEl.addEventListener('click', () => {
            textoMiBioEl.style.display = 'none';
            inputMiBioEl.style.display = 'block';
            inputMiBioEl.value = datosUsuarioActual.bio || '';
            btnEditarBioEl.style.display = 'none';
            botonesAccionMiBioEl.style.display = 'flex';
        });

        // Cuando pulso guardar, hago la petición para actualizar la bio
        btnGuardarBioEl.addEventListener('click', async () => {
            const nuevaBio = inputMiBioEl.value.trim();
            try {
                const userId = localStorage.getItem('user_id');
                const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}/bio`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bio: nuevaBio })
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.detail || 'Error al actualizar bio');
                }
                const actualizado = await res.json();
                datosUsuarioActual.bio = actualizado.bio;
                textoMiBioEl.textContent = actualizado.bio || 'Añade una biografía...';
                alert('Biografía actualizada correctamente.');
            } catch (error) {
                // Si hay error, lo muestro por consola y con un alert
                console.error('Error actualizando bio:', error);
                alert(`Error: ${error.message}`);
            }
            // Vuelvo a mostrar el texto y oculto el input y los botones
            textoMiBioEl.style.display = 'block';
            inputMiBioEl.style.display = 'none';
            btnEditarBioEl.style.display = 'inline-block';
            botonesAccionMiBioEl.style.display = 'none';
        });

        // Si cancelo, vuelvo a mostrar el texto y oculto el input y los botones
        btnCancelarBioEl.addEventListener('click', () => {
            textoMiBioEl.style.display = 'block';
            inputMiBioEl.style.display = 'none';
            btnEditarBioEl.style.display = 'inline-block';
            botonesAccionMiBioEl.style.display = 'none';
            inputMiBioEl.value = datosUsuarioActual.bio || '';
        });
    }
});
