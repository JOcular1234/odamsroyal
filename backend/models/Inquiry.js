// // backend/models/Inquiry.js
// const mongoose = require('mongoose');

// const inquirySchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true },
//   message: { type: String, required: true },
//   propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Inquiry', inquirySchema);

// backend/model/db.js
const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: false }, // Changed to required: false
  cardUrl: { type: String }, // URL of the property card where inquiry was made
  createdAt: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  responded: { type: Boolean, default: false }, // New field to track if responded
});

module.exports = mongoose.model('Inquiry', inquirySchema);