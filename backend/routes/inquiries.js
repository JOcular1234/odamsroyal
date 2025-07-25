// backend/routes/inquiries.js
const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// Create inquiry
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting inquiry' });
  }
});

// Get all inquiries (admin)
const { verifyToken } = require('./admin');

// Protect all admin routes
router.get('/', verifyToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

// PATCH /:id - Update isRead
router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const { isRead } = req.body;
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { isRead },
      { new: true }
    );
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: 'Error updating inquiry' });
  }
});

// POST /:id/respond - Save response and send email
const Response = require('../models/Response');
const { sendInquiryResponse } = require('../utils/mailer');

router.post('/:id/respond', verifyToken, async (req, res) => {
  try {
    const { responseMessage } = req.body;
    if (!responseMessage) return res.status(400).json({ message: 'Response message required' });

    // Find inquiry
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    // Save response in DB
    const response = new Response({
      inquiryId: inquiry._id,
      responseMessage
    });
    await response.save();

    // Send email
    await sendInquiryResponse(
      inquiry.email,
      'Response to your inquiry',
      responseMessage,
      inquiry
    );

    // Mark inquiry as responded
    inquiry.responded = true;
    await inquiry.save();

    res.json({ message: 'Response sent and saved', response });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error sending response', error: error.message });
  }
});

// DELETE /:id - Delete inquiry
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting inquiry' });
  }
});

module.exports = router;