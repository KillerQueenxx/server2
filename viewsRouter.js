const express = require('express');
const router = express.Router();
const authController = require('./controllers/authController');
const ProductModel = require('./models/productModel');
const CartModel = require('./models/cartModel');
const mongoose = require('mongoose');
const authMiddleware = require('./middlewares/authMiddleware');

mongoose.set('strictQuery', false);

// Ruta para visualizar todos los productos
router.get('/products', async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.render('products', { products });
  } catch (error) {
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

// Ruta para visualizar un carrito específico
router.get('/carts/:cartId', authMiddleware.isLoggedIn, async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const cart = await CartModel.findById(cartId).populate('products.product');
    res.render('cart', { cart });
  } catch (error) {
    res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
  }
});

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/auth/github', authController.githubLogin);
router.get('/auth/github/callback', authController.githubCallback);

module.exports = router;