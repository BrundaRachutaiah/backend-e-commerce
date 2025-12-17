const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token exists
      if (!token) {
        return res.status(401).json({
          message: 'Not authorized, no token',
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          message: 'Not authorized, user not found',
        });
      }

      return next();
    } catch (error) {
      console.error(error);
      // Handle different JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          message: 'Not authorized, invalid token',
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          message: 'Not authorized, token expired',
        });
      } else {
        return res.status(401).json({
          message: 'Not authorized, token failed',
        });
      }
    }
  }

  // If token not found at all
  return res.status(401).json({
    message: 'Not authorized, no token',
  });
};

module.exports = { protect };