// Espera a que todo el contenido del DOM esté cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
   // Obtiene el user_id almacenado en el localStorage del navegador
   const userId = localStorage.getItem("user_id");

   // Si no existe el user_id, significa que el usuario no ha iniciado sesión
   if (!userId) {
      // Redirige al usuario a la página de login
      window.location.href = "../login.html";
   } else {
      // Si el usuario está logueado, muestra el contenido de la página
      document.body.style.display = "block";
   }
});