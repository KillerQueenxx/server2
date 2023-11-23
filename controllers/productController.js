const Product = require('../models/productModel');

const productController = {
  // Obtener todos los productos
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
};

module.exports = productController;
