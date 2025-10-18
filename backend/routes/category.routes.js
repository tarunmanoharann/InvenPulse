const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect, admin } = require('../middlewares/auth');

// Get all categories
router.get('/', categoryController.getAllCategories);

// Get category by ID
router.get('/:id', categoryController.getCategoryById);

// Create new category (admin only)
router.post('/', protect, admin, categoryController.createCategory);

// Update category (admin only)
router.put('/:id', protect, admin, categoryController.updateCategory);

// Delete category (admin only)
router.delete('/:id', protect, admin, categoryController.deleteCategory);

module.exports = router;