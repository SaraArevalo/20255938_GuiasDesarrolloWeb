//Accediendo al formulario y al contenedor de resultados
const formulario = document.getElementById("idFormEstudiante");
const resultado = document.getElementById("idResultadoValidacion");

//Definiendo las expresiones regulares
const regexCarnet = /^[A-Za-z]{2}\d{3}$/;
const regexNombre = /^[\p{L}]+(?:\s+[\p{L}]+)*$/u;
const regexDui = /^\d{8}-\d$/;
const regexNit = /^\d{4}-\d{6}-\d{3}-\d$/;
const regexFecha = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexEdad = /^\d+$/;

//Funcion para validar que la fecha exista
function validarFecha(fecha) {
    if (!regexFecha.test(fecha)) {
        return false;
    }

    let partes = fecha.split("/");
    let dia = parseInt(partes[0]);
    let mes = parseInt(partes[1]);
    let anio = parseInt(partes[2]);

    let fechaIngresada = new Date(anio, mes - 1, dia);

    return fechaIngresada.getDate() === dia &&
        fechaIngresada.getMonth() === mes - 1 &&
        fechaIngresada.getFullYear() === anio;
}

//Agregando el evento submit al formulario
formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    //Capturando los valores ingresados
    let carnet = document.getElementById("idTxtCarnet").value.trim();
    let nombre = document.getElementById("idTxtNombre").value.trim();
    let dui = document.getElementById("idTxtDui").value.trim();
    let nit = document.getElementById("idTxtNit").value.trim();
    let fecha = document.getElementById("idTxtFechaNacimiento").value.trim();
    let correo = document.getElementById("idTxtCorreo").value.trim();
    let edad = document.getElementById("idTxtEdad").value.trim();

    //Validando la informacion ingresada
    let validaciones = [
        {
            campo: "Carnet",
            valido: regexCarnet.test(carnet),
            formato: "Dos letras y tres números. Ejemplo: AB001"
        },
        {
            campo: "Nombre completo",
            valido: regexNombre.test(nombre),
            formato: "Solo letras y espacios"
        },
        {
            campo: "DUI",
            valido: regexDui.test(dui),
            formato: "########-#"
        },
        {
            campo: "NIT",
            valido: regexNit.test(nit),
            formato: "####-######-###-#"
        },
        {
            campo: "Fecha de nacimiento",
            valido: validarFecha(fecha),
            formato: "DD/MM/AAAA"
        },
        {
            campo: "Correo electrónico",
            valido: regexCorreo.test(correo),
            formato: "Debe contener un correo válido"
        },
        {
            campo: "Edad",
            valido: regexEdad.test(edad),
            formato: "Solo números"
        }
    ];

    //Verificando si todos los campos son validos
    let todosValidos = validaciones.every(validacion => validacion.valido);

    //Generando el listado de resultados
    let listado = "<ul class='list-group'>";

    validaciones.forEach(validacion => {
        let clase = validacion.valido
            ? "list-group-item-success"
            : "list-group-item-danger";

        let estado = validacion.valido
            ? "Válido"
            : "No válido";

        listado += `<li class="list-group-item ${clase}">
            <b>${validacion.campo}:</b> ${estado}
            <br><small>${validacion.formato}</small>
        </li>`;
    });

    listado += "</ul>";

    //Mostrando el resultado de las validaciones
    if (todosValidos) {
        resultado.innerHTML = `
            <div class="alert alert-success">
                <h4>Todos los datos son válidos</h4>
                La ficha del estudiante cumple con los formatos solicitados.
            </div>
            ${listado}
        `;
    } else {
        resultado.innerHTML = `
            <div class="alert alert-danger">
                <h4>Existen datos incorrectos</h4>
                Revise los campos que aparecen marcados como no válidos.
            </div>
            ${listado}
        `;
    }
});
