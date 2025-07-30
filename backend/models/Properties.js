// backend/models/Properties.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  images: [{ type: String, required: true }], 
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String }, // optional
  location: { type: String }, // optional
  bedrooms: { type: String }, // optional
  bathrooms: { type: String }, // optional
  area: { type: String }, // optional
});

module.exports = mongoose.model('Property', propertySchema);