const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const categoryController = require('../controllers/category.controller');
const verifyToken = require('../middlewares/auth.middleware');

// Rutas de Categorías
router.get('/categories', categoryController.getAll);
router.post('/categories', verifyToken, categoryController.create);

// Rutas de Productos
router.get('/products', productController.getAll);
router.post('/products', verifyToken, productController.create);
router.patch('/products/:id/stock', verifyToken, productController.updateStock);

module.exports = router;