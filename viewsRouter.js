const express = require('express');
const router = express.Router();
const  ProductModel = require('./models/productModel');
const cartModel = require('./models/cartModel')
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Ruta para visualizar todos los productos
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (error) {
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

// Ruta para visualizar un carrito específico
router.get('/carts/:cartId', async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findById(cartId).populate('products.product');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

module.exports = router;
