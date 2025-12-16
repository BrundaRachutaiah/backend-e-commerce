const express = require('express');
const router = express.Router();
const Address = require('../models/Address');

// Helper function to get or create a session ID
const getSessionId = (req) => {
  let sessionId = req.headers['x-session-id'];
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  return sessionId;
};

// GET addresses by session ID
router.get('/', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    let addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      addressDoc = new Address({ sessionId, addresses: [] });
      await addressDoc.save();
    }

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD new address
router.post('/add', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const {
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault = false
    } = req.body;

    let addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      addressDoc = new Address({ sessionId, addresses: [] });
    }

    if (isDefault) {
      addressDoc.addresses.forEach(addr => (addr.isDefault = false));
    }

    addressDoc.addresses.push({
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault
    });

    await addressDoc.save();

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: 'Address added successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE address
router.put('/:addressId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const {
      name,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault = false
    } = req.body;

    const addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      return res.status(404).json({ message: 'Address document not found' });
    }

    const address = addressDoc.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    if (isDefault) {
      addressDoc.addresses.forEach(addr => (addr.isDefault = false));
    }

    address.name = name;
    address.addressLine1 = addressLine1;
    address.addressLine2 = addressLine2;
    address.city = city;
    address.state = state;
    address.postalCode = postalCode;
    address.country = country;
    address.isDefault = isDefault;

    await addressDoc.save();

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: 'Address updated successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE address
router.delete('/:addressId', async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      return res.status(404).json({ message: 'Address document not found' });
    }

    addressDoc.addresses = addressDoc.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );

    await addressDoc.save();

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: 'Address deleted successfully'
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
