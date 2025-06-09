// amigos.js

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', () => {
    // Obtengo el ID del usuario desde el localStorage
    const userId = localStorage.getItem('user_id');
    // Si no hay usuario logueado, redirijo a la página de login
    if (!userId) return window.location.href = 'login.html';

    // Referencias a los elementos del DOM que voy a usar
    const listaAmigosContenedor = document.getElementById('listaAmigos');
    const inputCodigoAmigo = document.getElementById('inputCodigoAmigo');
    const btnAnadirAmigo = document.getElementById('btnAnadirAmigo');
    const mensajeAnadirAmigoEl = document.getElementById('mensajeAnadirAmigo');

    // Aquí guardo la lista de mis amigos
    let misAmigos = [];

    // Función para crear la tarjeta de cada amigo
    function crearTarjetaAmigo(amigo) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-amigo';
        tarjeta.dataset.idAmigo = amigo.id;

        // Imagen del avatar del amigo
        const avatar = document.createElement('img');
        avatar.className = 'avatar-amigo';
        avatar.src = amigo.avatarUrl;
        avatar.alt = `Avatar de ${amigo.username}`;

        // Info del amigo (nombre y código)
        const info = document.createElement('div');
        info.className = 'info-amigo';
        info.innerHTML = `
          <span class="nombre-amigo">${amigo.username}</span>
          <span class="codigo-amigo">${amigo.friend_code}</span>
        `;

        // Acciones disponibles para cada amigo (ver perfil y eliminar)
        const acciones = document.createElement('div');
        acciones.className = 'acciones-amigo';

        // Botón para ver el perfil del amigo
        const btnVerPerfil = document.createElement('button');
        btnVerPerfil.className = 'boton-ver-perfil';
        btnVerPerfil.textContent = 'Ver Perfil';
        btnVerPerfil.addEventListener('click', () => {
            // Redirige a la página del perfil del amigo
            window.location.href = `perfilAmigo.html?id=${encodeURIComponent(amigo.id)}`;
        });

        // Botón para eliminar al amigo
        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'boton-eliminar-amigo texto-peligro';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            // Pregunta si de verdad quieres eliminar al amigo
            if (confirm(`¿Eliminar a ${amigo.username}?`)) {
                eliminarAmigo(amigo.id);
            }
        });

        // Añado los botones a la tarjeta
        acciones.append(btnVerPerfil, btnEliminar);
        tarjeta.append(avatar, info, acciones);
        return tarjeta;
    }

    // Función para mostrar la lista de amigos en pantalla
    function renderizarAmigos() {
        listaAmigosContenedor.innerHTML = '';
        // Si no tengo amigos, muestro un mensaje
        if (misAmigos.length === 0) {
            listaAmigosContenedor.innerHTML = `<p style="color:#aaa">Aún no tienes amigos.</p>`;
            return;
        }
        // Si tengo amigos, los muestro uno por uno
        misAmigos.forEach(a => {
            listaAmigosContenedor.appendChild(crearTarjetaAmigo(a));
        });
    }

    // Función para cargar los amigos desde el backend
    async function cargarAmigos() {
        try {
            // Hago la petición al backend para obtener mis amigos
            const res = await fetch(`http://127.0.0.1:8000/amigos/${userId}`);
            if (!res.ok) throw new Error('Error al cargar tus amigos');
            const data = await res.json();
            // Transformo los datos que me llegan a mi formato
            misAmigos = data.map(a => ({
                id: a.idUsuario,
                username: a.nombreUsuario,
                friend_code: a.codigoUnico,
                avatarUrl: a.avatarUrl
            }));
            // Muestro los amigos en pantalla
            renderizarAmigos();
        } catch (err) {
            // Si hay error, lo muestro en consola y en la web
            console.error(err);
            listaAmigosContenedor.innerHTML = `<p style="color:#f44">No se pudieron cargar los amigos.</p>`;
        }
    }

    // Función para añadir un amigo usando su código
    async function anadirAmigoPorCodigo(codigo) {
        // Limpio el mensaje anterior
        mensajeAnadirAmigoEl.textContent = '';
        mensajeAnadirAmigoEl.className = '';

        // Si no se ha escrito nada, muestro error
        if (!codigo.trim()) {
            mensajeAnadirAmigoEl.textContent = 'Introduce un código.';
            mensajeAnadirAmigoEl.classList.add('error');
            return;
        }

        try {
            // Hago la petición para añadir al amigo
            const res = await fetch(`http://127.0.0.1:8000/amigos/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friend_code: codigo.trim() })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Error al añadir amigo');
            }

            // Si todo va bien, muestro mensaje de éxito y recargo la lista
            mensajeAnadirAmigoEl.textContent = '¡Amigo añadido correctamente!';
            mensajeAnadirAmigoEl.classList.add('exito');
            inputCodigoAmigo.value = '';
            await cargarAmigos();
        } catch (err) {
            // Si hay error, lo muestro
            console.error(err);
            mensajeAnadirAmigoEl.textContent = err.message;
            mensajeAnadirAmigoEl.classList.add('error');
        }
    }

    // Función para eliminar un amigo
    async function eliminarAmigo(friendId) {
        try {
            // Vuelvo a obtener el userId por si acaso
            const userId = localStorage.getItem('user_id');
            // Hago la petición para eliminar al amigo
            const res = await fetch(
                `http://127.0.0.1:8000/amigos/${userId}/${friendId}`,
                { method: 'DELETE' }
            );
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.detail || 'Error al eliminar amigo');
            }
            // Si todo va bien, recargo la lista de amigos
            await cargarAmigos();
        } catch (err) {
            // Si hay error, lo muestro en un alert
            console.error(err);
            alert(`No se pudo eliminar: ${err.message}`);
        }
    }

    // Evento para el botón de añadir amigo
    btnAnadirAmigo.addEventListener('click', () => anadirAmigoPorCodigo(inputCodigoAmigo.value));
    // Evento para añadir amigo pulsando Enter en el input
    inputCodigoAmigo.addEventListener('keypress', e => {
        if (e.key === 'Enter') anadirAmigoPorCodigo(inputCodigoAmigo.value);
    });

    // Cargo la lista de amigos al cargar la página
    cargarAmigos();
});
