// Asegúrate de que este código se ejecute después de que el DOM esté cargado.
document.addEventListener('DOMContentLoaded', function() {

    const listaAmigosContenedor = document.getElementById('listaAmigos');
    const inputCodigoAmigo = document.getElementById('inputCodigoAmigo');
    const btnAnadirAmigo = document.getElementById('btnAnadirAmigo');
    const mensajeAnadirAmigoEl = document.getElementById('mensajeAnadirAmigo');

    // --- DATOS DE EJEMPLO (simulando lo que vendría de tu API) ---
    let misAmigos = [
        {
            idUsuario: "usr_001",
            nombreUsuario: "Manolín García",
            codigoUnico: "#MGL321",
            urlAvatar: "https://placehold.co/50x50/FF9800/FFF?text=MG"
        },
        {
            idUsuario: "usr_002",
            nombreUsuario: "Pepita Flores",
            codigoUnico: "#PFL678",
            urlAvatar: "https://placehold.co/50x50/4CAF50/FFF?text=PF"
        },
        {
            idUsuario: "usr_003",
            nombreUsuario: "Carlos Ruiz",
            codigoUnico: "#CRZ901",
            urlAvatar: "https://placehold.co/50x50/2196F3/FFF?text=CR"
        }
    ];

    // --- FUNCIÓN PARA CREAR LA TARJETA HTML DE UN AMIGO ---
    function crearTarjetaAmigo(amigo) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-amigo';
        tarjeta.dataset.idAmigo = amigo.idUsuario; // Guardar el ID del amigo en el elemento

        const avatar = document.createElement('img');
        avatar.className = 'avatar-amigo';
        avatar.src = amigo.urlAvatar || 'https://placehold.co/50x50/888/FFF?text=?'; // Imagen por defecto
        avatar.alt = `Avatar de ${amigo.nombreUsuario}`;

        const info = document.createElement('div');
        info.className = 'info-amigo';

        const nombre = document.createElement('span');
        nombre.className = 'nombre-amigo';
        nombre.textContent = amigo.nombreUsuario;

        const codigo = document.createElement('span');
        codigo.className = 'codigo-amigo';
        codigo.textContent = amigo.codigoUnico;

        info.appendChild(nombre);
        info.appendChild(codigo);

        const acciones = document.createElement('div');
        acciones.className = 'acciones-amigo';

        const btnVerPerfil = document.createElement('button');
        btnVerPerfil.className = 'boton-ver-perfil';
        btnVerPerfil.textContent = 'Ver Perfil';
        btnVerPerfil.dataset.idAmigo = amigo.idUsuario;
        btnVerPerfil.addEventListener('click', function() {
            alert(`Ir al perfil de: ${amigo.nombreUsuario} (ID: ${this.dataset.idAmigo}) - A IMPLEMENTAR`);
            // window.location.href = `perfil_amigo.html?id=${amigo.idUsuario}`; // Ejemplo de redirección
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'boton-eliminar-amigo texto-peligro';
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.dataset.idAmigo = amigo.idUsuario;
        btnEliminar.addEventListener('click', function() {
            if (confirm(`¿Estás seguro de que quieres eliminar a ${amigo.nombreUsuario} de tus amigos?`)) {
                eliminarAmigo(this.dataset.idAmigo);
            }
        });

        acciones.appendChild(btnVerPerfil);
        acciones.appendChild(btnEliminar);

        tarjeta.appendChild(avatar);
        tarjeta.appendChild(info);
        tarjeta.appendChild(acciones);

        return tarjeta;
    }

    // --- FUNCIÓN PARA RENDERIZAR (MOSTRAR) LA LISTA DE AMIGOS ---
    function renderizarAmigos() {
        if (!listaAmigosContenedor) return; // Salir si el contenedor no existe

        listaAmigosContenedor.innerHTML = ''; // Limpiar lista actual
        if (misAmigos.length === 0) {
            listaAmigosContenedor.innerHTML = '<p style="color: #aaa;">Aún no tienes amigos. ¡Añade algunos!</p>';
            return;
        }
        misAmigos.forEach(amigo => {
            const tarjetaAmigo = crearTarjetaAmigo(amigo);
            listaAmigosContenedor.appendChild(tarjetaAmigo);
        });
    }

    // --- FUNCIÓN (SIMULADA) PARA AÑADIR UN AMIGO ---
    function anadirAmigoPorCodigo(codigo) {
        if (!inputCodigoAmigo || !mensajeAnadirAmigoEl) return;

        mensajeAnadirAmigoEl.textContent = ''; // Limpiar mensaje previo
        mensajeAnadirAmigoEl.className = 'mensaje-feedback'; // Resetear clases de color

        if (!codigo || codigo.trim() === '') {
            mensajeAnadirAmigoEl.textContent = 'Por favor, introduce un código de amigo.';
            mensajeAnadirAmigoEl.classList.add('error');
            return;
        }

        // Lógica de simulación:
        // En una aplicación real, aquí harías una petición POST a tu API con el código.
        // La API verificaría si el código existe, si ya es tu amigo, etc.
        console.log(`Simulando añadir amigo con código: ${codigo}`);

        // Ejemplo de cómo podría funcionar (muy simplificado):
        // Supongamos que el backend responde con los datos del amigo si se añade correctamente.
        const amigoEncontradoSimulado = { // Esto vendría de la API
            idUsuario: `usr_${Math.random().toString(36).substr(2, 5)}`,
            nombreUsuario: `Amigo ${codigo.replace("#","")}`,
            codigoUnico: codigo,
            urlAvatar: `https://placehold.co/50x50/DDD/333?text=${codigo.charAt(1)}`
        };
        
        // Comprobar si ya es amigo (por ID o código único)
        const yaEsAmigo = misAmigos.some(amigo => amigo.codigoUnico === codigo || amigo.idUsuario === amigoEncontradoSimulado.idUsuario);

        if (yaEsAmigo) {
            mensajeAnadirAmigoEl.textContent = `${amigoEncontradoSimulado.nombreUsuario} ya está en tu lista de amigos.`;
            mensajeAnadirAmigoEl.classList.add('error');
            inputCodigoAmigo.value = ''; // Limpiar input
            return;
        }
        
        // Simular respuesta exitosa de la API
        setTimeout(() => {
            // Aquí añadirías el amigo a tu lista local `misAmigos` y re-renderizarías
            // Por ahora, solo un mensaje
            misAmigos.push(amigoEncontradoSimulado); // Añadimos a la lista local (simulación)
            renderizarAmigos(); // Volver a dibujar la lista de amigos
            
            mensajeAnadirAmigoEl.textContent = `¡${amigoEncontradoSimulado.nombreUsuario} añadido a tus amigos!`;
            mensajeAnadirAmigoEl.classList.add('exito');
            inputCodigoAmigo.value = ''; // Limpiar input
        }, 1000); // Simular un pequeño retraso de red
    }

    // --- FUNCIÓN (SIMULADA) PARA ELIMINAR UN AMIGO ---
    function eliminarAmigo(idAmigoAEliminar) {
        console.log(`Simulando eliminar amigo con ID: ${idAmigoAEliminar}`);
        // En una aplicación real, aquí harías una petición DELETE a tu API.
        // Si la API responde con éxito, entonces actualizas la lista local.

        // Actualizar la lista local de amigos (simulación)
        misAmigos = misAmigos.filter(amigo => amigo.idUsuario !== idAmigoAEliminar);
        renderizarAmigos(); // Volver a dibujar la lista de amigos
        alert('Amigo eliminado (simulado).');
    }

    // --- EVENT LISTENERS ---
    if (btnAnadirAmigo && inputCodigoAmigo) {
        btnAnadirAmigo.addEventListener('click', function() {
            anadirAmigoPorCodigo(inputCodigoAmigo.value);
        });

        // Opcional: Añadir amigo también al presionar Enter en el input
        inputCodigoAmigo.addEventListener('keypress', function(evento) {
            if (evento.key === 'Enter') {
                anadirAmigoPorCodigo(inputCodigoAmigo.value);
            }
        });
    }

    // --- INICIALIZACIÓN ---
    renderizarAmigos(); // Mostrar los amigos al cargar la página

});