const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// GET all products (with filters)
router.get('/', async (req, res) => {
  try {
    const { category, rating, sort, search, featured, limit = 20, page = 1 } = req.query;

    let query = {};

    // Filter by category (only if it's a valid ObjectId)
    if (category && isValidObjectId(category)) {
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
    } else if (sort === 'newest') {
      sortOptions.createdAt = -1;
    }

    // Pagination
    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// GET products on sale - MUST come before /:productId route
router.get('/sale', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Find products with discount
    const query = { discount: { $gt: 0 } };
    
    // Sorting
    let sortOptions = { discount: -1 }; // Sort by highest discount first

    // Pagination
    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products,
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Sale products error:', error);
    res.status(500).json({ message: 'Failed to fetch sale products' });
  }
});

// GET featured products - MUST come before /:productId route
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find({ featured: true })
      .populate('category')
      .limit(parseInt(limit));

    res.status(200).json({
      products
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
});

// GET recommended products - MUST come before /:productId route
router.get('/recommended/:productId', async (req, res) => {
  try {
    // Validate productId
    if (!isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.productId).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find products in the same category, excluding the current product
    const recommendedProducts = await Product.find({
      _id: { $ne: req.params.productId },
      category: product.category._id
    })
    .populate('category')
    .limit(4); // Limit to 4 recommended products

    res.status(200).json({
      products: recommendedProducts
    });
  } catch (error) {
    console.error('Recommended products error:', error);
    res.status(500).json({ message: 'Failed to fetch recommended products' });
  }
});

// GET single product by ID - MUST come after all specific routes
router.get('/:productId', async (req, res) => {
  try {
    // Validate productId
    if (!isValidObjectId(req.params.productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(req.params.productId)
      .populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      product
    });

  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;