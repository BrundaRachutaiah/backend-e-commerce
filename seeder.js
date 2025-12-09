// seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Sample data
const categories = [
  { name: 'Men Clothing', description: 'Apparel for men' },
  { name: 'Women Clothing', description: 'Apparel for women' },
  { name: 'Electronics', description: 'Gadgets and devices' },
];

const products = [
  {
    name: 'Men Premium Jacket',
    description: 'A high-quality, stylish jacket for men.',
    price: 2000,
    originalPrice: 3999,
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Men Clothing', // We'll use this to link to the category
    rating: 4.5,
    numReviews: 12,
    countInStock: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
  },
  {
    name: 'Classic Laptop',
    description: 'A powerful laptop for work and play.',
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
    name: 'Women Summer Dress',
    description: 'A comfortable and elegant dress for summer.',
    price: 1500,
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=600',
    categoryName: 'Women Clothing',
    rating: 4.2,
    numReviews: 8,
    countInStock: 20,
    sizes: ['S', 'M', 'L'],
    featured: false,
  },
];

const users = [
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phone: '1234567890',
  },
];

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const importData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data cleared...');

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories imported!');

    // Create a map for category names to their IDs
    const categoryMap = createdCategories.reduce((map, category) => {
      map[category.name] = category._id;
      return map;
    }, {});

    // Link products to categories and insert them
    const productsWithCategoryIds = products.map(product => ({
      ...product,
      category: categoryMap[product.categoryName],
    }));
    await Product.insertMany(productsWithCategoryIds);
    console.log('Products imported!');

    // Insert users
    await User.insertMany(users);
    console.log('Users imported!');

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Check command line argument
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}