// Añadimos un evento al formulario de registro para cuando se envía
document.getElementById("registerForm").addEventListener("submit", async function (event) {
    // Evitamos que el formulario se envíe de forma tradicional y recargue la página
    event.preventDefault();

    // Obtenemos los valores que el usuario ha escrito en los campos del formulario
    const username = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Comprobamos que las contraseñas coinciden antes de continuar
    if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return; // Si no coinciden, paramos la función aquí
    }

    try {
        // Hacemos una petición POST al servidor para registrar al usuario
        const response = await fetch("http://127.0.0.1:8000/register", {
            method: "POST", // Método POST porque vamos a enviar datos
            headers: {
                "Content-Type": "application/json" // Indicamos que enviamos JSON
            },
            // Enviamos los datos del usuario en formato JSON
            body: JSON.stringify({ username, email, password })
        });

        // Esperamos la respuesta del servidor y la convertimos a JSON
        const data = await response.json();

        if (response.ok) {
            // Si todo ha ido bien, avisamos al usuario y lo llevamos a la página de login
            alert("¡Usuario registrado con éxito!");
            window.location.href = "login.html";
        } else {
            // Si hay algún error, mostramos el mensaje que nos da el servidor
            alert("Error: " + data.detail);
        }
    } catch (error) {
        // Si no se puede conectar con el servidor, mostramos un mensaje de error
        alert("Error de conexión con el servidor");
    }
});