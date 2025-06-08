// amigos.js
document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return window.location.href = 'login.html';

    const listaAmigosContenedor = document.getElementById('listaAmigos');
    const inputCodigoAmigo = document.getElementById('inputCodigoAmigo');
    const btnAnadirAmigo = document.getElementById('btnAnadirAmigo');
    const mensajeAnadirAmigoEl = document.getElementById('mensajeAnadirAmigo');

    let misAmigos = [];

    // --- crea tarjeta de cada amigo ---
    function crearTarjetaAmigo(amigo) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-amigo';
        tarjeta.dataset.idAmigo = amigo.id;

        const avatar = document.createElement('img');
        avatar.className = 'avatar-amigo';
        avatar.src = amigo.avatarUrl;
        avatar.alt = `Avatar de ${amigo.username}`;

        const info = document.createElement('div');
        info.className = 'info-amigo';
        info.innerHTML = `
          <span class="nombre-amigo">${amigo.username}</span>
          <span class="codigo-amigo">${amigo.friend_code}</span>
        `;

        const acciones = document.createElement('div');
        acciones.className = 'acciones-amigo';

        const btnVerPerfil = document.createElement('button');
        btnVerPerfil.className = 'boton-ver-perfil';
        btnVerPerfil.textContent = 'Ver Perfil';
        btnVerPerfil.addEventListener('click', () => {
            alert(`Ver perfil de ${amigo.username} (ID ${amigo.id}) — A IMPLEMENTAR`);
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'boton-eliminar-amigo texto-peligro';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            if (confirm(`¿Eliminar a ${amigo.username}?`)) {
                eliminarAmigo(amigo.id);
            }
        });

        acciones.append(btnVerPerfil, btnEliminar);
        tarjeta.append(avatar, info, acciones);
        return tarjeta;
    }

    // --- renderiza la lista ---
    function renderizarAmigos() {
        listaAmigosContenedor.innerHTML = '';
        if (misAmigos.length === 0) {
            listaAmigosContenedor.innerHTML = `<p style="color:#aaa">Aún no tienes amigos.</p>`;
            return;
        }
        misAmigos.forEach(a => {
            listaAmigosContenedor.appendChild(crearTarjetaAmigo(a));
        });
    }

    // --- carga todos los amigos desde el backend ---
    async function cargarAmigos() {
        try {
            const res = await fetch(`http://127.0.0.1:8000/amigos/${userId}`);
            if (!res.ok) throw new Error('Error al cargar tus amigos');
            const data = await res.json();
            // mapeamos la respuesta a nuestro formato
            misAmigos = data.map(a => ({
                id: a.idUsuario,
                username: a.nombreUsuario,
                friend_code: a.codigoUnico,
                avatarUrl: a.avatarUrl
            }));
            renderizarAmigos();
        } catch (err) {
            console.error(err);
            listaAmigosContenedor.innerHTML = `<p style="color:#f44">No se pudieron cargar los amigos.</p>`;
        }
    }

    // --- añade un amigo (y luego recarga la lista completa) ---
    async function anadirAmigoPorCodigo(codigo) {
        mensajeAnadirAmigoEl.textContent = '';
        mensajeAnadirAmigoEl.className = '';

        if (!codigo.trim()) {
            mensajeAnadirAmigoEl.textContent = 'Introduce un código.';
            mensajeAnadirAmigoEl.classList.add('error');
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/amigos/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friend_code: codigo.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Error al añadir amigo');
            }
            // si va bien, mostramos mensaje y recargamos desde el GET
            mensajeAnadirAmigoEl.textContent = '¡Amigo añadido correctamente!';
            mensajeAnadirAmigoEl.classList.add('exito');
            inputCodigoAmigo.value = '';
            await cargarAmigos();
        } catch (err) {
            console.error(err);
            mensajeAnadirAmigoEl.textContent = err.message;
            mensajeAnadirAmigoEl.classList.add('error');
        }
    }

    // --- elimina un amigo ---
    async function eliminarAmigo(friendId) {
        try {
            const userId = localStorage.getItem('user_id');
            const res = await fetch(
                `http://127.0.0.1:8000/amigos/${userId}/${friendId}`,
                { method: 'DELETE' }
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Error al eliminar amigo');
            }
            // recargo la lista
            await cargarAmigos();
        } catch (err) {
            console.error(err);
            alert(`No se pudo eliminar: ${err.message}`);
        }
    }

    // --- listeners de UI ---
    btnAnadirAmigo.addEventListener('click', () => anadirAmigoPorCodigo(inputCodigoAmigo.value));
    inputCodigoAmigo.addEventListener('keypress', e => {
        if (e.key === 'Enter') anadirAmigoPorCodigo(inputCodigoAmigo.value);
    });

    // --- al inicio cargamos la lista ---
    cargarAmigos();
});
