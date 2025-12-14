const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, rating, sort, search, featured } = req.query;

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter featured products
    if (featured === 'true') {
      query.featured = true;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Sorting
    let sortOptions = {};
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

    // ✅ FRONTEND-FRIENDLY RESPONSE
    res.status(200).json({
      products
    });

  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET single product by ID
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
      .populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // ✅ FRONTEND-FRIENDLY RESPONSE
    res.status(200).json({
      product
    });

  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;
