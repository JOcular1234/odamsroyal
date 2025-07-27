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

// // Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   try {
//     const cookies = cookie.parse(req.headers.cookie || '');
//     const token = cookies.admin_token;
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     console.error('Token verification error:', error.message);
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

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
//       expiresIn: JWT_EXPIRES_IN,
//     });

//     res.setHeader(
//       'Set-Cookie',
//       cookie.serialize('admin_token', token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production',
//         sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//         path: '/',
//         maxAge: 60 * 60 * 2, // 2 hours
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
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 0,
//     })
//   );
//   res.status(200).json({ message: 'Logout successful' });
// });

// backednd/routes/admin.js
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
// In your backend/routes/admin.js - Replace the verifyToken middleware

const verifyToken = (req, res, next) => {
  try {
    let token;
    
    // First try to get token from cookies
    const cookies = cookie.parse(req.headers.cookie || '');
    token = cookies.admin_token;
    
    // If no cookie token, try Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
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
// In your backend/routes/admin.js - Replace the login route cookie setting

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
      expiresIn: JWT_EXPIRES_IN,
    });

    // Set cookie options based on environment
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction, // true in production, false in dev
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 hours
      domain: isProduction ? '.odamsroyal.vercel.app' : undefined,

    };

    res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, cookieOptions));

    res.status(200).json({ message: 'Login successful', token }); // Also return token
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login', details: error.message });
  }
});

// Protected dashboard route
router.get('/dashboard', verifyToken, (req, res) => {
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
  try {
    res.status(200).json({ message: 'Welcome to the admin dashboard' });
  } catch (error) {
    console.error('Dashboard error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin-only property creation
const Property = require('../models/Properties');
router.post('/properties', verifyToken, async (req, res) => {
  try {
    const property = new Property(req.body);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: 'Error creating property' });
  }
});

// Stub routes (replace with your actual routes if different)
router.get('/properties', verifyToken, async (req, res) => {
  try {
    const properties = [{ _id: '1', title: 'Property 1', description: 'A beautiful house' }];
    res.status(200).json(properties);
  } catch (error) {
    console.error('Properties error:', error.message);
    res.status(500).json({ message: 'Error fetching properties' });
  }
});

router.get('/inquiries', verifyToken, async (req, res) => {
  try {
    const inquiries = [{ _id: '1', message: 'Inquiry 1' }];
    res.status(200).json(inquiries);
  } catch (error) {
    console.error('Inquiries error:', error.message);
    res.status(500).json({ message: 'Error fetching inquiries' });
  }
});

router.get('/appointments', verifyToken, async (req, res) => {
  try {
    const appointments = [{ _id: '1', date: '2025-07-25' }];
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Appointments error:', error.message);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  // Set cookie options for clearing based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    require('cookie').serialize('admin_token', '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 0
    })
  );
  res.status(200).json({ message: 'Logout successful' });
});

// MOVE THIS TO THE END - AFTER ALL ROUTES ARE DEFINED
module.exports = { router, verifyToken };