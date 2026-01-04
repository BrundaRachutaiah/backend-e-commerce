const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

// Helper function to get or create a session ID
const getSessionId = (req) => {
  let sessionId = req.headers["x-session-id"];
  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }
  return sessionId;
};

// ============================
// GET ADDRESSES
// ============================
router.get("/", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    console.log("GET addresses for session:", sessionId);

    let addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      addressDoc = new Address({ sessionId, addresses: [] });
      await addressDoc.save();
      console.log("Created new address document for session:", sessionId);
    }

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
      },
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);
    res.status(500).json({ 
      message: error.message || "Failed to fetch addresses",
      error: error.toString()
    });
  }
});

// ============================
// ADD ADDRESS  ✅ FIXED
// ============================
router.post("/add", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    console.log("POST add address for session:", sessionId);
    console.log("Request body:", req.body);

    const {
      name,
      phone,            // ✅ REQUIRED
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,       // ✅ REQUIRED
      country,
      isDefault = false,
    } = req.body;

    // 🔒 SERVER-SIDE VALIDATION
    if (
      !name ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      console.error("Validation failed - missing fields");
      return res.status(400).json({
        message: "All required address fields must be provided",
        missing: {
          name: !name,
          phone: !phone,
          addressLine1: !addressLine1,
          city: !city,
          state: !state,
          postalCode: !postalCode,
          country: !country
        }
      });
    }

    let addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      console.log("Creating new address document");
      addressDoc = new Address({ sessionId, addresses: [] });
    }

    if (isDefault) {
      addressDoc.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // Create a new address object
    const newAddress = {
      name,
      phone,            // ✅ SAVED
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    console.log("Adding new address:", newAddress);

    // Add the new address to the addresses array
    addressDoc.addresses.push(newAddress);

    // Save the document with error handling
    try {
      await addressDoc.save();
      console.log("Address saved successfully");
    } catch (saveError) {
      console.error("Error saving address:", saveError);
      return res.status(500).json({
        message: "Failed to save address to database",
        error: saveError.message
      });
    }

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: "Address added successfully",
      },
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);
    res.status(500).json({ 
      message: error.message || "Failed to add address",
      error: error.toString()
    });
  }
});

// ============================
// UPDATE ADDRESS
// ============================
router.put("/:addressId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);
    const { addressId } = req.params;

    const {
      name,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault = false,
    } = req.body;

    // 🔒 SERVER-SIDE VALIDATION
    if (
      !name ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({
        message: "All required address fields must be provided",
      });
    }

    const addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }

    // Find the address to update
    const addressToUpdate = addressDoc.addresses.id(addressId);
    if (!addressToUpdate) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      addressDoc.addresses.forEach((addr) => (addr.isDefault = false));
    }

    // Update the address fields
    addressToUpdate.name = name;
    addressToUpdate.phone = phone;
    addressToUpdate.addressLine1 = addressLine1;
    addressToUpdate.addressLine2 = addressLine2;
    addressToUpdate.city = city;
    addressToUpdate.state = state;
    addressToUpdate.postalCode = postalCode;
    addressToUpdate.country = country;
    addressToUpdate.isDefault = isDefault;

    await addressDoc.save();

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: "Address updated successfully",
      },
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);
    res.status(500).json({ 
      message: error.message || "Failed to update address",
      error: error.toString()
    });
  }
});

// ============================
// DELETE ADDRESS
// ============================
router.delete("/:addressId", async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    const addressDoc = await Address.findOne({ sessionId });
    if (!addressDoc) {
      return res.status(404).json({ message: "Address document not found" });
    }

    addressDoc.addresses = addressDoc.addresses.filter(
      (addr) => addr._id.toString() !== req.params.addressId
    );

    await addressDoc.save();

    res.json({
      data: {
        addresses: addressDoc.addresses,
        sessionId,
        message: "Address deleted successfully",
      },
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);
    res.status(500).json({ 
      message: error.message || "Failed to delete address",
      error: error.toString()
    });
  }
});

module.exports = router;