const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); // Added missing import
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// GET reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    
    // Sorting options
    let sortOptions = {};
    if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'oldest') {
      sortOptions.createdAt = 1;
    } else if (sort === 'rating_high') {
      sortOptions.rating = -1;
    } else if (sort === 'rating_low') {
      sortOptions.rating = 1;
    }
    
    // Pagination
    const limitNum = parseInt(limit);
    const skip = (parseInt(page) - 1) * limitNum;
    
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort(sortOptions)
      .limit(limitNum)
      .skip(skip);
    
    // Get total count for pagination
    const total = await Review.countDocuments({ product: req.params.productId });
    
    // Calculate rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { product: mongoose.Types.ObjectId(req.params.productId) } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    
    res.json({
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        },
        ratingDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a review for a product (protected route)
router.post('/product/:productId', protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const productId = req.params.productId;
    const userId = req.user.id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }
    
    // Check if user has purchased this product
    const hasPurchased = await Order.findOne({
      'orderItems.product': productId,
      'sessionId': req.headers['x-session-id'] || '',
      isPaid: true
    });
    
    // Create new review
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!hasPurchased
    });
    
    const createdReview = await review.save();
    
    // Update product's rating and numReviews
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;
    
    await Product.findByIdAndUpdate(productId, {
      numReviews,
      rating: avgRating
    });
    
    // Populate user info for response
    await createdReview.populate('user', 'name');
    
    res.status(201).json({
      data: {
        review: createdReview,
        message: 'Review added successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE a review (protected route)
router.put('/:reviewId', protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to update this review' });
    }
    
    // Update review
    review.rating = rating;
    review.title = title;
    review.comment = comment;
    
    const updatedReview = await review.save();
    
    // Update product's rating
    const productId = review.product;
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = allReviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;
    
    await Product.findByIdAndUpdate(productId, {
      numReviews,
      rating: avgRating
    });
    
    // Populate user info for response
    await updatedReview.populate('user', 'name');
    
    res.json({
      data: {
        review: updatedReview,
        message: 'Review updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a review (protected route)
router.delete('/:reviewId', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this review' });
    }
    
    const productId = review.product;
    await review.remove();
    
    // Update product's rating
    const allReviews = await Review.find({ product: productId });
    const numReviews = allReviews.length;
    const avgRating = numReviews > 0 
      ? allReviews.reduce((acc, item) => acc + item.rating, 0) / numReviews 
      : 0;
    
    await Product.findByIdAndUpdate(productId, {
      numReviews,
      rating: avgRating
    });
    
    res.json({ 
      data: {
        message: 'Review deleted successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;