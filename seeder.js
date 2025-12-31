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
   SAMPLE PRODUCTS (ENHANCED)
================================ */
const products = [
  // ===== MEN CLOTHING =====
  {
    name: 'Men Premium Jacket',
    description: 'A high-quality, stylish jacket for men.',
    price: 2000,
    originalPrice: 3999,
    image:
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
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
    image:
      'https://images.pexels.com/photos/297933/pexels-photo-297933.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.1,
    numReviews: 9,
    countInStock: 25,
    sizes: ['M', 'L', 'XL'],
    featured: false,
  },
  {
    name: 'Men Slim Fit Jeans',
    description: 'Stylish slim fit denim jeans.',
    price: 1799,
    originalPrice: 2499,
    image:
      'https://images.pexels.com/photos/52518/jeans-pants-blue-shop-52518.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing',
    rating: 4.3,
    numReviews: 18,
    countInStock: 30,
    sizes: ['S', 'M', 'L', 'XL'],
    featured: false,
  },

  // ===== WOMEN CLOTHING =====
  {
    name: 'Women Summer Dress',
    description: 'A comfortable and elegant summer dress.',
    price: 1500,
    originalPrice: 2299,
    image:
      'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.2,
    numReviews: 8,
    countInStock: 20,
    sizes: ['S', 'M', 'L'],
    featured: false,
  },
  {
    name: 'Women Kurti',
    description: 'Ethnic kurti suitable for casual and festive wear.',
    price: 1399,
    originalPrice: 1999,
    image:
      'https://images.pexels.com/photos/6311616/pexels-photo-6311616.jpeg?auto=compress&cs=tinysrgb&w=600',
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
    image:
      'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.6,
    numReviews: 22,
    countInStock: 10,
    sizes: ['M', 'L'],
    featured: false,
  },

  // ===== ELECTRONICS =====
  {
    name: 'Classic Laptop',
    description: 'A powerful laptop for work and entertainment.',
    price: 55000,
    originalPrice: 60000,
    image:
      'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600',
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
    image:
      'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.4,
    numReviews: 30,
    countInStock: 40,
    featured: false,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness smart watch with heart-rate tracking.',
    price: 3999,
    originalPrice: 6999,
    image:
      'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.5,
    numReviews: 19,
    countInStock: 22,
    featured: false,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass.',
    price: 2499,
    originalPrice: 3999,
    image:
      'https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Electronics',
    rating: 4.3,
    numReviews: 17,
    countInStock: 35,
    featured: false,
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
    console.log('Categories imported');

    // Map category name → category ID
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Attach category IDs to products
    const productsWithCategory = products.map((product) => ({
      ...product,
      category: categoryMap[product.categoryName],
    }));

    await Product.insertMany(productsWithCategory);
    console.log('Products imported');

    await User.insertMany(users);
    console.log('Users imported');

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
