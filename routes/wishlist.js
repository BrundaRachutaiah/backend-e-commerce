const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Helper function to get or create a session ID
const getSessionId = (req) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return sessionId;
};

// GET wishlist by session ID
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    let wishlist = await Wishlist.findOne({ sessionId })
      .populate('items.product');

    if (!wishlist) {
      wishlist = new Wishlist({ sessionId, items: [] });
      await wishlist.save();
    }

    res.json({
      data: {
        wishlist: wishlist.items,
        sessionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD item to wishlist
router.post('/add', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ sessionId });
    if (!wishlist) {
      wishlist = new Wishlist({ sessionId, items: [] });
    }

    const exists = wishlist.items.find(
      item => item.product.toString() === productId
    );

    if (exists) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    wishlist.items.push({ product: productId });
    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      data: {
        wishlist: wishlist.items,
        sessionId,
        message: 'Item added to wishlist successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE item from wishlist
router.delete('/remove/:productId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const wishlist = await Wishlist.findOne({ sessionId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await wishlist.save();
    await wishlist.populate('items.product');

    res.json({
      data: {
        wishlist: wishlist.items,
        sessionId,
        message: 'Item removed from wishlist successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
