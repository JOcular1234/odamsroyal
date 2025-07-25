// frontend/src/utils/db.js
import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

export async function dbConnect() {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
}

export async function findAdminByUsername(username) {
  await dbConnect();
  return Admin.findOne({ username });
}
