const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Rutas de carrito
router.get('/:userId', cartController.getCartByUserId);
router.post('/:userId', cartController.addToCart);
router.delete('/:userId/:productId', cartController.removeFromCart);



module.exports = router;
