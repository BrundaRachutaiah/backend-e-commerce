const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ==============================
// GET ALL PRODUCTS (WITH FILTERS)
// ==============================
router.get('/', async (req, res) => {
  try {
    const {
      category,
      rating,
      sort,
      search,
      featured,
      limit = 20,
      page = 1
    } = req.query;

    let query = {};

    /* ============================
       CATEGORY FILTER (FIXED)
       Supports single & multiple
    ============================ */
    if (category) {
      const categoryIds = category
        .split(',')
        .filter(id => isValidObjectId(id));

      if (categoryIds.length > 0) {
        query.category = { $in: categoryIds };
      }
    }

    /* ============================
       RATING FILTER
    ============================ */
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    /* ============================
       FEATURED FILTER
    ============================ */
    if (featured === 'true') {
      query.featured = true;
    }

    /* ============================
       SEARCH FILTER
    ============================ */
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    /* ============================
       SORTING
    ============================ */
    let sortOptions = {};
    switch (sort) {
      case 'price_low_high':
        sortOptions.price = 1;
        break;
      case 'price_high_low':
        sortOptions.price = -1;
        break;
      case 'rating_high_low':
        sortOptions.rating = -1;
        break;
      case 'newest':
        sortOptions.createdAt = -1;
        break;
      default:
        break;
    }

    /* ============================
       PAGINATION
    ============================ */
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      data: {
        products,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });

  } catch (error) {
    console.error('Products API error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

/* ==============================
   GET SALE PRODUCTS
============================== */
router.get('/sale', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const query = { discount: { $gt: 0 } };
    const sortOptions = { discount: -1 };

    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;

    const products = await Product.find(query)
      .populate('category')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    console.error('Sale products error:', error);
    res.status(500).json({ message: 'Failed to fetch sale products' });
  }
});

/* ==============================
   GET FEATURED PRODUCTS
============================== */
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({ featured: true })
      .populate('category')
      .limit(parseInt(limit));

    res.status(200).json({
      data: { products }
    });
  } catch (error) {
    console.error('Featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
});

/* ==============================
   GET RECOMMENDED PRODUCTS
============================== */
router.get('/recommended/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId).populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const recommendedProducts = await Product.find({
      _id: { $ne: productId },
      category: product.category._id
    })
      .populate('category')
      .limit(4);

    res.status(200).json({
      data: { products: recommendedProducts }
    });
  } catch (error) {
    console.error('Recommended products error:', error);
    res.status(500).json({ message: 'Failed to fetch recommended products' });
  }
});

/* ==============================
   GET SINGLE PRODUCT
============================== */
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId)
      .populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      data: { product }
    });
  } catch (error) {
    console.error('Product detail error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;