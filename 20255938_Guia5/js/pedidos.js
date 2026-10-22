// Arreglo para almacenar los pedidos
const pedidos = [];

// Accedemos a los elementos del HTML
const formulario = document.querySelector("#formPedidos");
const tablaPedidos = document.querySelector("#tablaPedidos");
const totalUnidades = document.querySelector("#totalUnidades");
const montoTotal = document.querySelector("#montoTotal");

const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrar = document.querySelector("#btnMostrar");
const btnLimpiar = document.querySelector("#btnLimpiar");

// Precio máximo del filtro activo
let filtroMaximo = null;

// Función para agregar pedidos
function agregarPedido(evento) {
    evento.preventDefault();

    const producto = document.querySelector("#producto").value.trim();
    const precio = Number(document.querySelector("#precio").value);
    const cantidad = Number(document.querySelector("#cantidad").value);

    // Validaciones
    if (producto === "") {
        alert("Debe ingresar el nombre del producto");
        return;
    }

    if (!Number.isFinite(precio) || precio <= 0) {
        alert("El precio debe ser mayor que cero");
        return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("La cantidad debe ser un número entero positivo");
        return;
    }

    // Guardamos el pedido como objeto
    const pedido = {
        producto: producto,
        precio: precio,
        cantidad: cantidad
    };

    pedidos.push(pedido);

    actualizarVista();
    formulario.reset();
}

// Función para mostrar los pedidos en la tabla
function mostrarPedidos(lista) {
    tablaPedidos.innerHTML = "";

    const filas = lista.map(pedido => {
        const fila = document.createElement("tr");

        const subtotal = pedido.precio * pedido.cantidad;

        const datos = [
            pedido.producto,
            `$${pedido.precio.toFixed(2)}`,
            pedido.cantidad,
            `$${subtotal.toFixed(2)}`
        ];

        datos.forEach(dato => {
            const celda = document.createElement("td");
            celda.textContent = dato;
            fila.appendChild(celda);
        });

        return fila;
    });

    tablaPedidos.append(...filas);
}

// Función para calcular los totales
function calcularTotales() {
    const unidades = pedidos.reduce((total, pedido) => {
        return total + pedido.cantidad;
    }, 0);

    const monto = pedidos.reduce((total, pedido) => {
        return total + pedido.precio * pedido.cantidad;
    }, 0);

    totalUnidades.textContent = unidades;
    montoTotal.textContent = monto.toFixed(2);
}

// Función para actualizar la tabla y los indicadores
function actualizarVista() {
    const lista = filtroMaximo === null
        ? pedidos
        : pedidos.filter(pedido => pedido.precio <= filtroMaximo);

    mostrarPedidos(lista);
    calcularTotales();
}

// Función para filtrar productos
function filtrarProductos() {
    const valor = document.querySelector("#precioMaximo").value.trim();

    if (valor === "" || !Number.isFinite(Number(valor)) || Number(valor) < 0) {
        alert("Ingrese un precio máximo válido");
        return;
    }

    filtroMaximo = Number(valor);
    actualizarVista();
}

// Función para mostrar todos los pedidos
function mostrarTodos() {
    filtroMaximo = null;
    actualizarVista();
}

// Función para limpiar los pedidos
function limpiarPedidos() {
    pedidos.length = 0;
    actualizarVista();
}

// Eventos de los botones
formulario.addEventListener("submit", agregarPedido);
btnFiltrar.addEventListener("click", filtrarProductos);
btnMostrar.addEventListener("click", mostrarTodos);
btnLimpiar.addEventListener("click", limpiarPedidos);
