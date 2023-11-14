const Product = require('./models/productModel');

class ProductDao {
  async getAllProducts() {
    try {
      const products = await Product.find();
      return products;
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  }

 
}

module.exports = ProductDao;
