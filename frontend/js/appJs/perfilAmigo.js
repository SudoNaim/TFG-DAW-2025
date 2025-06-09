// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
    // Obtiene el ID del usuario desde el localStorage
    const userId = localStorage.getItem('user_id');
    // Si no hay usuario logueado, redirige al login
    if (!userId) return window.location.href = 'login.html';

    // Obtiene el ID del amigo desde la URL (parámetro 'id')
    const params = new URLSearchParams(window.location.search);
    const amigoId = params.get('id');
    // Si no hay ID de amigo, muestra un mensaje de error
    if (!amigoId) {
        document.body.innerHTML = '<p style="color:red;">ID de amigo faltante</p>';
        return;
    }

    // Obtiene referencias a los elementos del DOM donde se mostrará la info del amigo
    const avatarEl = document.getElementById('amigoAvatar');
    const nombreEl = document.getElementById('amigoNombre');
    const bioEl = document.getElementById('amigoBio');
    const filtros = document.querySelectorAll('#filtrosPublicacionesAmigo button');
    const rejilla = document.getElementById('rejillaPublicacionesAmigo');

    // Aquí se guardarán las publicaciones del amigo
    let publicaciones = [];

    try {
        // Hace una petición al backend para obtener los datos del perfil del amigo
        const res = await fetch(`http://127.0.0.1:8000/perfil/${amigoId}`);
        // Si la respuesta no es correcta, lanza un error
        if (!res.ok) throw new Error('No se pudo cargar perfil');
        // Convierte la respuesta a JSON
        const data = await res.json();

        // Muestra los datos del amigo en el perfil
        avatarEl.src = 'https://placehold.co/100x100/888/FFF?text='+data.nombreUsuario  +'';
        nombreEl.textContent = data.nombreUsuario;
        bioEl.textContent = data.bio || 'Sin biografía';

        // Guarda las publicaciones en un array, solo con los campos que necesitamos
        publicaciones = data.publicaciones.map(p => ({
            id: p.id,
            urlImagen: p.urlImagen,
            titulo: p.titulo,
            valoracion: p.valoracion,
            categoria: p.categoria,
            resena: p.resena
        }));
    } catch (err) {
        // Si hay algún error, lo muestra en consola y en la página
        console.error(err);
        nombreEl.textContent = 'Error al cargar perfil';
        return;
    }

    // Función para crear la tarjeta de cada publicación
    function crearTarjeta(p) {
        const div = document.createElement('div');
        div.className = 'tarjeta-publicacion-inicio';

        // Crea la imagen de la publicación (o una de relleno si no hay)
        const img = document.createElement('img');
        const txt = encodeURIComponent(p.titulo || 'No+Image');
        img.src = p.urlImagen || `https://placehold.co/220x150/777/fff?text=${txt}`;
        img.alt = p.titulo;
        // Si la imagen falla, pone otra imagen de error
        img.onerror = () => {
            img.src = `https://placehold.co/220x150/ccc/999?text=${txt}`;
            img.alt = 'Imagen no disponible';
        };
        div.appendChild(img);

        // Crea el contenido de la tarjeta (título, valoración, reseña y categoría)
        const inner = document.createElement('div');
        inner.innerHTML = `
      <h3>${p.titulo}</h3>
      <p>Valoración: ${p.valoracion}</p>
      ${p.resena ? `<p class="descripcion-publicacion">${p.resena}</p>` : ''}
      <span class="categoria">${p.categoria}</span>
    `;
        div.appendChild(inner);

        return div;
    }

    // Función para mostrar una lista de publicaciones en la rejilla
    function mostrar(lista) {
        rejilla.innerHTML = '';
        // Si no hay publicaciones, muestra un mensaje
        if (lista.length === 0) {
            rejilla.innerHTML = '<p style="color:#ccc; text-align:center;">No hay publicaciones</p>';
            return;
        }
        // Si hay publicaciones, las añade a la rejilla
        lista.forEach(pub => rejilla.appendChild(crearTarjeta(pub)));
    }

    // Añade eventos a los botones de filtro para filtrar por categoría
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quita la clase 'activo' de todos los botones
            filtros.forEach(b => b.classList.remove('activo'));
            // Añade la clase 'activo' al botón pulsado
            btn.classList.add('activo');
            // Filtra las publicaciones según la categoría seleccionada
            const cat = btn.dataset.categoria;
            mostrar(cat === 'todo' ? publicaciones : publicaciones.filter(p => p.categoria === cat));
        });
    });

    // Muestra todas las publicaciones al cargar la página
    mostrar(publicaciones);
    // Marca el primer filtro como activo por defecto
    filtros[0].classList.add('activo');

    // Asegura que el body se muestre (por si estaba oculto)
    document.body.style.display = '';
});
