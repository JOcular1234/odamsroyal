// const mongoose = require('mongoose');
// const Admin = require('../models/Admin');

// async function dbConnect() {
//   if (mongoose.connection.readyState >= 1) return;
//   return mongoose.connect(process.env.MONGODB_URI);
// }

// async function findAdminByUsername(username) {
//   await dbConnect();
//   return Admin.findOne({ username });
// }

// module.exports = { dbConnect, findAdminByUsername };


// backend/utils/db.js
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}

async function findAdminByUsername(username) {
  try {
    await dbConnect();
    if (!username) throw new Error('Username is required');
    const admin = await Admin.findOne({ username });
    return admin;
  } catch (error) {
    console.error('Find admin error:', error.message);
    throw error;
  }
}

module.exports = { dbConnect, findAdminByUsername };