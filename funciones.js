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

    if (edad >= 0 && edad <= 5) nivel = 1;
    else if (edad >= 6 && edad <= 10) nivel = 2
    else if (edad >= 11) nivel = 3;

    document.getElementById("welcomePropuesto").textContent = nivel
}


function simbolosEnImagenes(simbolo) {
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
    const grupo = document.createElement("span");
    grupo.classList.add("numero"); 

    digitos.forEach(dig => {
        const img = document.createElement("img");
        img.src = "img/" + dig + ".png";
        img.alt = dig;
        img.classList.add("simbolo");
        grupo.appendChild(img);
    });

    fragment.appendChild(grupo);
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

    return {    partesOperacion: [  primerNumero.toString(), 
                                    operador, 
                                    segundoNumero.toString(), "=", 
                                    resultado.toString()], 
                respuestaOK: respuestaOK.toString(), 
                posiblesRespuestas };

}


function mostrarPantallaJuego(nivel) {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("juegoInterface").style.display = "block";

    const { partesOperacion, respuestaOK, posiblesRespuestas } = operacionSegunNivel(nivel);

    const cont = document.getElementById("juegoOperacion");
    cont.innerHTML = "";

    // Crear la operación con un hueco "zonaDrop"
    partesOperacion.forEach(simbolo => {
        if (simbolo === "__") {
            const zonaDrop = document.createElement("div");
            zonaDrop.id = "zonaDrop";
            zonaDrop.classList.add("zonaDrop");
            cont.appendChild(zonaDrop);
        } else {
            cont.appendChild(simbolosEnImagenes(simbolo));
        }
    });

    const contRespuestas = document.getElementById("juegoRespuestas");
    contRespuestas.innerHTML = "";

    const mensaje = document.getElementById("juegoValoracion");
    mensaje.textContent = "";

    // Crear las opciones como arrastrables
    posiblesRespuestas.forEach(opcion => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("arrastrar");
        wrapper.setAttribute("data-value", opcion);
        wrapper.appendChild(simbolosEnImagenes(opcion));

        let offsetX, offsetY;

        // Cuando empieza a arrastrar
        wrapper.onmousedown = (e) => {
            wrapper.classList.add("arrastrando");
            offsetX = e.offsetX;
            offsetY = e.offsetY;

            document.onmousemove = (ev) => {
                wrapper.style.position = "absolute";
                wrapper.style.left = (ev.pageX - offsetX) + "px";
                wrapper.style.top = (ev.pageY - offsetY) + "px";
                wrapper.style.zIndex = 1000;
            };
        };

        // Cuando suelta
        wrapper.onmouseup = (e) => {
            document.onmousemove = null;
            wrapper.classList.remove("arrastrando");

            const zonaDrop = document.getElementById("zonaDrop");
            const rect = zonaDrop.getBoundingClientRect();

            // Comprobar si se soltó dentro del hueco
            if (
                e.clientX > rect.left &&
                e.clientX < rect.right &&
                e.clientY > rect.top &&
                e.clientY < rect.bottom
            ) {
                cantidadOperaciones++;
                if (opcion === respuestaOK) {
                    zonaDrop.innerHTML = ""; // limpiar el hueco
                    zonaDrop.appendChild(simbolosEnImagenes(opcion)); // meter la imagen/número correcto
                    mensaje.textContent = "¡Correcto! Has acumulado un acierto.";
                    cantidadAciertos++;
                    wrapper.remove(); // quitar la ficha usada de las opciones
                    setTimeout(() => mostrarPantallaJuego(nivel), 1500);
                } else {
                    mensaje.textContent = "¡No! Has acumulado un fallo. Inténtalo otra vez...";
                    wrapper.style.position = "static";
                    wrapper.style.zIndex = "auto";
                }
            }

            // Reset posición
            wrapper.style.position = "static";
            wrapper.style.zIndex = "auto";
        };

        contRespuestas.appendChild(wrapper);
    });
}

async function revisarUsuario() {
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
}

function welcomeBtnNext() {
    cantidadOperaciones = 0;
    cantidadAciertos = 0;
    mostrarPantallaJuego(nivel);
}

function welcomeBtnBack() {
    document.getElementById("welcomeInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";
    document.getElementById("loginMensaje").textContent = "";
}

function juegoExit() {
    document.getElementById("juegoInterface").style.display = "none";
    document.getElementById("resultadoInterface").style.display = "block";
    document.getElementById("resultadoCantidad").textContent = cantidadOperaciones;
    document.getElementById("resultadoAciertos").textContent = cantidadAciertos;
}

function resultadoBtnNext() {
    document.getElementById("resultadoInterface").style.display = "none";
    cantidadOperaciones = 0;
    cantidadAciertos = 0;
    mostrarPantallaJuego(nivel);
}

function resultadoBtnBack() {
    document.getElementById("resultadoInterface").style.display = "none";
    document.getElementById("loginInterface").style.display = "block";
    document.getElementById("loginMensaje").textContent = "";
}
