// perfilAmigo.js
document.addEventListener('DOMContentLoaded', async () => {
    // 0) Solo si está logueado
    const userId = localStorage.getItem('user_id');
    if (!userId) return window.location.href = 'login.html';

    // 1) Leer ?id=XX de la URL
    const params = new URLSearchParams(window.location.search);
    const amigoId = params.get('id');
    if (!amigoId) {
        document.body.innerHTML = '<p style="color:red;">ID de amigo faltante</p>';
        return;
    }

    // 2) Referencias al DOM
    const avatarEl = document.getElementById('amigoAvatar');
    const nombreEl = document.getElementById('amigoNombre');
    const bioEl = document.getElementById('amigoBio');
    const filtros = document.querySelectorAll('#filtrosPublicacionesAmigo button');
    const rejilla = document.getElementById('rejillaPublicacionesAmigo');

    let publicaciones = [];

    // 3) Cargar perfil del amigo
    try {
        const res = await fetch(`http://127.0.0.1:8000/perfil/${amigoId}`);
        if (!res.ok) throw new Error('No se pudo cargar perfil');
        const data = await res.json();

        avatarEl.src = data.avatarUrl;
        nombreEl.textContent = data.nombreUsuario;
        bioEl.textContent = data.bio || 'Sin biografía';

        publicaciones = data.publicaciones.map(p => ({
            id: p.id,
            urlImagen: p.urlImagen,
            titulo: p.titulo,
            valoracion: p.valoracion,
            categoria: p.categoria,
            resena: p.resena
        }));
    } catch (err) {
        console.error(err);
        nombreEl.textContent = 'Error al cargar perfil';
        return;
    }

    // 4) Render de cada tarjeta
    function crearTarjeta(p) {
        const div = document.createElement('div');
        div.className = 'tarjeta-publicacion-inicio';

        // img (siempre): placeholder si no hay url
        const img = document.createElement('img');
        const txt = encodeURIComponent(p.titulo || 'No+Image');
        img.src = p.urlImagen || `https://placehold.co/220x150/777/fff?text=${txt}`;
        img.alt = p.titulo;
        img.onerror = () => {
            img.src = `https://placehold.co/220x150/ccc/999?text=${txt}`;
            img.alt = 'Imagen no disponible';
        };
        div.appendChild(img);

        // resto contenido
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

    function mostrar(lista) {
        rejilla.innerHTML = '';
        if (lista.length === 0) {
            rejilla.innerHTML = '<p style="color:#ccc; text-align:center;">No hay publicaciones</p>';
            return;
        }
        lista.forEach(pub => rejilla.appendChild(crearTarjeta(pub)));
    }

    // 5) Filtros
    filtros.forEach(btn => {
        btn.addEventListener('click', () => {
            filtros.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            const cat = btn.dataset.categoria;
            mostrar(cat === 'todo' ? publicaciones : publicaciones.filter(p => p.categoria === cat));
        });
    });

    // 6) Mostrar todo al inicio
    mostrar(publicaciones);
    filtros[0].classList.add('activo');

    // 7) Finalmente mostramos el body
    document.body.style.display = '';
});
