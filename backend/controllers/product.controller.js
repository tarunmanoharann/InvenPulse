const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('supplier', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, supplier } = req.body;
    
    // Check if product with SKU already exists
    if (sku) {
      const productExists = await Product.findOne({ sku });
      if (productExists) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }
    
    const product = await Product.create({
      name,
      description,
      sku,
      category,
      price,
      quantity,
      supplier
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, sku, category, price, quantity, supplier } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if updated SKU already exists on another product
    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        return res.status(400).json({ message: 'Product with this SKU already exists' });
      }
    }
    
    product.name = name || product.name;
    product.description = description || product.description;
    product.sku = sku || product.sku;
    product.category = category || product.category;
    product.price = price !== undefined ? price : product.price;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.supplier = supplier || product.supplier;
    product.updatedAt = Date.now();
    
    const updatedProduct = await product.save();
    
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};