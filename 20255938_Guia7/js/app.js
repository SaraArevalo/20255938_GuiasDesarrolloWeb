// CONFIGURACIÓN DE RAPIDAPI

const API_KEY = "aff8d7886bmsh1adcfeecaeb857dp1d1394jsn66f460fa8618";
const API_HOST = "spotify23.p.rapidapi.com";

const URL_SEARCH = "https://spotify23.p.rapidapi.com/search/";
const URL_ALBUM_TRACKS = "https://spotify23.p.rapidapi.com/album_tracks/";

// REFERENCIAS A ELEMENTOS HTML

const formBusqueda = document.getElementById("formBusqueda");
const inputBusqueda = document.getElementById("inputBusqueda");
const btnBuscar = document.getElementById("btnBuscar");
const mensajeEstado = document.getElementById("mensajeEstado");
const resultados = document.getElementById("resultados");
const contadorResultados = document.getElementById("contadorResultados");

const seccionDetalle = document.getElementById("seccionDetalle");
const detalleCancion = document.getElementById("detalleCancion");
const cancionesAlbum = document.getElementById("cancionesAlbum");
const mensajeDetalle = document.getElementById("mensajeDetalle");
const btnCerrarDetalle = document.getElementById("btnCerrarDetalle");

// FUNCIÓN PARA CREAR ELEMENTOS HTML

function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);

    if (clase) {
        elemento.className = clase;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
}

// FUNCIÓN PARA OBTENER EL ID DE SPOTIFY

function obtenerIdSpotify(valor) {

    if (!valor) {
        return null;
    }

    return valor.includes(":")
        ? valor.split(":").pop()
        : valor;
}

// FUNCIÓN PARA OBTENER LOS ARTISTAS

function obtenerArtistas(cancion) {

    const artistas = cancion.artists?.items || [];

    return artistas
        .map(artista =>
            artista.profile?.name || artista.name
        )
        .filter(Boolean)
        .join(", ") || "Artista desconocido";
}

// FUNCIÓN PARA FORMATEAR LA DURACIÓN

function formatearDuracion(milisegundos) {

    if (!milisegundos) {
        return "No disponible";
    }

    const minutos = Math.floor(milisegundos / 60000);

    const segundos = Math.floor(
        (milisegundos % 60000) / 1000
    );

    return `${minutos}:${segundos.toString().padStart(2, "0")}`;
}

// NORMALIZAR INFORMACIÓN DE LAS CANCIONES

function normalizarCancion(item) {

    const data = item.data || item;

    return {
        id: obtenerIdSpotify(data.id || data.uri),
        nombre: data.name || "Canción sin nombre",

        artistas: obtenerArtistas(data),

        albumId: obtenerIdSpotify(
            data.albumOfTrack?.id ||
            data.albumOfTrack?.uri
        ),

        album: data.albumOfTrack?.name || "Álbum desconocido",

        portada: data.albumOfTrack?.coverArt?.sources?.[0]?.url || "",

        duracion: data.duration?.totalMilliseconds || 0,

        datos: data
    };
}

// MOSTRAR RESULTADOS DE BÚSQUEDA

function mostrarCanciones(canciones) {

    resultados.replaceChildren();

    contadorResultados.textContent =
        `${canciones.length} canciones`;

    canciones.forEach(cancion => {

        const tarjeta = crearElemento("article", "cancion-card");

        if (cancion.portada) {

            const imagen = crearElemento("img", "portada-cancion");

            imagen.src = cancion.portada;
            imagen.alt = `Portada de ${cancion.nombre}`;

            tarjeta.appendChild(imagen);

        } else {

            const imagen = crearElemento(
                "div",
                "portada-cancion sin-portada",
                "♫"
            );

            tarjeta.appendChild(imagen);
        }

        const informacion = crearElemento("div", "info-cancion");

        const titulo = crearElemento("h3", "", cancion.nombre);

        const artista = crearElemento(
            "p",
            "",
            cancion.artistas
        );

        const album = crearElemento(
            "p",
            "",
            `Álbum: ${cancion.album}`
        );

        const duracion = crearElemento(
            "p",
            "",
            formatearDuracion(cancion.duracion)
        );

        const boton = crearElemento(
            "button",
            "btn-detalles",
            "Ver álbum"
        );

        boton.type = "button";

        boton.addEventListener("click", () => {
            consultarAlbum(cancion);
        });

        informacion.append(
            titulo,
            artista,
            album,
            duracion,
            boton
        );

        tarjeta.appendChild(informacion);

        resultados.appendChild(tarjeta);
    });
}

// BUSCAR CANCIONES

async function buscarCanciones(consulta) {

    mensajeEstado.textContent = "Buscando canciones...";

    btnBuscar.disabled = true;
    btnBuscar.textContent = "Buscando...";

    resultados.replaceChildren();

    contadorResultados.textContent = "Buscando...";

    seccionDetalle.hidden = true;

    try {

        const url = `${URL_SEARCH}?q=${encodeURIComponent(consulta)}&type=tracks&offset=0&limit=10&numberOfTopResults=5`;

        const respuesta = await fetch(url, {
            method: "GET",

            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.message || "Error al buscar canciones."
            );
        }

        const palabrasBusqueda = consulta
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .split(/\s+/)
            .filter(Boolean);

        const canciones = datos.tracks.items
            .map(normalizarCancion)
            .filter(cancion => cancion.id)
            .filter(cancion => {

                const textoCancion = `
                    ${cancion.nombre}
                    ${cancion.artistas}
                    ${cancion.album}
                `.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "");

                return palabrasBusqueda.every(palabra =>
                    textoCancion.includes(palabra)
                );

            });

        if (canciones.length === 0) {

            mensajeEstado.textContent =
                "No se encontraron canciones.";

            contadorResultados.textContent = "0 canciones";

            return;
        }

        mostrarCanciones(canciones);

        mensajeEstado.textContent =
            `Se encontraron ${canciones.length} canciones.`;

    } catch (error) {

        console.error("Error en la búsqueda:", error);

        mensajeEstado.textContent =
            "No fue posible buscar canciones. Intenta nuevamente.";

        contadorResultados.textContent = "Error";

    } finally {

        btnBuscar.disabled = false;
        btnBuscar.textContent = "Buscar";
    }
}

// MOSTRAR INFORMACIÓN DE LA CANCIÓN SELECCIONADA

function mostrarDetalle(cancion, pista) {

    detalleCancion.replaceChildren();

    if (cancion.portada) {

        const imagen = crearElemento("img", "");

        imagen.src = cancion.portada;
        imagen.alt = `Portada de ${cancion.nombre}`;

        detalleCancion.appendChild(imagen);
    }

    const informacion = crearElemento("div", "");

    const titulo = crearElemento(
        "h3",
        "",
        cancion.nombre
    );

    const artista = crearElemento(
        "p",
        "",
        `Artista: ${cancion.artistas}`
    );

    const album = crearElemento(
        "p",
        "",
        `Álbum: ${cancion.album}`
    );

    const duracion = crearElemento(
        "p",
        "",
        `Duración: ${formatearDuracion(
            pista?.duration?.totalMilliseconds || cancion.duracion
        )}`
    );

    const reproducciones = crearElemento(
        "p",
        "",
        `Reproducciones: ${
            pista?.playcount
                ? Number(pista.playcount).toLocaleString("es-SV")
                : "No disponible"
        }`
    );

    informacion.append(
        titulo,
        artista,
        album,
        duracion,
        reproducciones
    );

    detalleCancion.appendChild(informacion);
}

// MOSTRAR CANCIONES DEL ÁLBUM

function mostrarCancionesAlbum(pistas, idSeleccionado) {

    cancionesAlbum.replaceChildren();

    pistas.forEach((elemento, indice) => {

        const pista = elemento.track;

        if (!pista) {
            return;
        }

        const fila = crearElemento("div", "pista-album");

        const numero = crearElemento(
            "span",
            "numero-pista",
            pista.trackNumber || indice + 1
        );

        const informacion = crearElemento("div", "");

        const titulo = crearElemento(
            "strong",
            "",
            pista.name
        );

        const artista = crearElemento(
            "p",
            "",
            pista.artists?.items
                ?.map(a => a.profile?.name || a.name)
                .join(", ") || "Artista desconocido"
        );

        const duracion = crearElemento(
            "span",
            "",
            formatearDuracion(
                pista.duration?.totalMilliseconds
            )
        );

        informacion.append(titulo, artista);

        fila.append(numero, informacion, duracion);

        if (
            obtenerIdSpotify(pista.uri) === idSeleccionado
        ) {
            fila.classList.add("pista-seleccionada");
        }

        cancionesAlbum.appendChild(fila);
    });
}

// CONSULTAR CANCIONES DEL ÁLBUM

async function consultarAlbum(cancion) {

    seccionDetalle.hidden = false;

    detalleCancion.replaceChildren();
    cancionesAlbum.replaceChildren();

    mensajeDetalle.textContent =
        "Cargando información del álbum...";

    if (!cancion.albumId) {

        mensajeDetalle.textContent =
            "No se encontró el identificador del álbum.";

        seccionDetalle.scrollIntoView({
            behavior: "smooth"
        });

        return;
    }

    try {

        const url = `${URL_ALBUM_TRACKS}?id=${encodeURIComponent(cancion.albumId)}&offset=0&limit=300`;

        const respuesta = await fetch(url, {
            method: "GET",

            headers: {
                "x-rapidapi-key": API_KEY,
                "x-rapidapi-host": API_HOST
            }
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                datos.message || "Error al consultar el álbum."
            );
        }

        const pistas =
            datos.data.album.tracks.items;

        const pistaSeleccionada = pistas
            .map(elemento => elemento.track)
            .find(pista =>
                obtenerIdSpotify(pista.uri) === cancion.id
            );

        mostrarDetalle(cancion, pistaSeleccionada);

        mostrarCancionesAlbum(
            pistas,
            cancion.id
        );

        mensajeDetalle.textContent =
            `Se encontraron ${pistas.length} canciones en este álbum.`;

    } catch (error) {

        console.error("Error al consultar el álbum:", error);

        mensajeDetalle.textContent =
            "No fue posible consultar las canciones del álbum.";

    }

    seccionDetalle.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// EVENTO DEL FORMULARIO DE BÚSQUEDA

formBusqueda.addEventListener("submit", function(event) {

    event.preventDefault();

    const consulta = inputBusqueda.value.trim();

    if (!consulta) {

        mensajeEstado.textContent =
            "Escribe el nombre de una canción o artista.";

        return;
    }

    buscarCanciones(consulta);
});

// EVENTO PARA CERRAR LOS DETALLES

btnCerrarDetalle.addEventListener("click", function() {

    seccionDetalle.hidden = true;

});
