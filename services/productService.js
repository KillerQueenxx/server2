
const Product = require('../dao/models/product');

class ProductService {
    static async getAllProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

   
}

module.exports = ProductService;
