const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper function to get or create a session ID
const getSessionId = (req) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return sessionId;
};

// GET cart by session ID
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    let cart = await Cart.findOne({ sessionId })
      .populate('items.product');

    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      await cart.save();
    }

    res.json({
      data: {
        cart,
        sessionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD item to cart
router.post('/add', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json({
      data: {
        cart,
        sessionId,
        message: 'Item added to cart successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE cart item quantity
router.put('/update', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { productId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than zero' });
    }

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.json({
      data: {
        cart,
        sessionId,
        message: 'Cart updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// REMOVE item from cart
router.delete('/remove/:productId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const cart = await Cart.findOne({ sessionId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== req.params.productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.json({
      data: {
        cart,
        sessionId,
        message: 'Item removed from cart successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
