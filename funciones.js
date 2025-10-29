const nombreInput = document.getElementById("loginName");
const passwordInput = document.getElementById("loginPassword");
const edadInput = document.getElementById("loginEdad");
const loginBtn = document.getElementById("loginBtn");
let nivel = 1;
let cantidadOperaciones = 0;
let cantidadAciertos = 0;

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


function mostrarPantallaWelcome(name, edad) {
    document.getElementById("loginInterface").style.display = "none";
    document.getElementById("welcomeInterface").style.display = "block";

    document.getElementById("welcomeNombre").textContent = name.toUpperCase();
    document.getElementById("welcomeEdad").textContent = edad;

    if (edad >= 0 && edad <= 7) nivel = 1;
    else if (edad >= 7 && edad <= 10) nivel = 2
    else if (edad > 11) nivel = 3;

    document.getElementById("welcomePropuesto").textContent = nivel
}


function simboloAImagenes(simbolo) {
    const fragment = document.createDocumentFragment();


    if (simbolo === "+" || simbolo === "-" || simbolo === "=" || simbolo === "__") {
        const img = document.createElement("img");
        img.src = "img/" + simbolo + ".png"; 
        img.alt = simbolo;
        img.classList.add("simbolo");
        fragment.appendChild(img);
        return fragment;
    }

    const digitos = simbolo.toString().split(""); 
    digitos.forEach(dig => {
        const img = document.createElement("img");
        img.src = "img/" + dig + ".png";
        img.alt = dig;
        img.classList.add("simbolo");
        fragment.appendChild(img);
    });

    return fragment;
}


function operacionSegunNivel(nivel) {
    let primerNumero;
    let segundoNumero;
    let tempNumero;
    let operador;
    let resultado;
    let operacion;
    let operacionOculta;
    let respuestaOK;
    let ocultar;
    let oculto = "__";
    let posiblesRespuestas = [];
    let opciones;

    if (nivel == 1){

        primerNumero = Math.floor(Math.random() * 4);
        segundoNumero = Math.floor(Math.random() * 4);

    }
    else if (nivel == 2){

        primerNumero = Math.floor(Math.random() * 10);
        segundoNumero = Math.floor(Math.random() * 10);

    }
    else if (nivel == 3){

        primerNumero = Math.floor(Math.random() * 100);
        segundoNumero = Math.floor(Math.random() * 100);
    }

    operador = Math.random() < 0.5 ? '+' : '-';

    if ((operador == "-" )&&( primerNumero < segundoNumero)) {
        tempNumero = primerNumero;
        primerNumero = segundoNumero;
        segundoNumero = tempNumero;
    } 

    if (operador == '+') {
        resultado = primerNumero + segundoNumero;
    } else {
        resultado = primerNumero - segundoNumero;
    }
    
    ocultar = Math.floor(Math.random() * 4);

    if (ocultar == 0) {
        respuestaOK = primerNumero;
        primerNumero = oculto;
    }
    else if (ocultar == 1) {
        respuestaOK = operador;
        operador = oculto;
    }
    else if (ocultar == 2) {
        respuestaOK = segundoNumero;
        segundoNumero = oculto;
    }
    else if (ocultar == 3) {
        respuestaOK = resultado;
        resultado = oculto;
    }

    if (ocultar == 1) {
        posiblesRespuestas = ['+', '-'];
    }
    else { 
        posiblesRespuestas = [respuestaOK.toString()];
        while (posiblesRespuestas.length < 4) {
            if (nivel == 1){
                opciones = Math.floor(Math.random() * 4);
            }
            else if (nivel == 2){
                opciones = Math.floor(Math.random() * 10);
            }
            else if (nivel == 3){
                opciones = Math.floor(Math.random() * 100);
            }

            opciones = opciones.toString();
            if (!posiblesRespuestas.includes(opciones)) {
                posiblesRespuestas.push(opciones);
            }
        }
    }
    posiblesRespuestas = posiblesRespuestas.sort(() => Math.random() - 0.5);

    return { partesOperacion: [primerNumero.toString(), operador, segundoNumero.toString(), "=", resultado.toString()], 
             respuestaOK: respuestaOK.toString(), posiblesRespuestas };

}


function mostrarPantallaJuego(nivel) {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("juegoInterface").style.display = "block";

    const {partesOperacion, respuestaOK, posiblesRespuestas} = operacionSegunNivel(nivel);

    const cont = document.getElementById("juegoOperacion");
    cont.innerHTML = "";

    partesOperacion.forEach(simbolo => {
        cont.appendChild(simboloAImagenes(simbolo));
    });

    const contRespuestas = document.getElementById("juegoRespuestas");
    contRespuestas.innerHTML = "";
    posiblesRespuestas.forEach(opcion => {
        const btn = document.createElement("button");
        btn.classList.add("opcionBtn");

        btn.appendChild(simboloAImagenes(opcion));

        btn.addEventListener("click", () => {
            cantidadOperaciones++;
            if (opcion === respuestaOK) {
                alert("¡Correcto!");
                cantidadAciertos++;
                mostrarPantallaJuego(nivel);
            } else {
                alert("Ups, inténtalo otra vez");
            }
        });

        contRespuestas.appendChild(btn);
    });
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
            mostrarPantallaWelcome(name, edad);
        } else {
            document.getElementById("loginMensaje").textContent = "Usuario o contraseña incorrectos";
        }
    } catch (error) {
        document.getElementById("loginMensaje").textContent = "Error al cargar usuarios";
        console.error(error);
        }
    });



document.getElementById("welcomeBtnNext").addEventListener("click", async () => {
    mostrarPantallaJuego(nivel)
    }); 


[nombreInput, passwordInput, edadInput].forEach(input => {
    input.addEventListener("input", validarCampos);
});


document.getElementById("welcomeBtnBack").addEventListener("click", () => {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";

    textContent = "";
});

document.getElementById("juegoExit").addEventListener("click", () => {

    document.getElementById("juegoInterface").style.display = "none";
    document.getElementById("resultadoInterface").style.display = "block";

    document.getElementById("resultadoCantidad").textContent = cantidadOperaciones;
    document.getElementById("resultadoAciertos").textContent = cantidadAciertos;
});


document.getElementById("resultadoBtnNext").addEventListener("click", () => {
    document.getElementById("resultadoInterface").style.display = "none";
    document.getElementById("juegoInterface").style.display = "block";

    cantidadOperaciones = 0;
    cantidadAciertos = 0;
});


document.getElementById("resultadoBtnBack").addEventListener("click", () => {
    document.getElementById("resultadoInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";
    
    textContent = "";
});