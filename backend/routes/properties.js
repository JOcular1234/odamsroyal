// backend/routes/properties.js
const express = require('express');
const router = express.Router();
const { getAllProperties, getPropertyById, createProperty } = require('../controllers/propertyController');

// Get all properties
router.get('/', getAllProperties);

// Get property by ID
router.get('/:id', getPropertyById);

// Create a new property
const { verifyToken } = require('./admin');

router.post('/', verifyToken, createProperty);

module.exports = router;