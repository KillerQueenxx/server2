const exphbs  = require('express-handlebars');
const socket = io();

socket.on('productosActualizados', (productos) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productos.forEach((producto) => {
        const listItem = document.createElement('li');
        listItem.textContent = producto.name;
        productList.appendChild(listItem);
    });
});

const productForm = document.getElementById('product-form');
const productNameInput = document.getElementById('product-name');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const productName = productNameInput.value;

    if (productName) {
        socket.emit('productoAgregado', { name: productName });
        productNameInput.value = '';
    }
});
