const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
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

// GET orders by session ID
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const orders = await Order.find({ sessionId }).sort({ createdAt: -1 });
    
    res.json({
      data: {
        orders,
        sessionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET order by ID
router.get('/:orderId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the session
    if (order.sessionId !== sessionId) {
      return res.status(401).json({ message: 'Not authorized to access this order' });
    }
    
    res.json({
      data: {
        order,
        sessionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE new order
router.post('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { 
      orderItems, 
      shippingAddress, 
      paymentMethod = 'COD', 
      itemsPrice, 
      taxPrice = 0, 
      shippingPrice = 0 
    } = req.body;
    
    // Calculate total price
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    
    // Create new order
    const order = new Order({
      sessionId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    const createdOrder = await order.save();
    
    // Clear cart after placing order
    const cart = await Cart.findOne({ sessionId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    
    res.status(201).json({
      data: {
        order: createdOrder,
        sessionId,
        message: 'Order placed successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE order directly from product (Buy Now)
router.post('/buynow', async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { 
      productId, 
      quantity = 1, 
      size,
      shippingAddress, 
      paymentMethod = 'COD' 
    } = req.body;
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if size is available
    if (size && product.sizes.length > 0 && !product.sizes.includes(size)) {
      return res.status(400).json({ message: `Size ${size} is not available for this product` });
    }
    
    // Calculate prices
    const itemsPrice = product.price * quantity;
    const taxPrice = itemsPrice * 0.1; // 10% tax
    const shippingPrice = itemsPrice > 1000 ? 0 : 100; // Free shipping for orders over 1000
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    
    // Create order items
    const orderItems = [{
      product: productId,
      name: product.name,
      quantity,
      price: product.price,
      size
    }];
    
    // Create new order
    const order = new Order({
      sessionId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    const createdOrder = await order.save();
    
    res.status(201).json({
      data: {
        order: createdOrder,
        sessionId,
        message: 'Order placed successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE order status (admin only)
router.put('/:orderId/status', async (req, res) => {
  try {
    const { isPaid, paidAt, isDelivered, deliveredAt } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (isPaid !== undefined) {
      order.isPaid = isPaid;
      if (isPaid && !order.paidAt) {
        order.paidAt = paidAt || Date.now();
      }
    }
    
    if (isDelivered !== undefined) {
      order.isDelivered = isDelivered;
      if (isDelivered && !order.deliveredAt) {
        order.deliveredAt = deliveredAt || Date.now();
      }
    }
    
    const updatedOrder = await order.save();
    
    res.json({
      data: {
        order: updatedOrder,
        message: 'Order status updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;