// // backend/routes/admin.js
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const cookie = require('cookie');
// const bcrypt = require('bcryptjs');
// const { findAdminByUsername } = require('../utils/db');
// const dotenv = require('dotenv');
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET;
// const JWT_EXPIRES_IN = '2h';


//   // Middleware to verify JWT
//   const verifyToken = (req, res, next) => {
//     try {
//       const cookies = cookie.parse(req.headers.cookie || '');
//       const token = cookies.admin_token;
//       if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//       }
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.user = decoded;
//       next();
//     } catch (error) {
//       console.error('Token verification error:', error.message);
//       return res.status(401).json({ message: 'Invalid token' });
//     }
//   };

// // Login route
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       return res.status(400).json({ message: 'Username and password are required' });
//     }
//     const admin = await findAdminByUsername(username);
//     if (!admin) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN
//     });

//     res.setHeader(
//       'Set-Cookie',
//       cookie.serialize('admin_token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         path: '/',
//         maxAge: 60 * 60 * 2, // 2 hours
//     domain: '.odamsroyal.vercel.app',
//       })
//     );

//     res.status(200).json({ message: 'Login successful' });
//   } catch (error) {
//     console.error('Login error:', error.message);
//     res.status(500).json({ message: 'Server error during login', details: error.message });
//   }
// });

// // Protected dashboard route
// router.get('/dashboard', verifyToken, (req, res) => {

// // Debug endpoint for admin authentication
// if (process.env.NODE_ENV !== 'production') {
//   router.get('/auth-debug', (req, res) => {
//     const cookieHeader = req.headers.cookie || '';
//     const cookies = cookie.parse(cookieHeader);
//     const token = cookies.admin_token;
//     res.json({
//       message: 'Admin Auth Debug',
//       env: process.env.NODE_ENV,
//       cookies,
//       cookieHeader,
//       token,
//       headers: req.headers,
//       user: req.user || null
//     });
//   });
// }

//   try {
//     res.status(200).json({ message: 'Welcome to the admin dashboard' });
//   } catch (error) {
//     console.error('Dashboard error:', error.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // backend/routes/admin.js
// router.get('/debug/cookies', (req, res) => {
//   const cookies = cookie.parse(req.headers.cookie || '');
//   res.status(200).json({ cookies });
// });

// // Admin-only property creation
// const Property = require('../models/Properties');
// router.post('/properties', verifyToken, async (req, res) => {
//   try {
//     const property = new Property(req.body);
//     await property.save();
//     res.status(201).json(property);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating property' });
//   }
// });

// // Stub routes (replace with your actual routes if different)
// router.get('/properties', verifyToken, async (req, res) => {
//   try {
//     const properties = [{ _id: '1', title: 'Property 1', description: 'A beautiful house' }];
//     res.status(200).json(properties);
//   } catch (error) {
//     console.error('Properties error:', error.message);
//     res.status(500).json({ message: 'Error fetching properties' });
//   }
// });

// router.get('/inquiries', verifyToken, async (req, res) => {
//   try {
//     const inquiries = [{ _id: '1', message: 'Inquiry 1' }];
//     res.status(200).json(inquiries);
//   } catch (error) {
//     console.error('Inquiries error:', error.message);
//     res.status(500).json({ message: 'Error fetching inquiries' });
//   }
// });

// router.get('/appointments', verifyToken, async (req, res) => {
//   try {
//     const appointments = [{ _id: '1', date: '2025-07-25' }];
//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Appointments error:', error.message);
//     res.status(500).json({ message: 'Error fetching appointments' });
//   }
// });

// // Logout route
// router.post('/logout', (req, res) => {
//   res.setHeader(
//     'Set-Cookie',
//     require('cookie').serialize('admin_token', '', {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//       path: '/',
//       maxAge: 0,
//     })
//   );
//   res.status(200).json({ message: 'Logout successful' });
// });

// module.exports = {
//   router,
//   verifyToken
// };


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
const verifyToken = (req, res, next) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.admin_token;
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

// Login route
router.post('/login', async (req, res) => {
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

    const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });

    // Set cookie without domain restriction for cross-domain compatibility
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
        maxAge: 60 * 60 * 2, // 2 hours
        // Remove domain restriction to allow cross-domain cookies
      })
    );

    res.status(200).json({ 
      message: 'Login successful',
      token: token // Also send token in response for frontend to store
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login', details: error.message });
  }
});

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
    console.error('Token verification error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

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
router.post('/properties', enhancedVerifyToken, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property' });
  }
});

// Update all protected routes to use enhancedVerifyToken
router.get('/properties', enhancedVerifyToken, async (req, res) => {
  try {
    const properties = [{ _id: '1', title: 'Property 1', description: 'A beautiful house' }];
    res.status(200).json(properties);
  } catch (error) {
    console.error('Properties error:', error.message);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

router.get('/inquiries', enhancedVerifyToken, async (req, res) => {
  try {
    const inquiries = [{ _id: '1', message: 'Inquiry 1' }];
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Inquiries error:', error.message);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

router.get('/appointments', enhancedVerifyToken, async (req, res) => {
  try {
    // If you have an Appointment model, use it
    // const Appointment = require('../models/Appointment');
    // const appointments = await Appointment.find().sort({ createdAt: -1 });
    
    // For now, using mock data - replace with actual database query
    const appointments = [
      { 
        _id: '1', 
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        service: 'Property Viewing',
        date: '2025-07-25T10:00:00Z',
        status: 'pending'
      },
      { 
        _id: '2', 
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        service: 'Consultation',
        date: '2025-07-26T14:00:00Z',
        status: 'approved'
      }
    ];
    
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

    // If you have an Appointment model, use it
    // const Appointment = require('../models/Appointment');
    // const appointment = await Appointment.findByIdAndUpdate(
    //   id,
    //   { status, updatedAt: new Date() },
    //   { new: true, runValidators: true }
    // );

    // Mock response - replace with actual database update
    const appointment = {
      _id: id,
      status: status,
      updatedAt: new Date()
    };

    res.status(200).json(appointment);
  } catch (error) {
    console.error('Update appointment error:', error.message);
    res.status(500).json({ message: 'Error updating appointment' });
  }
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
    })
  );
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = {
  router,
  verifyToken: enhancedVerifyToken
};