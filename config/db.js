const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/testingDB');
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.log('❌ MongoDB Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;