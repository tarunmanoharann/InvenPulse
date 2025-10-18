const express = require('express');
const router = express.Router();
const stockMovementController = require('../controllers/stockMovement.controller');
const { protect } = require('../middlewares/auth');

// Get all stock movements
router.get('/', protect, stockMovementController.getAllStockMovements);

// Get stock movement by ID
router.get('/:id', protect, stockMovementController.getStockMovementById);

// Create new stock movement
router.post('/', protect, stockMovementController.createStockMovement);

// Get stock movements by product
router.get('/product/:productId', protect, stockMovementController.getStockMovementsByProduct);

module.exports = router;