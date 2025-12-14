const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});

    // ✅ FRONTEND-FRIENDLY RESPONSE
    res.status(200).json({
      categories
    });

  } catch (error) {
    console.error('Categories API error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// GET single category by ID
router.get('/:categoryId', async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // ✅ FRONTEND-FRIENDLY RESPONSE
    res.status(200).json({
      category
    });

  } catch (error) {
    console.error('Category detail error:', error);
    res.status(500).json({ message: 'Failed to fetch category' });
  }
});

module.exports = router;
