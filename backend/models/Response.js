const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', required: true },
  responseMessage: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', responseSchema);
