// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

// Load environment variables
dotenv.config();

/* ===============================
   SAMPLE CATEGORIES
================================ */
const categories = [
  {
    name: 'Men Clothing',
    description: 'Apparel and fashion products for men',
  },
  {
    name: 'Women Clothing',
    description: 'Stylish and trendy apparel for women',
  },
  {
    name: 'Electronics',
    description: 'Electronic gadgets and accessories',
  },
];

/* ===============================
   SAMPLE PRODUCTS (EXPANDED)
================================ */
const products = [
  // ===== MEN CLOTHING =====
  {
    name: 'Men Premium Jacket',
    description: 'A high-quality, stylish jacket for men.',
    price: 2000,
    originalPrice: 3999,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.5,
    numReviews: 12,
    countInStock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    name: 'Men Casual Shirt',
    description: 'Comfortable cotton casual shirt for daily wear.',
    price: 1299,
    originalPrice: 1999,
    image: 'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.1,
    numReviews: 9,
    countInStock: 25,
    sizes: ['M', 'L', 'XL'],
  },
  {
    name: 'Men Slim Fit Jeans',
    description: 'Stylish slim fit denim jeans.',
    price: 1799,
    originalPrice: 2499,
    image: 'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.3,
    numReviews: 18,
    countInStock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Men Hoodie',
    description: 'Warm hoodie suitable for winter wear.',
    price: 1599,
    originalPrice: 2599,
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.2,
    numReviews: 11,
    countInStock: 20,
    sizes: ['M', 'L', 'XL'],
  },
  {
    name: 'Men Sports T-Shirt',
    description: 'Breathable sports t-shirt for workouts.',
    price: 799,
    originalPrice: 1299,
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.0,
    numReviews: 7,
    countInStock: 40,
    sizes: ['S', 'M', 'L'],
  },

  // ===== WOMEN CLOTHING =====
  {
    name: 'Women Summer Dress',
    description: 'A comfortable and elegant summer dress.',
    price: 1500,
    originalPrice: 2299,
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.2,
    numReviews: 8,
    countInStock: 20,
    sizes: ['S', 'M', 'L'],
  },
  {
    name: 'Women Kurti',
    description: 'Ethnic kurti suitable for casual and festive wear.',
    price: 1399,
    originalPrice: 1999,
    image: 'https://images.pexels.com/photos/6311616/pexels-photo-6311616.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.4,
    numReviews: 14,
    countInStock: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    name: 'Women Denim Jacket',
    description: 'Trendy denim jacket for women.',
    price: 2499,
    originalPrice: 3499,
    image: 'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.6,
    numReviews: 22,
    countInStock: 10,
    sizes: ['M', 'L'],
  },
  {
    name: 'Women Leggings',
    description: 'Comfortable stretchable leggings.',
    price: 699,
    originalPrice: 1199,
    image: 'https://images.pexels.com/photos/6311571/pexels-photo-6311571.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.1,
    numReviews: 10,
    countInStock: 35,
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'Women Top',
    description: 'Casual stylish top for women.',
    price: 899,
    originalPrice: 1499,
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.3,
    numReviews: 16,
    countInStock: 28,
    sizes: ['S', 'M', 'L'],
  },

  // ===== ELECTRONICS =====
  {
    name: 'Classic Laptop',
    description: 'A powerful laptop for work and entertainment.',
    price: 55000,
    originalPrice: 60000,
    image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.8,
    numReviews: 25,
    countInStock: 8,
    featured: true,
  },
  {
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones.',
    price: 2999,
    originalPrice: 4999,
    image: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.4,
    numReviews: 30,
    countInStock: 40,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness smart watch with heart-rate tracking.',
    price: 3999,
    originalPrice: 6999,
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.5,
    numReviews: 19,
    countInStock: 22,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass.',
    price: 2499,
    originalPrice: 3999,
    image: 'https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.3,
    numReviews: 17,
    countInStock: 35,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse.',
    price: 699,
    originalPrice: 1299,
    image: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.2,
    numReviews: 14,
    countInStock: 50,
  },
];

/* ===============================
   SAMPLE USERS
================================ */
const users = [
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
  },
];

/* ===============================
   DATABASE CONNECTION
================================ */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

/* ===============================
   IMPORT DATA
================================ */
const importData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Existing data cleared');

    const createdCategories = await Category.insertMany(categories);

    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    const productsWithCategory = products.map((product) => ({
      ...product,
      category: categoryMap[product.categoryName],
    }));

    await Product.insertMany(productsWithCategory);
    await User.insertMany(users);

    console.log('✅ Data imported successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

/* ===============================
   DESTROY DATA
================================ */
const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('🔥 Data destroyed successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error}`);
    process.exit(1);
  }
};

/* ===============================
   COMMAND HANDLER
================================ */
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}