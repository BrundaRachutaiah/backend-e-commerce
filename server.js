const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

/**
 * ✅ CORS CONFIGURATION (FIXED)
 * - Explicit origins
 * - Explicit custom headers (x-session-id)
 */
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://my-ecommerce-app-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow server-to-server / Postman requests
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-session-id'   // ✅ THIS FIXES YOUR ERROR
  ],
  credentials: true
}));

// ✅ Handle preflight OPTIONS requests
app.options('*', cors());

// Middleware
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
