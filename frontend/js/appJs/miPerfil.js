// miPerfil.js
// Conexión real con el endpoint GET /perfil/{user_id} y placeholder si no hay imagen

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const cabeceraMiPerfilContenedor = document.getElementById('cabeceraMiPerfil');
    const miAvatarImgEl = document.getElementById('miAvatarActual');
    const miNombrePerfilEl = document.getElementById('miNombreDePerfil');
    const textoMiBioEl = document.getElementById('textoMiBioActual');
    const inputMiBioEl = document.getElementById('inputMiBio');
    const btnEditarBioEl = document.getElementById('botonEditarMiBio');
    const botonesAccionMiBioEl = document.getElementById('botonesAccionMiBio');
    const btnGuardarBioEl = document.getElementById('botonGuardarMiBio');
    const btnCancelarBioEl = document.getElementById('botonCancelarMiBio');

    const tituloMisPublicacionesEl = document.getElementById('tituloMisPublicaciones');
    const rejillaMisPublicacionesContenedor = document.getElementById('rejillaMisPublicaciones');
    const botonesFiltroMisPublicaciones = document.querySelectorAll('#filtrosMisPublicaciones button');

    let datosUsuarioActual = null;
    let misPublicacionesFiltradas = [];

    function cargarDatosCabecera(datos) {
        miAvatarImgEl.src = datos.avatarUrl || 'https://placehold.co/100x100/888/FFF?text=?';
        miNombrePerfilEl.textContent = datos.nombreUsuario || 'Nombre de Usuario';
        textoMiBioEl.textContent = datos.bio || 'Añade una biografía...';
        inputMiBioEl.value = datos.bio || '';
        tituloMisPublicacionesEl.textContent = `Mis Publicaciones (${(datos.publicaciones || []).length})`;
    }

    function crearTarjetaPublicacionHtml(publicacion) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-publicacion-inicio';

        const img = document.createElement('img');
        const texto = encodeURIComponent(publicacion.titulo || 'No+Image');
        img.src = publicacion.urlImagen || `https://placehold.co/220x150/777/fff?text=${texto}`;
        img.alt = publicacion.titulo;
        img.onerror = () => {
            img.src = `https://placehold.co/220x150/ccc/999?text=${texto}`;
            img.alt = 'Imagen no disponible';
        };
        tarjeta.appendChild(img);

        const tituloH3 = document.createElement('h3');
        tituloH3.textContent = publicacion.titulo;
        tarjeta.appendChild(tituloH3);

        const valoracionP = document.createElement('p');
        valoracionP.textContent = `Valoración: ${publicacion.valoracion}`;
        tarjeta.appendChild(valoracionP);

        if (publicacion.resena) {
            const resenaP = document.createElement('p');
            resenaP.className = 'descripcion-publicacion';
            resenaP.textContent = publicacion.resena;
            tarjeta.appendChild(resenaP);
        }

        const categoriaSpan = document.createElement('span');
        categoriaSpan.className = 'categoria';
        categoriaSpan.textContent = publicacion.categoria;
        tarjeta.appendChild(categoriaSpan);

        return tarjeta;
    }

    function mostrarMisPublicaciones(lista) {
        rejillaMisPublicacionesContenedor.innerHTML = '';
        if (!lista.length) {
            rejillaMisPublicacionesContenedor.innerHTML = '<p style="color:#ccc; text-align:center; width:100%">Aún no tienes publicaciones en esta categoría.</p>';
            return;
        }
        lista.forEach(pub => {
            rejillaMisPublicacionesContenedor.appendChild(crearTarjetaPublicacionHtml(pub));
        });
    }

    if (botonesFiltroMisPublicaciones.length) {
        botonesFiltroMisPublicaciones.forEach(boton => {
            boton.addEventListener('click', () => {
                botonesFiltroMisPublicaciones.forEach(b => b.classList.remove('activo'));
                boton.classList.add('activo');
                const cat = boton.dataset.categoria;
                misPublicacionesFiltradas =
                    cat === 'todo'
                        ? datosUsuarioActual.publicaciones
                        : datosUsuarioActual.publicaciones.filter(p => p.categoria === cat);
                mostrarMisPublicaciones(misPublicacionesFiltradas);
            });
        });
    }

    async function cargarMiPerfil() {
        const userId = localStorage.getItem('user_id');
        if (!userId) return window.location.href = 'login.html';

        try {
            const res = await fetch(`http://127.0.0.1:8000/perfil/${userId}`);
            if (!res.ok) throw new Error('Error al cargar perfil');
            datosUsuarioActual = await res.json();
            cargarDatosCabecera(datosUsuarioActual);
            misPublicacionesFiltradas = datosUsuarioActual.publicaciones;
            mostrarMisPublicaciones(misPublicacionesFiltradas);
            const filtroTodo = document.querySelector('#filtrosMisPublicaciones button[data-categoria="todo"]');
            if (filtroTodo) {
                botonesFiltroMisPublicaciones.forEach(b => b.classList.remove('activo'));
                filtroTodo.classList.add('activo');
            }
        } catch (err) {
            console.error(err);
            cabeceraMiPerfilContenedor.innerHTML = '<p style="text-align:center; width:100%">Error al cargar perfil.</p>';
        }
    }

    if (cabeceraMiPerfilContenedor) cargarMiPerfil();

    // --- Lógica: actualizar biografía en el backend ---
    if (btnEditarBioEl && btnGuardarBioEl && btnCancelarBioEl) {
        btnEditarBioEl.addEventListener('click', () => {
            textoMiBioEl.style.display = 'none';
            inputMiBioEl.style.display = 'block';
            inputMiBioEl.value = datosUsuarioActual.bio || '';
            btnEditarBioEl.style.display = 'none';
            botonesAccionMiBioEl.style.display = 'flex';
        });

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
                console.error('Error actualizando bio:', error);
                alert(`Error: ${error.message}`);
            }
            textoMiBioEl.style.display = 'block';
            inputMiBioEl.style.display = 'none';
            btnEditarBioEl.style.display = 'inline-block';
            botonesAccionMiBioEl.style.display = 'none';
        });

        btnCancelarBioEl.addEventListener('click', () => {
            textoMiBioEl.style.display = 'block';
            inputMiBioEl.style.display = 'none';
            btnEditarBioEl.style.display = 'inline-block';
            botonesAccionMiBioEl.style.display = 'none';
            inputMiBioEl.value = datosUsuarioActual.bio || '';
        });
    }
});
