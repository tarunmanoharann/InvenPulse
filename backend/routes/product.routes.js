const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth');

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Create new product (admin only)
router.post('/', protect, admin, productController.createProduct);

// Update product (admin only)
router.put('/:id', protect, admin, productController.updateProduct);

// Delete product (admin only)
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;