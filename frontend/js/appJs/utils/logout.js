document.getElementById("logout-button").addEventListener("click", (e) => {
  e.preventDefault(); // Evita que siga el href="#"
  localStorage.removeItem("user_id");
  window.location.href = "../login.html";
});