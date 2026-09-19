const dbUsuarios = [
    { correo: "admin@duoc.cl", contrasena: "12345", rol: "administrador" },
    { correo: "vende@profesor.duoc.cl", contrasena: "vende", rol: "vendedor" },
    { correo: "cliente@gmail.com", contrasena: "moto1", rol: "cliente" }
];

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
                const usuarioValido = dbUsuarios.find(u => u.correo === correo && u.contrasena === contrasena);

                if (usuarioValido) {
                    alert(`¡Inicio de sesión correcto! Bienvenido/a (${usuarioValido.rol}).`);
                    
                    if (usuarioValido.rol === "administrador" || usuarioValido.rol === "vendedor") {
                        window.location.href = "admin.html"; 
                    } else {
                        window.location.href = "index.html";
                    }
                } else {
                    mostrarError("errorContrasenaLogin", "El correo o la contraseña son incorrectos.");
                }
            }
        });
    }
});

// =============================
// LÓGICA DEL CARRITO DE COMPRAS
// =============================
let carrito = JSON.parse(localStorage.getItem("carritoBikers")) || [];

function guardarCarrito() {
    localStorage.setItem("carritoBikers", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find(p => p.nombre === producto.nombre);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += producto.cantidad;
    } else {
        carrito.push(producto);
    }
    
    guardarCarrito();
    alert(`¡${producto.nombre} agregado al carrito!`);
}

function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("listaCarrito");
    const elementoTotal = document.getElementById("totalCarrito");
    
    if (!contenedorCarrito || !elementoTotal) return;

    contenedorCarrito.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p class='text-muted fs-5'>Tu carrito está vacío.</p>";
        elementoTotal.textContent = "$0";
        return;
    }

    carrito.forEach((producto, index) => {
        const subtotal = producto.precio * producto.cantidad;
        total += subtotal;

        // Crear el producto en el carrito
        const article = document.createElement("article");
        article.className = "producto-carrito card card-biker mb-3";
        article.innerHTML = `
            <div class="row g-0 align-items-center">
                <div class="col-3 col-sm-2">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded-start p-2">
                </div>
                <div class="col-9 col-sm-10">
                    <div class="card-body d-flex flex-wrap align-items-center gap-3">
                        <h2 class="h6 mb-0 flex-grow-1">${producto.nombre}</h2>
                        <p class="precio mb-0">Precio: $${producto.precio.toLocaleString('es-CL')}</p>
                        <div class="d-flex align-items-center gap-2">
                            <label for="cant_${index}" class="form-label mb-0">Cantidad</label>
                            <input type="number" id="cant_${index}" class="form-control form-control-sm input-cantidad" data-index="${index}" style="width: 5rem;" min="1" value="${producto.cantidad}">
                        </div>
                        <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" data-index="${index}">Eliminar</button>
                    </div>
                </div>
            </div>
        `;
        contenedorCarrito.appendChild(article);
    });

    // Actualizar el total
    elementoTotal.textContent = `$${total.toLocaleString('es-CL')}`;

    // Botón Eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            carrito.splice(index, 1);
            guardarCarrito();
            renderizarCarrito();
        });
    });

    document.querySelectorAll(".input-cantidad").forEach(input => {
        input.addEventListener("change", function() {
            const index = this.getAttribute("data-index");
            const nuevaCantidad = parseInt(this.value);
            if(nuevaCantidad > 0) {
                carrito[index].cantidad = nuevaCantidad;
                guardarCarrito();
                renderizarCarrito(); 
            }
        });
    });
}

// ===================================
// EVENTOS PARA OBTENER DATOS DEL HTML
// ===================================
document.addEventListener("DOMContentLoaded", function () {
    
    renderizarCarrito();

    // Obtenemos productos desde la página de listado
    const botonesAgregar = document.querySelectorAll("article.card-biker button");
    botonesAgregar.forEach(btn => {
        if(btn.textContent.trim() === "Agregar al carrito") {
            btn.addEventListener("click", function() {
                const tarjeta = this.closest("article.card-biker");
                
                const nombre = tarjeta.querySelector(".card-title").textContent.trim();
                const precioTexto = tarjeta.querySelector(".precio").textContent.trim();
                const imagen = tarjeta.querySelector("img").src;
                
                const precioNumerico = parseInt(precioTexto.replace(/[^0-9]/g, ""));

                agregarAlCarrito({
                    nombre: nombre,
                    precio: precioNumerico,
                    imagen: imagen,
                    cantidad: 1
                });
            });
        }
    });

    // Obtener producto desde Detalle
    const btnDetalle = document.getElementById("agregarCarrito");
    if (btnDetalle) {
        btnDetalle.addEventListener("click", function() {
            const contenedor = this.closest(".detalle-producto");
            
            const nombre = contenedor.querySelector("h2").textContent.trim();
            const precioTexto = contenedor.querySelector(".precio").textContent.trim();
            const imagen = contenedor.querySelector("img").src;
            const precioNumerico = parseInt(precioTexto.replace(/[^0-9]/g, ""));
            
            const inputCantidad = document.getElementById("cantidad");
            const cantidad = inputCantidad ? parseInt(inputCantidad.value) : 1;

            agregarAlCarrito({
                nombre: nombre,
                precio: precioNumerico,
                imagen: imagen,
                cantidad: cantidad
            });
        });
    }

    // Botones para manejar el Carrito
    const btnVaciar = document.getElementById("vaciarCarrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", function() {
            if(confirm("¿Estás seguro de vaciar todo tu carrito?")) {
                carrito = [];
                guardarCarrito();
                renderizarCarrito();
            }
        });
    }

    const btnFinalizar = document.getElementById("finalizarCompra");
    if (btnFinalizar) {
        btnFinalizar.addEventListener("click", function() {
            if(carrito.length > 0) {
                alert("¡Compra finalizada con éxito!");
                carrito = [];
                guardarCarrito();
                renderizarCarrito();
            } else {
                alert("El carrito está vacío, no puedes finalizar la compra.");
            }
        });
    }
});