// Registro de IA: Desarrollado con asistencia de Inteligencia Artificial para Mueblería Santillán.

// =========================================
// 1. CLAVE DE STORAGE Y PRODUCTOS INICIALES
// =========================================
const CLAVE_STORAGE = "muebleria-datos";

const productosSemilla = [
    {
        codigo: "MUE-01",
        nombre: "Sillón Cama 2 Cuerpos",
        categoria: "living",
        material: "Pino Elliotis / Chenille",
        medidas: "160 x 90 x 85 cm",
        precio: 145000,
        imagen: "imagenes/sillon.jpg"
    },
    {
        codigo: "MUE-02",
        nombre: "Mesa de Centro Rústica",
        categoria: "living",
        material: "Madera de Guatambú",
        medidas: "100 x 60 x 45 cm",
        precio: 48000,
        imagen: "imagenes/mesa-centro.jpg"
    },
    {
        codigo: "MUE-03",
        nombre: "Juego de Comedor 6 Sillas",
        categoria: "comedor",
        material: "Paraíso Macizo",
        medidas: "180 x 90 x 78 cm",
        precio: 230000,
        imagen: "imagenes/juego-comedor.jpg"
    },
    {
        codigo: "MUE-04",
        nombre: "Silla de Comedor Tapizada",
        categoria: "comedor",
        material: "Madera de Roble / Pana",
        medidas: "45 x 50 x 95 cm",
        precio: 32000,
        imagen: "imagenes/silla.jpg"
    },
    {
        codigo: "MUE-05",
        nombre: "Cama Queen Size con Cajones",
        categoria: "dormitorio",
        material: "MDF Enchapado / Cedar",
        medidas: "160 x 200 x 40 cm",
        precio: 185000,
        imagen: "imagenes/cama-queen.jpg"
    },
    {
        codigo: "MUE-06",
        nombre: "Mesa de Luz 2 Cajones",
        categoria: "dormitorio",
        material: "Madera de Paraíso",
        medidas: "45 x 40 x 60 cm",
        precio: 29000,
        imagen: "imagenes/mesa-luz.jpg"
    }
];

const variantesMadera = [
    { id: "natural", nombre: "Madera Natural (Estándar)", recargo: 0 },
    { id: "roble", nombre: "Madera Roble Oscuro (+10%)", recargoPorcentaje: 10 },
    { id: "laqueado", nombre: "Laqueado Blanco Premium (+15%)", recargoPorcentaje: 15 },
    { id: "nogal", nombre: "Madera Nogal Especial (+20%)", recargoPorcentaje: 20 }
];

// =========================================
// 2. INICIALIZACIÓN DE ESTADO Y LOCALSTORAGE
// =========================================

const datosGuardadosJSON = localStorage.getItem(CLAVE_STORAGE);

let productos = [];
let carrito = [];
let presupuestos = [];

if (datosGuardadosJSON) {
    const datosGuardados = JSON.parse(datosGuardadosJSON);
    productos = datosGuardados.productos || [];
    carrito = datosGuardados.carrito || [];
    presupuestos = datosGuardados.presupuestos || [];
} else {
    productos = [...productosSemilla];
    carrito = [];
    presupuestos = [];
    guardarEnLocalStorage();
}

function guardarEnLocalStorage() {
    const estadoActual = {
        productos: productos,
        carrito: carrito,
        presupuestos: presupuestos
    };
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estadoActual));
}

// =========================================
// 3. NAVEGACIÓN ENTRE VISTAS (VENTANAS)
// =========================================

const enlacesNavegacion = document.querySelectorAll(".enlace-navegacion");
const vistas = document.querySelectorAll(".vista");

enlacesNavegacion.forEach(enlace => {
    enlace.addEventListener("click", (e) => {
        e.preventDefault();
        
        enlacesNavegacion.forEach(l => l.classList.remove("activo"));
        vistas.forEach(v => v.classList.remove("activa"));

        enlace.classList.add("activo");

        const idDestino = enlace.getAttribute("data-destino");
        const vistaDestino = document.getElementById(idDestino);
        if (vistaDestino) {
            vistaDestino.classList.add("activa");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
});

// =========================================
// 4. MANEJO DE ERRORES DE IMAGEN
// =========================================

function manejarErrorImagen(elementoImagen) {
    const imagenReemplazoSVG = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='100%25' height='100%25' fill='%2523F5F1EB'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='48'%3E🪑%3C/text%3E%3C/svg%3E";
    
    elementoImagen.onerror = null;
    elementoImagen.src = imagenReemplazoSVG;
}

// =========================================
// 5. MÓDULO DE CARRITO Y CONTADOR
// =========================================

const cuerpoTablaCarrito = document.getElementById("cuerpo-tabla-carrito");
const totalCarritoElem = document.getElementById("total-carrito");
const contadorCarritoElem = document.getElementById("contador-carrito");
const botonVaciarCarrito = document.getElementById("boton-vaciar-carrito");

function agregarAlCarrito(codigoProducto) {
    const prod = productos.find(p => p.codigo === codigoProducto);
    if (!prod) return;

    const selectVariante = document.getElementById(`variante-${codigoProducto}`);
    const varianteId = selectVariante ? selectVariante.value : "natural";
    const varianteObj = variantesMadera.find(v => v.id === varianteId) || variantesMadera[0];

    let precioCalculado = prod.precio;
    if (varianteObj.recargoPorcentaje) {
        precioCalculado = Math.round(prod.precio * (1 + varianteObj.recargoPorcentaje / 100));
    }

    const claveItemCarrito = `${codigoProducto}-${varianteId}`;
    const itemEnCarrito = carrito.find(item => item.claveUnica === claveItemCarrito);

    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < 20) {
            itemEnCarrito.cantidad += 1;
        } else {
            alert("No puedes agregar más de 20 unidades de un mismo producto y variante.");
            return;
        }
    } else {
        carrito.push({
            claveUnica: claveItemCarrito,
            codigo: prod.codigo,
            nombre: prod.nombre,
            precioUnitario: precioCalculado,
            varianteNombre: varianteObj.nombre,
            imagen: prod.imagen,
            cantidad: 1
        });
    }

    guardarEnLocalStorage();
    renderizarCarrito();
    alert(`Agregado al carrito: ${prod.nombre} (${varianteObj.nombre})`);
}

function cambiarCantidadCarrito(claveUnica, delta) {
    const itemEnCarrito = carrito.find(item => item.claveUnica === claveUnica);
    if (!itemEnCarrito) return;

    const nuevaCantidad = itemEnCarrito.cantidad + delta;

    if (Number.isInteger(nuevaCantidad) && nuevaCantidad >= 1 && nuevaCantidad <= 20) {
        itemEnCarrito.cantidad = nuevaCantidad;
        guardarEnLocalStorage();
        renderizarCarrito();
    } else if (nuevaCantidad > 20) {
        alert("La cantidad máxima permitida es 20 unidades.");
    }
}

function quitarDelCarrito(claveUnica) {
    carrito = carrito.filter(item => item.claveUnica !== claveUnica);
    guardarEnLocalStorage();
    renderizarCarrito();
}

function vaciarCarrito() {
    if (carrito.length === 0) return;

    const confirmar = confirm("¿Estás seguro de que deseas vaciar todo el carrito?");
    if (confirmar) {
        carrito = [];
        guardarEnLocalStorage();
        renderizarCarrito();
    }
}

function renderizarCarrito() {
    if (!cuerpoTablaCarrito) return;

    cuerpoTablaCarrito.innerHTML = "";

    const formateadorMoneda = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    if (carrito.length === 0) {
        cuerpoTablaCarrito.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem; color: #666;">
                    El carrito está vacío.
                </td>
            </tr>
        `;
        if (totalCarritoElem) totalCarritoElem.textContent = formateadorMoneda.format(0);
        if (contadorCarritoElem) contadorCarritoElem.textContent = "0";
        return;
    }

    let totalGeneral = 0;
    let cantidadTotalItems = 0;

    carrito.forEach(item => {
        const subtotal = item.precioUnitario * item.cantidad;
        totalGeneral += subtotal;
        cantidadTotalItems += item.cantidad;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                <img src="${item.imagen}" alt="${item.nombre}" class="miniatura-carrito" onerror="manejarErrorImagen(this)">
            </td>
            <td>
                <strong>${item.nombre}</strong><br>
                <span style="font-size: 0.8rem; color: #666;">Acabado: ${item.varianteNombre}</span>
            </td>
            <td>${formateadorMoneda.format(item.precioUnitario)}</td>
            <td>
                <div class="controles-cantidad">
                    <button class="boton-cantidad" onclick="cambiarCantidadCarrito('${item.claveUnica}', -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="boton-cantidad" onclick="cambiarCantidadCarrito('${item.claveUnica}', 1)">+</button>
                </div>
            </td>
            <td><strong>${formateadorMoneda.format(subtotal)}</strong></td>
            <td>
                <button class="boton-eliminar" onclick="quitarDelCarrito('${item.claveUnica}')">Quitar</button>
            </td>
        `;

        cuerpoTablaCarrito.appendChild(fila);
    });

    if (totalCarritoElem) totalCarritoElem.textContent = formateadorMoneda.format(totalGeneral);
    if (contadorCarritoElem) contadorCarritoElem.textContent = cantidadTotalItems;
}

if (botonVaciarCarrito) {
    botonVaciarCarrito.addEventListener("click", vaciarCarrito);
}


// =========================================
// 6. MÓDULO DE PRESUPUESTOS Y DOCUMENTO
// =========================================

const formularioPresupuesto = document.getElementById("formulario-presupuesto");
const clienteNombreInput = document.getElementById("cliente-nombre");
const tipoPagoSelect = document.getElementById("tipo-pago");
const descuentoPorcentajeInput = document.getElementById("descuento-porcentaje");
const validezDiasInput = document.getElementById("validez-dias");
const areaPresupuesto = document.getElementById("area-presupuesto");
const listaPresupuestosEmitidos = document.getElementById("lista-presupuestos-emitidos");

function limpiarErroresPresupuesto() {
    document.getElementById("error-cliente-nombre").textContent = "";
    document.getElementById("error-descuento").textContent = "";
    document.getElementById("error-validez").textContent = "";
    clienteNombreInput.classList.remove("invalido");
    descuentoPorcentajeInput.classList.remove("invalido");
    validezDiasInput.classList.remove("invalido");
}

function generarPresupuesto(evento) {
    evento.preventDefault();
    limpiarErroresPresupuesto();

    if (carrito.length === 0) {
        alert("No se puede generar un presupuesto con el carrito vacío.");
        return;
    }

    let esValido = true;

    const nombreCliente = clienteNombreInput.value.trim();
    if (!nombreCliente) {
        document.getElementById("error-cliente-nombre").textContent = "El nombre del cliente es obligatorio.";
        clienteNombreInput.classList.add("invalido");
        esValido = false;
    }

    const descuentoManualPorc = parseFloat(descuentoPorcentajeInput.value);
    if (isNaN(descuentoManualPorc) || descuentoManualPorc < 0 || descuentoManualPorc > 30) {
        document.getElementById("error-descuento").textContent = "El descuento manual debe ser entre 0 y 30.";
        descuentoPorcentajeInput.classList.add("invalido");
        esValido = false;
    }

    const validezDias = parseInt(validezDiasInput.value, 10);
    if (isNaN(validezDias) || validezDias < 1) {
        document.getElementById("error-validez").textContent = "La validez debe ser al menos de 1 día.";
        validezDiasInput.classList.add("invalido");
        esValido = false;
    }

    if (!esValido) return;

    let subtotalGeneral = 0;
    const itemsPresupuesto = carrito.map(item => {
        const subtotalItem = item.precioUnitario * item.cantidad;
        subtotalGeneral += subtotalItem;
        return {
            codigo: item.codigo,
            nombre: item.nombre,
            variante: item.varianteNombre,
            precioUnitario: item.precioUnitario,
            cantidad: item.cantidad,
            subtotal: subtotalItem
        };
    });

    let descuentoTotalPorcentaje = descuentoManualPorc;
    let motivoDescuentoExtra = [];

    const tipoPago = tipoPagoSelect.value;
    if (tipoPago === "efectivo") {
        descuentoTotalPorcentaje += 10;
        motivoDescuentoExtra.push("Pago en efectivo (10%)");
    }

    if (subtotalGeneral > 300000) {
        descuentoTotalPorcentaje += 5;
        motivoDescuentoExtra.push("Compra superior a $300.000 (5%)");
    }

    if (descuentoTotalPorcentaje > 50) {
        descuentoTotalPorcentaje = 50;
    }

    const montoDescuento = Math.round((subtotalGeneral * descuentoTotalPorcentaje) / 100);
    const totalFinal = subtotalGeneral - montoDescuento;

    const numeroCorrelativoNum = presupuestos.length + 1;
    const numeroPresupuesto = `PRE-${String(numeroCorrelativoNum).padStart(4, '0')}`;

    const fechaActual = new Date();
    const fechaFormateada = fechaActual.toLocaleDateString("es-AR");

    const fechaVencimiento = new Date();
    fechaVencimiento.setDate(fechaActual.getDate() + validezDias);
    const fechaVencimientoFormateada = fechaVencimiento.toLocaleDateString("es-AR");

    const nuevoPresupuesto = {
        numero: numeroPresupuesto,
        fecha: fechaFormateada,
        validezDias: validezDias,
        vencimiento: fechaVencimientoFormateada,
        cliente: nombreCliente,
        tipoPago: tipoPago,
        descuentoPorcentajeAplicado: descuentoTotalPorcentaje,
        motivoDescuentoExtra: motivoDescuentoExtra,
        items: itemsPresupuesto,
        subtotalGeneral: subtotalGeneral,
        montoDescuento: montoDescuento,
        totalFinal: totalFinal
    };

    presupuestos.push(nuevoPresupuesto);
    guardarEnLocalStorage();

    renderizarPresupuestoActivo(nuevoPresupuesto);
    renderizarPresupuestosGuardados();
}

function renderizarPresupuestoActivo(presu) {
    const formateadorMoneda = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    let filasItemsHTML = "";
    presu.items.forEach(it => {
        filasItemsHTML += `
            <tr>
                <td>${it.nombre} (${it.codigo})<br><small style="color:#666;">${it.variante}</small></td>
                <td>${it.cantidad}</td>
                <td>${formateadorMoneda.format(it.precioUnitario)}</td>
                <td><strong>${formateadorMoneda.format(it.subtotal)}</strong></td>
            </tr>
        `;
    });

    let detalleDescuentoTexto = `Descuento aplicado (${presu.descuentoPorcentajeAplicado}%)`;
    if (presu.motivoDescuentoExtra && presu.motivoDescuentoExtra.length > 0) {
        detalleDescuentoTexto += ` [Incluye: ${presu.motivoDescuentoExtra.join(", ")}]`;
    }

    areaPresupuesto.innerHTML = `
        <div class="documento-presupuesto">
            <div class="doc-encabezado">
                <div class="doc-empresa">
                    <h3>Mueblería Santillán</h3>
                    <p>Venta de Muebles y Diseños a Medida</p>
                    <p>Salta, Argentina</p>
                </div>
                <div class="doc-info">
                    <h4>Presupuesto N° ${presu.numero}</h4>
                    <p><strong>Fecha:</strong> ${presu.fecha}</p>
                </div>
            </div>

            <div class="doc-cliente">
                <p><strong>Cliente:</strong> ${presu.cliente}</p>
                <p><strong>Forma de Pago:</strong> <span style="text-transform: capitalize;">${presu.tipoPago}</span></p>
            </div>

            <div class="tabla-scroll">
                <table class="tabla-presupuesto-detalle">
                    <thead>
                        <tr>
                            <th>Producto / Variante</th>
                            <th>Cant.</th>
                            <th>Precio Unit.</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filasItemsHTML}
                    </tbody>
                </table>
            </div>

            <div class="doc-totales">
                <p>Subtotal: ${formateadorMoneda.format(presu.subtotalGeneral)}</p>
                <p>${detalleDescuentoTexto}: -${formateadorMoneda.format(presu.montoDescuento)}</p>
                <p class="total-final">Total: ${formateadorMoneda.format(presu.totalFinal)}</p>
            </div>

            <p class="doc-validez">Válido hasta el día ${presu.vencimiento} (${presu.validezDias} días de validez).</p>

            <button type="button" class="boton-imprimir" onclick="window.print()">🖨️ Imprimir Presupuesto</button>
        </div>
    `;
}

function renderizarPresupuestosGuardados() {
    if (!listaPresupuestosEmitidos) return;

    listaPresupuestosEmitidos.innerHTML = "";

    if (presupuestos.length === 0) {
        listaPresupuestosEmitidos.innerHTML = `<p style="color: #666; font-size: 0.9rem;">No hay presupuestos emitidos todavía.</p>`;
        return;
    }

    const formateadorMoneda = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    const presupuestosInvertidos = [...presupuestos].reverse();

    presupuestosInvertidos.forEach(presu => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-presupuesto-guardado";

        tarjeta.innerHTML = `
            <div>
                <strong>${presu.numero}</strong> - ${presu.cliente} (${presu.fecha})<br>
                <span style="font-size: 0.85rem; color: #555;">Total: ${formateadorMoneda.format(presu.totalFinal)}</span>
            </div>
            <button class="boton-editar" onclick="verPresupuestoGuardado('${presu.numero}')">Ver Documento</button>
        `;

        listaPresupuestosEmitidos.appendChild(tarjeta);
    });
}

function verPresupuestoGuardado(numeroPresu) {
    const encontrado = presupuestos.find(p => p.numero === numeroPresu);
    if (encontrado) {
        renderizarPresupuestoActivo(encontrado);
        areaPresupuesto.scrollIntoView({ behavior: 'smooth' });
    }
}

if (formularioPresupuesto) {
    formularioPresupuesto.addEventListener("submit", generarPresupuesto);
}


// =========================================
// 7. MÓDULO DE CATÁLOGO Y FILTROS EN VIVO
// =========================================

const grillaProductos = document.getElementById("grilla-productos");
const filtroCategoria = document.getElementById("filtro-categoria");
const filtroPrecioMax = document.getElementById("filtro-precio-max");
const filtroBusqueda = document.getElementById("filtro-busqueda");
const ordenPrecio = document.getElementById("orden-precio");

function renderizarCatalogo() {
    if (!grillaProductos) return;

    const categoriaSeleccionada = filtroCategoria.value;
    const precioMaximo = parseFloat(filtroPrecioMax.value);
    const textoBusqueda = filtroBusqueda.value.trim().toLowerCase();
    const criterioOrden = ordenPrecio.value;

    let productosFiltrados = productos.filter(prod => {
        const coincideCategoria = categoriaSeleccionada === "todas" || prod.categoria === categoriaSeleccionada;
        const coincidePrecio = isNaN(precioMaximo) || prod.precio <= precioMaximo;
        const coincideBusqueda = textoBusqueda === "" || 
            prod.nombre.toLowerCase().includes(textoBusqueda) || 
            prod.material.toLowerCase().includes(textoBusqueda);

        return coincideCategoria && coincidePrecio && coincideBusqueda;
    });

    if (criterioOrden === "menor-mayor") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (criterioOrden === "mayor-menor") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    grillaProductos.innerHTML = "";

    if (productosFiltrados.length === 0) {
        grillaProductos.innerHTML = `
            <div class="mensaje-sin-resultados">
                No encontramos muebles con esos filtros.
            </div>
        `;
        return;
    }

    const formateadorMoneda = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    productosFiltrados.forEach((prod) => {
        let opcionesVariantesHTML = "";
        variantesMadera.forEach(v => {
            opcionesVariantesHTML += `<option value="${v.id}">${v.nombre}</option>`;
        });

        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-producto";

        tarjeta.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="manejarErrorImagen(this)">
            <div class="tarjeta-producto-info">
                <h3 class="tarjeta-producto-nombre">${prod.nombre}</h3>
                <p class="tarjeta-producto-detalle"><strong>Material:</strong> ${prod.material}</p>
                <p class="tarjeta-producto-detalle"><strong>Medidas:</strong> ${prod.medidas}</p>
                
                <div class="selector-variante-tarjeta">
                    <label for="variante-${prod.codigo}">Acabado / Madera:</label>
                    <select id="variante-${prod.codigo}">
                        ${opcionesVariantesHTML}
                    </select>
                </div>

                <p class="tarjeta-producto-precio">${formateadorMoneda.format(prod.precio)} <small style="font-size:0.75rem; font-weight:normal;">(Base)</small></p>
                <button class="boton-agregar-carrito" onclick="agregarAlCarrito('${prod.codigo}')">Agregar al carrito</button>
            </div>
        `;

        grillaProductos.appendChild(tarjeta);
    });
}

if (filtroCategoria) filtroCategoria.addEventListener("change", renderizarCatalogo);
if (filtroPrecioMax) filtroPrecioMax.addEventListener("input", renderizarCatalogo);
if (filtroBusqueda) filtroBusqueda.addEventListener("input", renderizarCatalogo);
if (ordenPrecio) ordenPrecio.addEventListener("change", renderizarCatalogo);


// =========================================
// 8. MÓDULO DE ADMINISTRACIÓN (CRUD Y VALIDACIONES)
// =========================================

const formularioProducto = document.getElementById("formulario-producto");
const campoCodigo = document.getElementById("prod-codigo");
const campoNombre = document.getElementById("prod-nombre");
const campoCategoria = document.getElementById("prod-categoria");
const campoMaterial = document.getElementById("prod-material");
const campoMedidas = document.getElementById("prod-medidas");
const campoPrecio = document.getElementById("prod-precio");
const campoImagen = document.getElementById("prod-imagen");
const campoIndiceEdicion = document.getElementById("prod-indice-edicion");
const botonGuardar = document.getElementById("boton-guardar-producto");
const botonCancelar = document.getElementById("boton-cancelar-edicion");
const cuerpoTablaAdmin = document.getElementById("cuerpo-tabla-admin");

function limpiarErroresFormulario() {
    const mensajesError = document.querySelectorAll("#formulario-producto .mensaje-error");
    mensajesError.forEach(msg => msg.textContent = "");

    const camposInvalidos = document.querySelectorAll("#formulario-producto .invalido");
    camposInvalidos.forEach(campo => campo.classList.remove("invalido"));
}

function mostrarErrorCampo(idCampo, idError, mensaje) {
    const elementoCampo = document.getElementById(idCampo);
    const elementoError = document.getElementById(idError);
    
    if (elementoCampo && elementoError) {
        elementoCampo.classList.add("invalido");
        elementoError.textContent = mensaje;
    }
}

function validarFormularioProducto() {
    limpiarErroresFormulario();
    let esValido = true;
    const indiceEdicion = parseInt(campoIndiceEdicion.value, 10);

    const valorCodigo = campoCodigo.value.trim().toUpperCase();
    const formatoCodigoRegex = /^[A-Z]{3}-\d{2}$/;

    if (!valorCodigo) {
        mostrarErrorCampo("prod-codigo", "error-prod-codigo", "El código es obligatorio.");
        esValido = false;
    } else if (!formatoCodigoRegex.test(valorCodigo)) {
        mostrarErrorCampo("prod-codigo", "error-prod-codigo", "Formato inválido. Debe ser 3 letras, guion y 2 números (ej: MES-01).");
        esValido = false;
    } else {
        const existeCodigo = productos.some((prod, idx) => prod.codigo.toUpperCase() === valorCodigo && idx !== indiceEdicion);
        if (existeCodigo) {
            mostrarErrorCampo("prod-codigo", "error-prod-codigo", "Este código ya pertenece a otro producto.");
            esValido = false;
        }
    }

    const valorNombre = campoNombre.value.trim();
    if (!valorNombre) {
        mostrarErrorCampo("prod-nombre", "error-prod-nombre", "El nombre es obligatorio.");
        esValido = false;
    }

    if (!campoCategoria.value) {
        mostrarErrorCampo("prod-categoria", "error-prod-categoria", "Debe seleccionar una categoría.");
        esValido = false;
    }

    const valorMedidas = campoMedidas.value.trim();
    if (!valorMedidas) {
        mostrarErrorCampo("prod-medidas", "error-prod-medidas", "Las medidas son obligatorias.");
        esValido = false;
    }

    const valorPrecio = Number(campoPrecio.value);
    if (!campoPrecio.value.trim()) {
        mostrarErrorCampo("prod-precio", "error-prod-precio", "El precio es obligatorio.");
        esValido = false;
    } else if (!Number.isInteger(valorPrecio) || valorPrecio <= 0) {
        mostrarErrorCampo("prod-precio", "error-prod-precio", "El precio debe ser un número entero mayor a cero.");
        esValido = false;
    }

    const valorImagen = campoImagen.value.trim().toLowerCase();
    const extensionesValidas = /\.(jpg|png|webp)$/i;

    if (!valorImagen) {
        mostrarErrorCampo("prod-imagen", "error-prod-imagen", "La ruta de imagen es obligatoria.");
        esValido = false;
    } else if (!extensionesValidas.test(valorImagen)) {
        mostrarErrorCampo("prod-imagen", "error-prod-imagen", "La imagen debe terminar en .jpg, .png o .webp.");
        esValido = false;
    }

    return esValido;
}

function guardarProducto(evento) {
    evento.preventDefault();

    if (!validarFormularioProducto()) {
        return;
    }

    const indiceEdicion = parseInt(campoIndiceEdicion.value, 10);

    const nuevoProducto = {
        codigo: campoCodigo.value.trim().toUpperCase(),
        nombre: campoNombre.value.trim(),
        categoria: campoCategoria.value,
        material: campoMaterial.value.trim() || "No especificado",
        medidas: campoMedidas.value.trim(),
        precio: parseInt(campoPrecio.value, 10),
        imagen: campoImagen.value.trim()
    };

    if (indiceEdicion === -1) {
        productos.push(nuevoProducto);
    } else {
        productos[indiceEdicion] = nuevoProducto;
    }

    guardarEnLocalStorage();
    renderizarTablaAdmin();
    renderizarCatalogo();
    limpiarFormularioAdmin();
}

function prepararEdicionProducto(indice) {
    const prod = productos[indice];
    if (!prod) return;

    limpiarErroresFormulario();
    campoIndiceEdicion.value = indice;
    campoCodigo.value = prod.codigo;
    campoNombre.value = prod.nombre;
    campoCategoria.value = prod.categoria;
    campoMaterial.value = prod.material;
    campoMedidas.value = prod.medidas;
    campoPrecio.value = prod.precio;
    campoImagen.value = prod.imagen;

    botonGuardar.textContent = "Actualizar Producto";
    botonCancelar.style.display = "inline-block";
    formularioProducto.scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicion() {
    limpiarFormularioAdmin();
}

function limpiarFormularioAdmin() {
    formularioProducto.reset();
    campoIndiceEdicion.value = "-1";
    botonGuardar.textContent = "Guardar Producto";
    botonCancelar.style.display = "none";
    limpiarErroresFormulario();
}

function eliminarProducto(indice) {
    const prod = productos[indice];
    if (!prod) return;

    const confirmar = confirm(`¿Estás seguro de que deseas eliminar el producto "${prod.nombre}" (${prod.codigo})?`);
    if (confirmar) {
        productos.splice(indice, 1);
        guardarEnLocalStorage();
        renderizarTablaAdmin();
        renderizarCatalogo();
        if (parseInt(campoIndiceEdicion.value, 10) === indice) {
            limpiarFormularioAdmin();
        }
    }
}

function renderizarTablaAdmin() {
    if (!cuerpoTablaAdmin) return;

    cuerpoTablaAdmin.innerHTML = "";

    if (productos.length === 0) {
        cuerpoTablaAdmin.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 1.5rem;">No hay productos registrados en la base de datos.</td>
            </tr>
        `;
        return;
    }

    const formateadorMoneda = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        maximumFractionDigits: 0
    });

    productos.forEach((prod, idx) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="miniatura-tabla" onerror="manejarErrorImagen(this)">
            </td>
            <td><strong>${prod.codigo}</strong></td>
            <td>${prod.nombre}</td>
            <td style="text-transform: capitalize;">${prod.categoria}</td>
            <td>${prod.medidas}</td>
            <td>${formateadorMoneda.format(prod.precio)}</td>
            <td>
                <button class="boton-editar" onclick="prepararEdicionProducto(${idx})">✏️ Editar</button>
                <button class="boton-eliminar" onclick="eliminarProducto(${idx})">🗑️ Baja</button>
            </td>
        `;

        cuerpoTablaAdmin.appendChild(fila);
    });
}

// =========================================
// 9. MÓDULO DE IMPORTACIÓN Y EXPORTACIÓN DE DATOS
// =========================================

const botonExportar = document.getElementById("boton-exportar");
const archivoImportar = document.getElementById("archivo-importar");
const errorImportacionElem = document.getElementById("error-importacion");

function exportarDatosJSON() {
    const estadoCompleto = {
        productos: productos,
        carrito: carrito,
        presupuestos: presupuestos
    };

    const contenidoJSON = JSON.stringify(estadoCompleto, null, 2);
    const blob = new Blob([contenidoJSON], { type: "application/json" });
    const urlTemporal = URL.createObjectURL(blob);

    const enlaceTemporal = document.createElement("a");
    enlaceTemporal.href = urlTemporal;
    enlaceTemporal.download = "muebleria.json";
    
    document.body.appendChild(enlaceTemporal);
    enlaceTemporal.click();
    
    document.body.removeChild(enlaceTemporal);
    URL.revokeObjectURL(urlTemporal);
}

function importarDatosJSON(evento) {
    const archivo = evento.target.files[0];
    if (!archivo) return;

    if (errorImportacionElem) errorImportacionElem.textContent = "";

    const lector = new FileReader();

    lector.onload = function(e) {
        try {
            const datosImportados = JSON.parse(e.target.result);

            if (!datosImportados || 
                !Array.isArray(datosImportados.productos) || 
                !Array.isArray(datosImportados.carrito) || 
                !Array.isArray(datosImportados.presupuestos)) {
                throw new Error("El archivo JSON no tiene la estructura válida esperada.");
            }

            const confirmar = confirm("¿Estás seguro de que deseas importar estos datos? Se sobrescribirá el catálogo, carrito y presupuestos actuales.");
            
            if (confirmar) {
                productos = datosImportados.productos;
                carrito = datosImportados.carrito;
                presupuestos = datosImportados.presupuestos;

                guardarEnLocalStorage();

                renderizarCatalogo();
                renderizarTablaAdmin();
                renderizarCarrito();
                renderizarPresupuestosGuardados();

                const areaPresupuesto = document.getElementById("area-presupuesto");
                if (areaPresupuesto) {
                    areaPresupuesto.innerHTML = `<p>Completá los datos con el carrito con ítems para generar el presupuesto oficial.</p>`;
                }

                alert("Datos importados exitosamente.");
            }
        } catch (error) {
            if (errorImportacionElem) {
                errorImportacionElem.textContent = "Error: El archivo seleccionado no es un JSON válido o está incompleto.";
            }
        } finally {
            archivoImportar.value = "";
        }
    };

    lector.onerror = function() {
        if (errorImportacionElem) {
            errorImportacionElem.textContent = "Error al leer el archivo.";
        }
        archivoImportar.value = "";
    };

    lector.readAsText(archivo);
}

if (formularioProducto) {
    formularioProducto.addEventListener("submit", guardarProducto);
}

if (botonCancelar) {
    botonCancelar.addEventListener("click", cancelarEdicion);
}

if (botonExportar) {
    botonExportar.addEventListener("click", exportarDatosJSON);
}

if (archivoImportar) {
    archivoImportar.addEventListener("change", importarDatosJSON);
}

// Inicialización general al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarCatalogo();
    renderizarTablaAdmin();
    renderizarCarrito();
    renderizarPresupuestosGuardados();
});


// =========================================
// 10. REGISTRO DEL SERVICE WORKER (PWA)
// =========================================
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("Service Worker registrado con éxito:", reg.scope))
            .catch(err => console.error("Error al registrar el Service Worker:", err));
    });
}