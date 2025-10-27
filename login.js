document.getElementById("loginBtn").addEventListener("click", async () => {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;
  const mensaje = document.getElementById("mensaje");

  try {
    // Cargar el JSON de usuarios
    const response = await fetch("usuarios.json");
    const usuarios = await response.json();

    // Buscar coincidencia
    const encontrado = usuarios.find(u => u.usuario === user && u.password === pass);

    if (encontrado) {
      mensaje.textContent = "✅ Login correcto";
      document.getElementById("login-container").style.display = "none";
      document.getElementById("juego-container").style.display = "block";
      iniciarJuego(); // función que definiremos en juego.js
    } else {
      mensaje.textContent = "Usuario o contraseña incorrectos";
    }
  } catch (error) {
    mensaje.textContent = "Error cargando usuarios";
    console.error(error);
  }
});
