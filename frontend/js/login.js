// Añadimos un listener al formulario de login para que cuando se envíe, ejecute la función
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional y recargue la página

    // Obtenemos los valores que el usuario escribió en los campos de email y contraseña
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        // Hacemos una petición POST al backend con los datos del usuario
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, // Indicamos que enviamos JSON
            body: JSON.stringify({ email, password }), // Convertimos los datos a JSON
        });

        // Esperamos la respuesta del servidor y la convertimos a JSON
        const data = await response.json();

        if (response.ok) {
            // Si el login fue exitoso, guardamos el user_id en el localStorage
            localStorage.setItem("user_id", JSON.stringify(data.user_id));
            alert("Login exitoso"); // Mostramos un mensaje de éxito
            // Redirigimos al usuario a la página principal de la app
            window.location.href = "/frontend/pages/app/homePage.html";
        } else {
            // Si hubo un error (por ejemplo, usuario o contraseña incorrectos), mostramos el mensaje de error
            alert("Error: " + data.detail);
        }
    } catch (error) {
        // Si no se pudo conectar con el servidor, mostramos un mensaje de error
        alert("Error de conexión con el servidor");
    }
});
