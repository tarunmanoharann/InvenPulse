const StockMovement = require('../models/StockMovement');
const Product = require('../models/Product');

// Get all stock movements
exports.getAllStockMovements = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find()
      .populate('product', 'name sku')
      .populate('createdBy', 'username')
      .sort({ date: -1 });
    res.json(stockMovements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock movement by ID
exports.getStockMovementById = async (req, res) => {
  try {
    const stockMovement = await StockMovement.findById(req.params.id)
      .populate('product', 'name sku')
      .populate('createdBy', 'username');
    
    if (!stockMovement) {
      return res.status(404).json({ message: 'Stock movement not found' });
    }
    
    res.json(stockMovement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new stock movement
exports.createStockMovement = async (req, res) => {
  try {
    const { product: productId, type, quantity, reason } = req.body;
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create stock movement
    const stockMovement = await StockMovement.create({
      product: productId,
      type,
      quantity,
      reason,
      createdBy: req.user._id
    });
    
    // Update product quantity
    if (type === 'in') {
      product.quantity += quantity;
    } else if (type === 'out') {
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      product.quantity -= quantity;
    }
    
    product.updatedAt = Date.now();
    await product.save();
    
    res.status(201).json(stockMovement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get stock movements by product
exports.getStockMovementsByProduct = async (req, res) => {
  try {
    const stockMovements = await StockMovement.find({ product: req.params.productId })
      .populate('product', 'name sku')
      .populate('createdBy', 'username')
      .sort({ date: -1 });
    
    res.json(stockMovements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};