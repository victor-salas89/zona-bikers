const regionesYComunas = {
    "Región Metropolitana": ["Santiago", "Puente Alto", "Maipú", "La Florida"],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"],
    "Región del Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "San Pedro de la Paz"]
};

function inicializarSelectsUbicacion(idRegion, idComuna) {
    const selectRegion = document.getElementById(idRegion);
    const selectComuna = document.getElementById(idComuna);

    if (selectRegion && selectComuna) {
        for (let region in regionesYComunas) {
            let option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            selectRegion.appendChild(option);
        }

        selectRegion.addEventListener("change", function () {
            selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
            const comunas = regionesYComunas[this.value];
            if (comunas) {
                comunas.forEach(comuna => {
                    let option = document.createElement("option");
                    option.value = comuna;
                    option.textContent = comuna;
                    selectComuna.appendChild(option);
                });
            }
        });
    }
}

function validarDominioCorreo(correo) {
    const dominiosPermitidos = /@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return dominiosPermitidos.test(correo);
}

function validarRut(rut) {
    const rutLimpio = rut.trim().toUpperCase();
    if (!/^[0-9]+[0-9K]$/.test(rutLimpio)) return false;
    if (rutLimpio.length < 7 || rutLimpio.length > 9) return false;
    
    let cuerpo = rutLimpio.slice(0, -1);
    let dv = rutLimpio.slice(-1);
    let suma = 0;
    let multiplo = 2;
    for (let i = 1; i <= cuerpo.length; i++) {
        let index = multiplo * cuerpo.charAt(cuerpo.length - i);
        suma = suma + index;
        if (multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
    }
    let dvEsperado = 11 - (suma % 11);
    dvEsperado = (dvEsperado === 11) ? "0" : ((dvEsperado === 10) ? "K" : dvEsperado.toString());
    
    return dv === dvEsperado;
}

function mostrarError(idElemento, mensaje) {
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        elemento.textContent = mensaje;
    }
}

function limpiarErrores(idsErrores) {
    idsErrores.forEach(id => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = "";
    });
}

document.addEventListener("DOMContentLoaded", function () {

    const formContacto = document.getElementById("formContacto");
    if (formContacto) {
        formContacto.addEventListener("submit", function (e) {
            e.preventDefault();
            limpiarErrores(["errorNombre", "errorCorreo", "errorComentario"]);
            let esValido = true;

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const comentario = document.getElementById("comentario").value.trim();

            if (nombre === "") {
                mostrarError("errorNombre", "El nombre es requerido.");
                esValido = false;
            } else if (nombre.length > 100) {
                mostrarError("errorNombre", "El nombre no puede superar los 100 caracteres.");
                esValido = false;
            }

            if (correo !== "") {
                if (correo.length > 100) {
                    mostrarError("errorCorreo", "El correo no puede superar los 100 caracteres.");
                    esValido = false;
                } else if (!validarDominioCorreo(correo)) {
                    mostrarError("errorCorreo", "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                    esValido = false;
                }
            }

            if (comentario === "") {
                mostrarError("errorComentario", "El comentario es requerido.");
                esValido = false;
            } else if (comentario.length > 500) {
                mostrarError("errorComentario", "El comentario no puede superar los 500 caracteres.");
                esValido = false;
            }

            if (esValido) {
                alert("Mensaje de contacto enviado con éxito.");
                formContacto.reset();
            }
        });
    }

    const formRegistro = document.getElementById("formRegistro") || document.getElementById("formUsuario");
    if (formRegistro) {
        inicializarSelectsUbicacion("region", "comuna");

        formRegistro.addEventListener("submit", function (e) {
            e.preventDefault();
            limpiarErrores(["errorRun", "errorNombre", "errorApellidos", "errorCorreo", "errorRegion", "errorComuna", "errorDireccion", "errorTipoUsuario"]);
            let esValido = true;

            const run = document.getElementById("run").value.trim();
            const nombre = document.getElementById("nombre").value.trim();
            const apellidos = document.getElementById("apellidos").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const direccion = document.getElementById("direccion") ? document.getElementById("direccion").value.trim() : "";
            
            if (run === "") {
                mostrarError("errorRun", "El RUN es requerido.");
                esValido = false;
            } else if (!validarRut(run)) {
                mostrarError("errorRun", "El RUN ingresado no es válido (Ingrese sin puntos ni guión).");
                esValido = false;
            }

            if (nombre === "") {
                mostrarError("errorNombre", "El nombre es requerido.");
                esValido = false;
            } else if (nombre.length > 50) {
                mostrarError("errorNombre", "El nombre no puede superar los 50 caracteres.");
                esValido = false;
            }

            if (apellidos === "") {
                mostrarError("errorApellidos", "Los apellidos son requeridos.");
                esValido = false;
            } else if (apellidos.length > 100) {
                mostrarError("errorApellidos", "Los apellidos no pueden superar los 100 caracteres.");
                esValido = false;
            }

            if (correo === "") {
                mostrarError("errorCorreo", "El correo es requerido.");
                esValido = false;
            } else if (correo.length > 100) {
                mostrarError("errorCorreo", "El correo no puede superar los 100 caracteres.");
                esValido = false;
            } else if (!validarDominioCorreo(correo)) {
                mostrarError("errorCorreo", "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                esValido = false;
            }

            if (direccion === "") {
                mostrarError("errorDireccion", "La dirección es requerida.");
                esValido = false;
            } else if (direccion.length > 300) {
                mostrarError("errorDireccion", "La dirección no puede superar los 300 caracteres.");
                esValido = false;
            }

            const tipoUsuario = document.getElementById("tipoUsuario");
            if (tipoUsuario && tipoUsuario.value === "") {
                mostrarError("errorTipoUsuario", "Seleccione un tipo de usuario.");
                esValido = false;
            }

            if (esValido) {
                alert("Usuario registrado con éxito.");
                formRegistro.reset();
            }
        });
    }

    const formProducto = document.getElementById("formProducto");
    if (formProducto) {
        formProducto.addEventListener("submit", function (e) {
            e.preventDefault();
            limpiarErrores(["errorCodigo", "errorNombreProducto", "errorDescripcion", "errorPrecio", "errorStock", "errorStockCritico", "errorCategoria"]);
            let esValido = true;

            const codigo = document.getElementById("codigo").value.trim();
            const nombre = document.getElementById("nombreProducto").value.trim();
            const descripcion = document.getElementById("descripcion").value.trim();
            const precio = document.getElementById("precio").value;
            const stock = document.getElementById("stock").value;
            const stockCritico = document.getElementById("stockCritico").value;
            const categoria = document.getElementById("categoria").value;

            if (codigo === "" || codigo.length < 3) {
                mostrarError("errorCodigo", "El código es requerido y debe tener mínimo 3 caracteres.");
                esValido = false;
            }

            if (nombre === "") {
                mostrarError("errorNombreProducto", "El nombre del producto es requerido.");
                esValido = false;
            } else if (nombre.length > 100) {
                mostrarError("errorNombreProducto", "El nombre no puede superar los 100 caracteres.");
                esValido = false;
            }

            if (descripcion.length > 500) {
                mostrarError("errorDescripcion", "La descripción no puede superar los 500 caracteres.");
                esValido = false;
            }

            if (precio === "" || parseFloat(precio) < 0) {
                mostrarError("errorPrecio", "El precio es requerido y debe ser 0 o mayor.");
                esValido = false;
            }

            if (stock === "" || !Number.isInteger(Number(stock)) || parseInt(stock) < 0) {
                mostrarError("errorStock", "El stock es requerido y debe ser un número entero mayor o igual a 0.");
                esValido = false;
            }

            if (stockCritico !== "") {
                if (!Number.isInteger(Number(stockCritico)) || parseInt(stockCritico) < 0) {
                    mostrarError("errorStockCritico", "El stock crítico debe ser un número entero mayor o igual a 0.");
                    esValido = false;
                } else if (parseInt(stock) <= parseInt(stockCritico)) {
                    alert("ALERTA: El stock actual es igual o inferior al stock crítico definido.");
                }
            }

            if (categoria === "") {
                mostrarError("errorCategoria", "Seleccione una categoría.");
                esValido = false;
            }

            if (esValido) {
                alert("Producto guardado exitosamente.");
                formProducto.reset();
            }
        });
    }

    const formLogin = document.getElementById("formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();
            limpiarErrores(["errorCorreoLogin", "errorContrasenaLogin"]);
            let esValido = true;

            const correo = document.getElementById("correoLogin").value.trim();
            const contrasena = document.getElementById("contrasenaLogin").value.trim();

            if (correo === "") {
                mostrarError("errorCorreoLogin", "El correo es requerido.");
                esValido = false;
            } else if (correo.length > 100) {
                mostrarError("errorCorreoLogin", "El correo no puede superar los 100 caracteres.");
                esValido = false;
            } else if (!validarDominioCorreo(correo)) {
                mostrarError("errorCorreoLogin", "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.");
                esValido = false;
            }

            if (contrasena === "") {
                mostrarError("errorContrasenaLogin", "La contraseña es requerida.");
                esValido = false;
            } else if (contrasena.length < 4 || contrasena.length > 10) {
                mostrarError("errorContrasenaLogin", "La contraseña debe tener entre 4 y 10 caracteres.");
                esValido = false;
            }

            if (esValido) {
                alert("Inicio de sesión correcto.");
                window.location.href = "admin.html";
            }
        });
    }
});