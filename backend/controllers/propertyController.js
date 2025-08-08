// backend/controllers/propertyController.js
const Property = require('../models/Properties');

exports.createProperty = async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property' });
  }
};

exports.getAllProperties = async (req, res) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const [properties, total] = await Promise.all([
      Property.find().skip(skip).limit(limit),
      Property.countDocuments(),
    ]);
    res.json({
      total,
      properties,
      skip,
      limit,
      hasMore: skip + properties.length < total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
