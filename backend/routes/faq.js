// backend/routes/faq.js
const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const verifyToken = require('../middleware/verifyToken');

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch FAQs', error: err.message });
  }
});

// Create FAQ (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) return res.status(400).json({ message: 'Question and answer required' });
    const faq = new Faq({ question, answer });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create FAQ', error: err.message });
  }
});

// Update FAQ (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await Faq.findByIdAndUpdate(
      req.params.id,
      { question, answer, updatedAt: Date.now() },
      { new: true }
    );
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update FAQ', error: err.message });
  }
});

// Delete FAQ (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete FAQ', error: err.message });
  }
});

module.exports = router;
