// REFERENCIAS A LOS CAMPOS DEL FORMULARIO

const formulario = document.forms["frmRegistro"];

const nombres = document.getElementById("idNombre");
const apellidos = document.getElementById("idApellidos");
const fechaNacimiento = document.getElementById("idFechaNac");
const correo = document.getElementById("idCorreo");
const password = document.getElementById("idPassword");
const passwordRepetir = document.getElementById("idPasswordRepetir");

const archivo = document.getElementById("idArchivo");
const pais = document.getElementById("idCmPais");

// REFERENCIAS A LOS INTERESES
const intereses = [
    document.getElementById("idCkProgramacion"),
    document.getElementById("idCkBD"),
    document.getElementById("idCkRedes"),
    document.getElementById("idCkSeguridad")
];

// REFERENCIAS A LAS CARRERAS
const carreras = [
    document.getElementById("idRdIng"),
    document.getElementById("idRdLic"),
    document.getElementById("idRdTec"),
    document.getElementById("idRdOtro")
];

// REFERENCIAS AL MODAL
const botonRegistro = formulario.elements["btnRegistro"];
const bodyModal = document.getElementById("idBodyModal");

const modal = new bootstrap.Modal(document.getElementById("idModal"));

// FUNCIÓN PARA VALIDAR LOS CAMPOS VACIOS

const validarFormulario = function () {

    if (
        nombres.value.trim() === "" ||
        apellidos.value.trim() === "" ||
        fechaNacimiento.value === "" ||
        correo.value.trim() === "" ||
        password.value === "" ||
        passwordRepetir.value === "" ||
        archivo.files.length === 0
    ) {
        alert("Todos los campos son obligatorios");
        return false;
    }

    return true;
};

// VALIDAR QUE LA FECHA NO SEA MAYOR A LA ACTUAL

const validarFecha = function () {

    const hoy = new Date();

    const fechaActual =
        hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");

    if (fechaNacimiento.value > fechaActual) {
        alert("La fecha de nacimiento no puede superar la fecha actual");
        return false;
    }

    return true;
};

// VALIDAR CORREO ELECTRÓNICO CON EXPRESIONES REGULARES

const validarCorreo = function () {

    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionCorreo.test(correo.value.trim())) {
        alert("Ingrese un correo electrónico válido");
        return false;
    }

    return true;
};

// VALIDAR QUE LAS CONTRASEÑAS SEAN IGUALES

const validarPassword = function () {

    if (password.value !== passwordRepetir.value) {
        alert("Las contraseñas no coinciden");
        return false;
    }

    return true;
};

// VALIDAR QUE SE SELECCIONE AL MENOS UN INTERÉS

const validarIntereses = function () {

    let seleccionado = intereses.some(elemento => elemento.checked);

    if (!seleccionado) {
        alert("Seleccione al menos un interés");
        return false;
    }

    return true;
};

// VALIDAR QUE SE SELECCIONE UNA CARRERA

const validarCarrera = function () {

    let seleccionado = carreras.some(elemento => elemento.checked);

    if (!seleccionado) {
        alert("Seleccione una carrera");
        return false;
    }

    return true;
};

// VALIDAR QUE SE SELECCIONE UN PAÍS

const validarPais = function () {

    if (pais.selectedIndex === 0) {
        alert("Seleccione un país de origen");
        return false;
    }

    return true;
};

// FUNCION PARA CREAR LA TABLA CON DOM

const mostrarInformacion = function () {

    // LIMPIANDO EL CUERPO DEL MODAL
    while (bodyModal.firstChild) {
        bodyModal.removeChild(bodyModal.firstChild);
    }

    // CAMBIANDO EL TITULO DEL MODAL
    document.getElementById("modalLabel").textContent = "Información del registro";

    // CREANDO LA TABLA
    const tabla = document.createElement("table");
    tabla.setAttribute("class", "table table-bordered table-striped");

    // CREANDO EL CUERPO DE LA TABLA
    const cuerpoTabla = document.createElement("tbody");

    // FUNCION PARA AGREGAR FILAS
    const agregarFila = function (titulo, valor) {

        const fila = document.createElement("tr");

        const encabezado = document.createElement("th");
        encabezado.setAttribute("scope", "row");
        encabezado.appendChild(document.createTextNode(titulo));

        const celda = document.createElement("td");
        celda.appendChild(document.createTextNode(valor));

        fila.appendChild(encabezado);
        fila.appendChild(celda);

        cuerpoTabla.appendChild(fila);
    };

    // OBTENIENDO LOS INTERESES SELECCIONADOS
    let interesesSeleccionados = [];

    for (const elemento of intereses) {
        if (elemento.checked) {
            interesesSeleccionados.push(
                elemento.nextElementSibling.textContent
            );
        }
    }

    // OBTENIENDO LA CARRERA SELECCIONADA
    let carreraSeleccionada = "";

    for (const elemento of carreras) {
        if (elemento.checked) {
            carreraSeleccionada = elemento.nextElementSibling.textContent;
        }
    }

    // AGREGANDO INFORMACIÓN A LA TABLA
    agregarFila("Nombres", nombres.value);
    agregarFila("Apellidos", apellidos.value);
    agregarFila("Fecha de nacimiento", fechaNacimiento.value);
    agregarFila("Correo electrónico", correo.value);
    agregarFila("Contraseña", "********");
    agregarFila("Repetir contraseña", "********");
    agregarFila("Intereses", interesesSeleccionados.join(", "));
    agregarFila("Carrera", carreraSeleccionada);
    agregarFila("País de origen", pais.options[pais.selectedIndex].text);
    agregarFila("Imagen seleccionada", archivo.files[0].name);

    // AGREGANDO LA TABLA AL MODAL
    tabla.appendChild(cuerpoTabla);
    bodyModal.appendChild(tabla);

    // MOSTRANDO EL MODAL
    modal.show();
};

// EVENTO DEL BOTÓN REGISTRAR

botonRegistro.onclick = () => {

    if (!validarFormulario()) return;

    if (!validarFecha()) return;

    if (!validarCorreo()) return;

    if (!validarPassword()) return;

    if (!validarIntereses()) return;

    if (!validarCarrera()) return;

    if (!validarPais()) return;

    mostrarInformacion();
};
