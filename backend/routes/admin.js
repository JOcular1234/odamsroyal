// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const bcrypt = require('bcryptjs');
const { findAdminByUsername } = require('../utils/db');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '2h';

// Middleware to verify JWT
// Enhanced token verification middleware that checks both cookie and header
const verifyToken = (req, res, next) => {
  try {
    let token = null;
    const cookies = cookie.parse(req.headers.cookie || '');
    token = cookies.admin_token;
    // If no cookie token, try Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};


const { loginLimiter } = require('../utils/rateLimiter');
const Admin = require('../models/Admin');

// Middleware for role-based access
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}

// Enhanced token verification middleware that checks both cookie and header
const enhancedVerifyToken = (req, res, next) => {
  try {
    let token = null;
    // First try to get token from cookie
    const cookies = cookie.parse(req.headers.cookie || '');
    token = cookies.admin_token;
    // If no cookie token, try Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get current admin profile
router.get('/profile', enhancedVerifyToken, async (req, res) => {
  try {
    // req.user.username is set by JWT, which is set at login
    const admin = await Admin.findOne(
      { username: req.user.username },
      '-password'
    );
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // If you want to add createdAt/lastLogin, add those fields to the schema
    res.json({
      username: admin.username,
      role: admin.role,
      createdAt: admin.createdAt || null,
      lastLogin: admin.lastLogin || null,
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// List all admin and staff users (admin only)
router.get('/list', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const users = await Admin.find({}, '-password'); // Exclude password
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Edit staff (admin only)
router.put('/admin/edit/:id', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { username, role } = req.body;
    const update = {};
    if (username) update.username = username;
    if (role) update.role = role;

    const updated = await Admin.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Staff user not found' });
    res.status(200).json({ message: 'Staff updated', user: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating staff', error: error.message });
  }
});

// Admin creates staff or admin user
router.post('/admin/create', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const existing = await Admin.findOne({ username });
    if (existing) {
      return res.status(409).json({ message: 'Username already exists' });
    }
    const newAdmin = new Admin({
      username,
      password,
      role: role === 'admin' ? 'admin' : 'staff',
    });
    await newAdmin.save();
    res.status(201).json({ message: 'User created successfully', user: { username: newAdmin.username, role: newAdmin.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const admin = await findAdminByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username: admin.username, role: admin.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set cookie with proper cross-origin settings
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours
        // Remove domain to allow cross-origin cookie sharing
      })
    );

    res.status(200).json({
      message: 'Login successful',
      token, // Send token in response for frontend to store
      role: admin.role, // Send user role for frontend
      username: admin.username, // Send username for frontend to store
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login', details: error.message });
  }
});


// Protected dashboard route
router.get('/dashboard', enhancedVerifyToken, (req, res) => {
  try {
    res.status(200).json({ message: 'Welcome to the admin dashboard' });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug endpoint for admin authentication
if (process.env.NODE_ENV !== 'production') {
  router.get('/auth-debug', (req, res) => {
    const cookieHeader = req.headers.cookie || '';
    const cookies = cookie.parse(cookieHeader);
    const token = cookies.admin_token;
    res.json({
      message: 'Admin Auth Debug',
      env: process.env.NODE_ENV,
      cookies,
      cookieHeader,
      token,
      headers: req.headers,
      user: req.user || null
    });
  });
}

router.get('/debug/cookies', (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  res.status(200).json({ cookies });
});

// Admin-only property creation
const Property = require('../models/Properties');
router.put('/properties/:id', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const updated = await Property.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        images: req.body.images,
        price: req.body.price,
        location: req.body.location,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        area: req.body.area,
      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Error updating property', error: error.message });
  }
});

router.delete('/properties/:id', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json({ message: 'Property deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting property', error: error.message });
  }
});

router.post('/properties', enhancedVerifyToken, requireRole('admin'), async (req, res) => {
  try {
    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      location: req.body.location,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      area: req.body.area,
    });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property' });
  }
});

// Update all protected routes to use enhancedVerifyToken
router.get('/properties', enhancedVerifyToken, async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Properties error:', error.message);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

const Inquiry = require('../models/Inquiry');
router.get('/inquiries', enhancedVerifyToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Inquiries error:', error.message);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

const Appointment = require('../models/Appointment');
router.get('/appointments', enhancedVerifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Appointments error:', error.message);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Add route to update appointment status
router.patch('/appointments/:id', enhancedVerifyToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    // Validate status
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected.' });
    }

    const mongoose = require('mongoose');
    console.log('Updating appointment:', id, 'with status:', status);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ObjectId:', id);
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status: status,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );
    if (!appointment) {
      console.error('No appointment found for ID:', id);
      return res.status(404).json({ message: 'Appointment not found' });
    }
    console.log('Appointment after update:', appointment);

    // Send approval email if status is approved
    if (appointment.status === 'approved') {
      try {
        const { sendAppointmentApproved } = require('../utils/mailer');
        await sendAppointmentApproved(appointment);
        console.log('✅ Approval email sent to:', appointment.email);
      } catch (emailError) {
        console.error('❌ Error sending approval email:', emailError.message);
      }
    }

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Error updating appointment', error });
  }
});

// Test logging route
router.get('/test-log', (req, res) => {
  console.log('Test log route hit!');
  res.json({ message: 'Test log route hit!' });
});

// Logout route
router.post('/logout', (req, res) => {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('admin_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 0,
      domain: process.env.NODE_ENV === 'production' ? '.odamzroyal.vercel.app' : undefined
    })
  );
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = {
  router,
  verifyToken: enhancedVerifyToken,
  requireRole
};