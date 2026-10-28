/**
 * El Percho — Tienda de Ropa Online
 * Catálogo con carrito de compras funcional
 * Autora: Allison Guerrero — @alinge20
 */

// ===== Datos de productos =====
const productos = [
    { id: 1,  nombre: "Vestido Floral",         precio: 89900,  precioOriginal: 119900, categoria: "mujer",      emoji: "👗" },
    { id: 2,  nombre: "Blusa Elegante",          precio: 54900,  precioOriginal: null,   categoria: "mujer",      emoji: "👚" },
    { id: 3,  nombre: "Pantalón Palazzo",        precio: 74900,  precioOriginal: 94900,  categoria: "mujer",      emoji: "👖" },
    { id: 4,  nombre: "Falda Midi",              precio: 64900,  precioOriginal: null,   categoria: "mujer",      emoji: "🩱" },
    { id: 5,  nombre: "Camisa Oxford",           precio: 59900,  precioOriginal: null,   categoria: "hombre",     emoji: "👔" },
    { id: 6,  nombre: "Jeans Slim Fit",          precio: 84900,  precioOriginal: 109900, categoria: "hombre",     emoji: "👖" },
    { id: 7,  nombre: "Chaqueta Casual",         precio: 129900, precioOriginal: 159900, categoria: "hombre",     emoji: "🧥" },
    { id: 8,  nombre: "Polo Classic",            precio: 49900,  precioOriginal: null,   categoria: "hombre",     emoji: "👕" },
    { id: 9,  nombre: "Bolso de Cuero",          precio: 94900,  precioOriginal: 134900, categoria: "accesorios", emoji: "👜" },
    { id: 10, nombre: "Reloj Minimalista",       precio: 149900, precioOriginal: null,   categoria: "accesorios", emoji: "⌚" },
    { id: 11, nombre: "Gorra Deportiva",         precio: 34900,  precioOriginal: null,   categoria: "accesorios", emoji: "🧢" },
    { id: 12, nombre: "Bufanda de Lana",         precio: 44900,  precioOriginal: 59900,  categoria: "accesorios", emoji: "🧣" },
    { id: 13, nombre: "Top Deportivo",           precio: 39900,  precioOriginal: null,   categoria: "mujer",      emoji: "👚" },
    { id: 14, nombre: "Sudadera Oversize",       precio: 69900,  precioOriginal: 89900,  categoria: "hombre",     emoji: "👕" },
    { id: 15, nombre: "Gafas de Sol",            precio: 79900,  precioOriginal: null,   categoria: "accesorios", emoji: "🕶️" },
    { id: 16, nombre: "Vestido de Noche",        precio: 139900, precioOriginal: 179900, categoria: "mujer",      emoji: "👗" },
];

// ===== Estado del carrito =====
let carrito = [];

// ===== Elementos del DOM =====
const productsGrid    = document.getElementById("productsGrid");
const cartBtn         = document.getElementById("cartBtn");
const cartSidebar     = document.getElementById("cartSidebar");
const cartOverlay     = document.getElementById("cartOverlay");
const closeCart        = document.getElementById("closeCart");
const cartItems       = document.getElementById("cartItems");
const cartCount       = document.getElementById("cartCount");
const cartTotal       = document.getElementById("cartTotal");
const cartFooter      = document.getElementById("cartFooter");
const checkoutBtn     = document.getElementById("checkoutBtn");
const modalOverlay    = document.getElementById("modalOverlay");
const modalClose      = document.getElementById("modalClose");
const modalOk         = document.getElementById("modalOk");

// ===== Formatear precio en pesos colombianos =====
function formatPrecio(precio) {
    return "$" + precio.toLocaleString("es-CO");
}

// ===== Renderizar productos =====
function renderProductos(filtro = "todos") {
    const filtrados = filtro === "todos"
        ? productos
        : productos.filter(p => p.categoria === filtro);

    productsGrid.innerHTML = filtrados.map(p => `
        <div class="product-card" data-id="${p.id}">
            <div class="product-image">${p.emoji}</div>
            <div class="product-info">
                <div class="product-category">${p.categoria}</div>
                <div class="product-name">${p.nombre}</div>
                <div class="product-price">
                    ${formatPrecio(p.precio)}
                    ${p.precioOriginal ? `<span class="original-price">${formatPrecio(p.precioOriginal)}</span>` : ""}
                </div>
                <button class="btn-add-cart" data-id="${p.id}">Agregar al Carrito</button>
            </div>
        </div>
    `).join("");

    // Agregar eventos a los botones
    document.querySelectorAll(".btn-add-cart").forEach(btn => {
        btn.addEventListener("click", () => agregarAlCarrito(Number(btn.dataset.id)));
    });
}

// ===== Carrito =====
function agregarAlCarrito(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const existente = carrito.find(item => item.id === id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarCarrito();
    abrirCarrito();

    // Animación del botón
    const btn = document.querySelector(`.btn-add-cart[data-id="${id}"]`);
    if (btn) {
        btn.textContent = "¡Agregado!";
        btn.style.background = "#4caf50";
        setTimeout(() => {
            btn.textContent = "Agregar al Carrito";
            btn.style.background = "";
        }, 1000);
    }
}

function actualizarCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrecio = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    cartCount.textContent = totalItems;

    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        cartFooter.style.display = "none";
    } else {
        cartItems.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.emoji}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-price">${formatPrecio(item.precio)}</div>
                    <div class="cart-item-actions">
                        <button class="qty-btn" data-id="${item.id}" data-action="minus">−</button>
                        <span class="cart-item-qty">${item.cantidad}</span>
                        <button class="qty-btn" data-id="${item.id}" data-action="plus">+</button>
                        <button class="remove-item" data-id="${item.id}">Eliminar</button>
                    </div>
                </div>
            </div>
        `).join("");

        cartFooter.style.display = "block";
        cartTotal.textContent = formatPrecio(totalPrecio);

        // Eventos de cantidad
        document.querySelectorAll(".qty-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = Number(btn.dataset.id);
                const action = btn.dataset.action;
                cambiarCantidad(id, action);
            });
        });

        document.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => eliminarDelCarrito(Number(btn.dataset.id)));
        });
    }
}

function cambiarCantidad(id, action) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;

    if (action === "plus") {
        item.cantidad++;
    } else if (action === "minus") {
        item.cantidad--;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }
    }
    actualizarCarrito();
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

// ===== Abrir/Cerrar carrito =====
function abrirCarrito() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("open");
}

function cerrarCarrito() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("open");
}

// ===== Filtros =====
function activarFiltro(filtro) {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.filter === filtro);
    });
    renderProductos(filtro);
}

// ===== Eventos =====
cartBtn.addEventListener("click", abrirCarrito);
closeCart.addEventListener("click", cerrarCarrito);
cartOverlay.addEventListener("click", cerrarCarrito);

checkoutBtn.addEventListener("click", () => {
    cerrarCarrito();
    modalOverlay.classList.add("open");
});

modalClose.addEventListener("click", () => modalOverlay.classList.remove("open"));
modalOk.addEventListener("click", () => {
    modalOverlay.classList.remove("open");
    carrito = [];
    actualizarCarrito();
});

// Filtros de productos
document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => activarFiltro(btn.dataset.filter));
});

// Filtros desde categorías
document.querySelectorAll(".category-card").forEach(card => {
    card.addEventListener("click", () => {
        const filtro = card.dataset.filter;
        activarFiltro(filtro);
        document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
    });
});

// Filtros desde nav
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = link.dataset.category;
        if (cat) {
            activarFiltro(cat);
            document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
        }
    });
});

// ===== Inicializar =====
renderProductos();
