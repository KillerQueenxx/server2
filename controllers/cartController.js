const Cart = require('../models/cartModel');

const cartController = {
  // Obtener un carrito específico por ID
  getCartById: async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await Cart.findById(cartId).populate('products.product');
      res.render('cart', { cart });
    } catch (error) {
      res.status(500).render('error', { status: 'error', message: 'Internal Server Error' });
    }
  },

 
};

module.exports = cartController;
