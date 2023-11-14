const Cart = require('./models/cartModel');

class CartDao {
  async getCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ userId });
      return cart;
    } catch (error) {
      console.error('Error al obtener carrito:', error);
    }
  }

 
}

module.exports = CartDao;
