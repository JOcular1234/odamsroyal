// backend/models/Properties.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  images: [{ type: String, required: true }], 
  title: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Property', propertySchema);