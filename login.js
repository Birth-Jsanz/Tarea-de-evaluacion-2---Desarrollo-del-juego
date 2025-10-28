const nombreInput = document.getElementById("name");
const passwordInput = document.getElementById("password");
const edadInput = document.getElementById("edad");
const loginBtn = document.getElementById("loginBtn");

function validarCampos() {
    const name = nombreInput.value.trim();
    const password = passwordInput.value.trim();
    const edad = edadInput.value.trim();

    const camposCompletos = name !== "" && password !== "" && edad !== "";

    if (camposCompletos) {
        loginBtn.classList.add("activo");
    } else {
        loginBtn.classList.remove("activo");
    }
}

document.getElementById("loginBtn").addEventListener("click", async () => {
    const name = nombreInput.value.trim();
    const password = passwordInput.value.trim();
    const edad = edadInput.value.trim();

    try {
        const response = await fetch("usuarios.json");
        const usuarios = await response.json();

        const encontrado = usuarios.find(u => u.nombre === name && u.contraseña === password);

        if (encontrado) {
            document.getElementById("mensaje").textContent = "Login correcto";
            mostrarPantallaNivel(name, edad);
        } else {
            document.getElementById("mensaje").textContent = "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        document.getElementById("mensaje").textContent = "Error al cargar usuarios";
        console.error(error);
        }
    });


// Escuchar cambios en los campos
[nombreInput, passwordInput, edadInput].forEach(input => {
    input.addEventListener("input", validarCampos);
});

function mostrarPantallaNivel(name, edad) {
    document.getElementById("loginInterface").style.display = "none";
    document.getElementById("welcomeInterface").style.display = "block";

    document.getElementById("welcomeNombre").textContent = name.toUpperCase();
    document.getElementById("welcomeEdad").textContent = edad;

    let nivel = 1;
    if (edad >= 6 && edad <= 8) nivel = 2;
    else if (edad > 8) nivel = 3;

    document.getElementById("welcomePropuesto").textContent = nivel
}


document.getElementById("welcomeBtnNext").addEventListener("click", () => {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";
    iniciarJuego(); 
});

document.getElementById("welcomeBtnBack").addEventListener("click", () => {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";
});

