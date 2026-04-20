require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');
const User = require('./models/User');

const uri = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/testingDB';

async function seedListings() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Find an existing user or create one
    let user = await User.findOne();
    if (!user) {
      user = new User({
        username: 'dummyuser',
        email: 'dummy@example.com',
        password: 'password123',
        isVerified: true
      });
      await user.save();
      console.log('Created dummy user');
    }

    const dummyListings = [
      {
        title: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera and performance',
        price: 999,
        category: 'Electronics',
        imageUrl: 'https://example.com/iphone15.jpg',
        userId: user._id
      },
      {
        title: 'MacBook Air M3',
        description: 'Lightweight laptop with M3 chip for productivity',
        price: 1299,
        category: 'Electronics',
        imageUrl: 'https://example.com/macbook.jpg',
        userId: user._id
      },
      {
        title: 'Nike Air Max',
        description: 'Comfortable running shoes with air cushioning',
        price: 150,
        category: 'Fashion',
        imageUrl: 'https://example.com/nike.jpg',
        userId: user._id
      },
      {
        title: 'Coffee Table',
        description: 'Modern wooden coffee table for living room',
        price: 250,
        category: 'Furniture',
        imageUrl: 'https://example.com/table.jpg',
        userId: user._id
      },
      {
        title: 'Guitar Lessons',
        description: 'Learn to play guitar from experienced instructor',
        price: 50,
        category: 'Services',
        imageUrl: 'https://example.com/guitar.jpg',
        userId: user._id
      },
      {
        title: 'Vintage Watch',
        description: 'Classic Rolex watch in excellent condition',
        price: 2500,
        category: 'Fashion',
        imageUrl: 'https://example.com/watch.jpg',
        userId: user._id
      },
      {
        title: 'Mountain Bike',
        description: 'Durable mountain bike for off-road adventures',
        price: 800,
        category: 'Sports',
        imageUrl: 'https://example.com/bike.jpg',
        userId: user._id
      },
      {
        title: 'Organic Vegetables',
        description: 'Fresh organic vegetables from local farm',
        price: 25,
        category: 'Food',
        imageUrl: 'https://example.com/veggies.jpg',
        userId: user._id
      }
    ];

    await Listing.insertMany(dummyListings);
    console.log('Dummy listings added successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding listings:', error);
    process.exit(1);
  }
}

seedListings();