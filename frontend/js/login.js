document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data));
            alert("Login exitoso");
            window.location.href = "/frontend/pages/app/home.html";
        } else {
            alert("Error: " + data.detail);
        }
    } catch (error) {
        alert("Error de conexión con el servidor");
    }
});
