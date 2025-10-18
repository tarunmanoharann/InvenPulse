const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { protect, admin } = require('../middlewares/auth');

// Get all suppliers
router.get('/', supplierController.getAllSuppliers);

// Get supplier by ID
router.get('/:id', supplierController.getSupplierById);

// Create new supplier (admin only)
router.post('/', protect, admin, supplierController.createSupplier);

// Update supplier (admin only)
router.put('/:id', protect, admin, supplierController.updateSupplier);

// Delete supplier (admin only)
router.delete('/:id', protect, admin, supplierController.deleteSupplier);

module.exports = router;