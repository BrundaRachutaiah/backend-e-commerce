const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
router.get('/', async (req, res) => {
  try {
    const { category, rating, sort, search } = req.query;
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOptions = {};
    
    // Sort by price
    if (sort === 'price_low_high') {
      sortOptions.price = 1;
    } else if (sort === 'price_high_low') {
      sortOptions.price = -1;
    } else if (sort === 'rating_high_low') {
      sortOptions.rating = -1;
    }
    
    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions);
    
    res.json({
      data: {
        products
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      data: {
        product
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;