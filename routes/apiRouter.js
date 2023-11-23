const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authController = require('../controllers/authController'); 

// Rutas de productos
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authController.isAuthenticated, productController.createProduct); // Protegido por autenticación
router.put('/products/:id', authController.isAuthenticated, productController.updateProduct); // Protegido por autenticación
router.delete('/products/:id', authController.isAuthenticated, productController.deleteProduct); // Protegido por autenticación



module.exports = router;
