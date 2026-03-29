# E-Commerce Backend API

A full-stack e-commerce backend REST API for managing products, categories, cart, wishlist, orders, addresses, reviews, and user authentication.
Built with **Node.js**, **Express 4**, **MongoDB (Mongoose)**, and **JWT authentication** — deployed on **Vercel**.

---

## 🔗 Live API

**Base URL:** `https://backend-e-commerce-beta.vercel.app/api`

**Frontend:** [https://ecommerce-frontend-phi-pink.vercel.app](https://ecommerce-frontend-phi-pink.vercel.app)

---

## ⚡ Quick Start

```bash
git clone https://github.com/BrundaRachutaiah/backend-e-commerce.git
cd backend-e-commerce
npm install
```

Start the server:

```bash
node server.js
```

Server runs at `http://localhost:5000`

---

## 🛠️ Technologies

| Layer        | Tech                        |
|--------------|-----------------------------|
| Runtime      | Node.js                     |
| Framework    | Express 4                   |
| Database     | MongoDB + Mongoose 7        |
| Auth         | JWT (jsonwebtoken) + bcryptjs |
| Config       | dotenv                      |
| CORS         | cors                        |
| Deployment   | Vercel                      |

---

## 📁 Project Structure

```
backend-e-commerce-main/
├── config/
│   └── db.js                  # MongoDB connection
├── middleware/
│   ├── auth.js                # JWT protect middleware
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # User schema + bcrypt hooks
│   ├── Product.js             # Product schema
│   ├── Category.js            # Category schema
│   ├── Cart.js                # Session-based cart
│   ├── Wishlist.js            # Session-based wishlist
│   ├── Order.js               # Order schema
│   ├── Address.js             # Session-based addresses
│   └── Review.js              # Product review schema
├── routes/
│   ├── users.js               # Register, login, profile
│   ├── products.js            # Product listing + filters
│   ├── categories.js          # Category listing
│   ├── cart.js                # Cart CRUD
│   ├── wishlist.js            # Wishlist CRUD
│   ├── orders.js              # Order management
│   ├── addresses.js           # Address management
│   └── reviews.js             # Product reviews
├── seeder.js                  # Database seed script
└── server.js                  # Entry point
```
## 🌐 API Reference

### 👤 Users — `/api/users`

#### `POST /api/users/register`
Register a new user.

**Request Body:**
```json
{ "name": "John Doe", "email": "john@example.com", "password": "secret123", "phone": "9876543210" }
```

**Response `201`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "phone": "9876543210" }
  }
}
```

---

#### `POST /api/users/login`
Login an existing user.

**Request Body:**
```json
{ "email": "john@example.com", "password": "secret123" }
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

---

#### `GET /api/users/profile` 🔒 Protected
Get the logged-in user's profile with linked addresses.

**Response `200`:**
```json
{ "success": true, "data": { "user": { "id": "...", "name": "John Doe", "email": "...", "addresses": [] } } }
```

---

### 🛍️ Products — `/api/products`

#### `GET /api/products`
Fetch all products with optional filters, sorting, and pagination.

**Query Parameters:**

| Param      | Type   | Description                                              |
|------------|--------|----------------------------------------------------------|
| `category` | String | Comma-separated category IDs                            |
| `rating`   | Number | Minimum rating filter                                   |
| `search`   | String | Search by name or description (case-insensitive)        |
| `featured` | Boolean| `true` to fetch only featured products                 |
| `sort`     | String | `price_low_high`, `price_high_low`, `rating_high_low`, `newest` |
| `page`     | Number | Page number (default: `1`)                              |
| `limit`    | Number | Results per page (default: `20`)                        |

**Response `200`:**
```json
{
  "data": {
    "products": [{ "_id": "...", "name": "Blue T-Shirt", "price": 499, "discount": 10, "rating": 4.2 }],
    "pagination": { "page": 1, "limit": 20, "total": 50, "pages": 3 }
  }
}
```

---

#### `GET /api/products/featured`
Returns featured products. Accepts `?limit=` query param.

#### `GET /api/products/sale`
Returns products with a discount greater than 0, sorted by highest discount. Supports `?limit=` and `?page=`.

#### `GET /api/products/recommended/:productId`
Returns up to 4 products from the same category as the given product.

#### `GET /api/products/:productId`
Returns full details for a single product.

---

### 🗂️ Categories — `/api/categories`

#### `GET /api/categories`
Returns all categories.

**Response `200`:**
```json
{ "data": { "categories": [{ "_id": "...", "name": "Men", "image": "https://..." }] } }
```

#### `GET /api/categories/:categoryId`
Returns a single category by ID.

---

### 🛒 Cart — `/api/cart`
> All cart routes use `x-session-id` header for session tracking.

#### `GET /api/cart`
Fetch the current session's cart (auto-creates if not found).

**Response `200`:**
```json
{ "data": { "cart": { "items": [{ "product": { "..." }, "quantity": 2, "size": "M" }] }, "sessionId": "..." } }
```

#### `POST /api/cart/add`
Add a product to the cart. Validates stock and size availability.

**Request Body:**
```json
{ "productId": "abc123", "quantity": 1, "size": "M" }
```

#### `PUT /api/cart/update`
Update the quantity of an item already in the cart.

**Request Body:**
```json
{ "productId": "abc123", "quantity": 3, "size": "M" }
```

#### `DELETE /api/cart/remove/:productId`
Remove a specific item from the cart. Optionally pass `?size=M` as query param.

#### `DELETE /api/cart/clear`
Clear all items from the cart.

---

### ❤️ Wishlist — `/api/wishlist`
> All wishlist routes use `x-session-id` header.

#### `GET /api/wishlist`
Fetch the wishlist for the current session.

#### `POST /api/wishlist/add`
Add a product to the wishlist.

**Request Body:**
```json
{ "productId": "abc123" }
```

#### `DELETE /api/wishlist/remove/:productId`
Remove a product from the wishlist.

---

### 📦 Orders — `/api/orders`
> All order routes use `x-session-id` header.

#### `GET /api/orders`
Fetch all orders for the current session (newest first).

#### `GET /api/orders/:orderId`
Fetch a single order by ID (session-validated).

#### `POST /api/orders`
Place an order from existing cart items. Validates stock, calculates total, decrements stock, and clears the cart.

**Request Body:**
```json
{
  "orderItems": [{ "product": "abc123", "name": "Blue T-Shirt", "quantity": 2, "price": 499, "size": "M" }],
  "shippingAddress": { "name": "John", "phone": "9876543210", "addressLine1": "123 Main St", "city": "Mumbai", "state": "MH", "postalCode": "400001", "country": "India" },
  "paymentMethod": "COD",
  "itemsPrice": 998,
  "taxPrice": 99.8,
  "shippingPrice": 0
}
```

**Response `201`:**
```json
{ "data": { "order": { "_id": "...", "totalPrice": 1097.8, "isPaid": false, "isDelivered": false }, "message": "Order placed successfully" } }
```

#### `POST /api/orders/buynow`
Place an order directly from a single product (Buy Now). Auto-calculates 10% tax and free shipping for orders over ₹1000.

**Request Body:**
```json
{ "productId": "abc123", "quantity": 1, "size": "L", "shippingAddress": { "..." }, "paymentMethod": "COD" }
```

#### `PUT /api/orders/:orderId/status`
Update payment and delivery status of an order (admin use).

**Request Body:**
```json
{ "isPaid": true, "isDelivered": false }
```

---

### 📍 Addresses — `/api/addresses`
> All address routes use `x-session-id` header.

#### `GET /api/addresses`
Fetch all saved addresses for the current session.

#### `POST /api/addresses/add`
Add a new address. All fields except `addressLine2` are required.

**Request Body:**
```json
{
  "name": "John Doe", "phone": "9876543210",
  "addressLine1": "123 Main St", "addressLine2": "Apt 4B",
  "city": "Mumbai", "state": "MH", "postalCode": "400001",
  "country": "India", "isDefault": true
}
```

#### `PUT /api/addresses/:addressId`
Update an existing address by its ID.

#### `DELETE /api/addresses/:addressId`
Delete an address by its ID.

---

### ⭐ Reviews — `/api/reviews`

#### `GET /api/reviews/product/:productId`
Fetch all reviews for a product with pagination and rating distribution.

**Query Params:** `?page=1&limit=10&sort=newest` (sort options: `newest`, `oldest`, `rating_high`, `rating_low`)

**Response `200`:**
```json
{
  "data": {
    "reviews": [{ "_id": "...", "rating": 5, "title": "Great!", "comment": "...", "isVerifiedPurchase": true }],
    "pagination": { "page": 1, "limit": 10, "total": 25, "pages": 3 },
    "ratingDistribution": [{ "_id": 5, "count": 10 }, { "_id": 4, "count": 8 }]
  }
}
```

#### `POST /api/reviews/product/:productId` 🔒 Protected
Submit a review. Checks for duplicate reviews and auto-sets `isVerifiedPurchase` if the user has a paid order for this product. Also updates the product's average rating.

**Request Body:**
```json
{ "rating": 5, "title": "Excellent quality!", "comment": "Loved the fabric and fit." }
```

#### `PUT /api/reviews/:reviewId` 🔒 Protected
Update your own review. Recalculates product average rating.

#### `DELETE /api/reviews/:reviewId` 🔒 Protected
Delete your own review. Recalculates product average rating.

---

## 🗃️ Data Models

### Product

| Field          | Type     | Required | Notes                            |
|----------------|----------|----------|----------------------------------|
| `name`         | String   | ✅ Yes   |                                  |
| `description`  | String   | ✅ Yes   |                                  |
| `price`        | Number   | ✅ Yes   |                                  |
| `originalPrice`| Number   | —        |                                  |
| `discount`     | Number   | —        | Default: `0`                     |
| `image`        | String   | ✅ Yes   |                                  |
| `category`     | ObjectId | ✅ Yes   | Ref: `Category`                  |
| `rating`       | Number   | —        | Default: `0`, Range: 0–5         |
| `numReviews`   | Number   | —        | Default: `0`                     |
| `countInStock` | Number   | ✅ Yes   | Default: `0`                     |
| `sizes`        | [String] | —        |                                  |
| `featured`     | Boolean  | —        | Default: `false`                 |

### User

| Field       | Type       | Required | Notes                           |
|-------------|------------|----------|---------------------------------|
| `name`      | String     | ✅ Yes   |                                 |
| `email`     | String     | ✅ Yes   | Must be unique                  |
| `password`  | String     | ✅ Yes   | bcrypt hashed before save       |
| `phone`     | String     | —        |                                 |
| `isAdmin`   | Boolean    | —        | Default: `false`                |
| `addresses` | [ObjectId] | —        | Ref: `Address`                  |

### Order

| Field             | Type     | Required | Notes                            |
|-------------------|----------|----------|----------------------------------|
| `sessionId`       | String   | ✅ Yes   |                                  |
| `orderItems`      | Array    | —        | `[{ product, name, quantity, price, size }]` |
| `shippingAddress` | Object   | —        | Embedded address object          |
| `paymentMethod`   | String   | ✅ Yes   | e.g. `"COD"`                    |
| `itemsPrice`      | Number   | ✅ Yes   |                                  |
| `taxPrice`        | Number   | ✅ Yes   | Default: `0`                     |
| `shippingPrice`   | Number   | ✅ Yes   | Default: `0`                     |
| `totalPrice`      | Number   | ✅ Yes   |                                  |
| `isPaid`          | Boolean  | —        | Default: `false`                 |
| `isDelivered`     | Boolean  | —        | Default: `false`                 |

---

## 🌱 Database Seeder

Seed the database with sample categories, products, and users:

```bash
node seeder.js
```

---

## 📹 Demo Video

Watch a full walkthrough of all features: [Loom Video Link](#)

---

## 📬 Contact

For bugs or feature requests, please open an issue or reach out at: `brundadr315@gmail.com`
