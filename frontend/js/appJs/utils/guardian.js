// guardian.js
document.addEventListener("DOMContentLoaded", () => {
   const userId = localStorage.getItem("user_id");

   if (!userId) {
      // Si no hay sesión, redirige al login
      window.location.href = "../login.html"; // ajusta la ruta si es necesario
   } else {
      // Si hay sesión, muestra el contenido
      document.body.style.display = "block";
   }
});