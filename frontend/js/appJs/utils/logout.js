// Seleccionamos el botón de logout por su id y le añadimos un evento al hacer click
document.getElementById("logout-button").addEventListener("click", (e) => {
  // Evitamos que el botón haga su acción por defecto (por si es un submit o enlace)
  e.preventDefault();
  // Eliminamos el user_id del localStorage para cerrar la sesión del usuario
  localStorage.removeItem("user_id");
  // Redirigimos al usuario a la página de login
  window.location.href = "../login.html";
});