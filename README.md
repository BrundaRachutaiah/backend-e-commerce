# 🛒 E-commerce Backend API

A scalable backend API for an e-commerce application that supports products, users, cart, orders and wishlist.

Built using **Node.js**, **Express.js**, and **MongoDB**.

---

### 🛍️ Products

* Fetch all products with filters (category, search, rating)
* Pagination & sorting
* Featured & sale products
* Recommended products

### 🗂️ Categories

* Fetch all categories
* Get category details

### 🛒 Cart

* Add items to cart
* Update cart items
* Remove items
* Clear cart

### ❤️ Wishlist

* Add/remove wishlist items
* View wishlist

### 📦 Orders

* Create orders
* Buy now feature
* View order history
* Update order status

### 📍 Address Management

* Add addresses
* Update/delete addresses

### ⭐ Reviews

* Add product reviews
* Update/delete reviews
* Rating system

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## ⚡ Installation & Setup

```bash
git clone https://github.com/BrundaRachutaiah/backend-e-commerce.git
cd backend-e-commerce-main
npm install
```

---

## ▶️ Run the Server

```bash
node index.js
```

Server will run at:

```
http://localhost:5000
```

---

### 🗂️ Categories

GET /api/categories
List all categories

GET /api/categories/:categoryId
Get single category

---

### 🛍️ Products

GET /api/products
List all products (filters, search, pagination)

GET /api/products/:productId
Get product details

GET /api/products/sale
Get sale products

GET /api/products/featured
Get featured products

GET /api/products/recommended/:productId
Get recommended products

---

### 🛒 Cart

GET /api/cart
Get cart

POST /api/cart/add
Add item to cart

PUT /api/cart/update
Update cart item

DELETE /api/cart/remove/:productId
Remove item

DELETE /api/cart/clear
Clear cart

---

### ❤️ Wishlist

GET /api/wishlist
Get wishlist

POST /api/wishlist/add
Add item

DELETE /api/wishlist/remove/:productId
Remove item

---

### 📦 Orders

GET /api/orders
Get all orders

GET /api/orders/:orderId
Get single order

POST /api/orders
Create order

POST /api/orders/buynow
Buy product directly

PUT /api/orders/:orderId/status
Update order status

---

### 📍 Address

GET /api/addresses
Get addresses

POST /api/addresses/add
Add address

PUT /api/addresses/:addressId
Update address

DELETE /api/addresses/:addressId
Delete address

---

### ⭐ Reviews

GET /api/reviews/product/:productId
Get product reviews

POST /api/reviews/product/:productId
Add review (Protected)

PUT /api/reviews/:reviewId
Update review (Protected)

DELETE /api/reviews/:reviewId
Delete review (Protected)

---

## 🌱 Seeder

To populate database with sample data:

```bash
node seeder.js
```

---

## 📂 Project Structure

```
backend-e-commerce-main/
│── config/
│── middleware/
│── models/
│── routes/
│── server.js
│── seeder.js
│── package.json
```

---

## 📬 Contact

For bugs or feature requests:

[brundadr315@gmail.com](mailto:brundadr315@gmail.com)

---

## ⭐ Future Improvements

* Payment integration 💳
* Admin dashboard
* Frontend integration
* Advanced analytics
