// import jwt from 'jsonwebtoken';
// import cookie from 'cookie';
// import bcrypt from 'bcryptjs';
// // import your db connection and admin model here
// import { findAdminByUsername } from '../../../utils/db'; // implement this function

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
// const JWT_EXPIRES_IN = '2h';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { username, password } = req.body;
//   const admin = await findAdminByUsername(username); // fetch from DB

//   // Use bcrypt to compare hashed password
//   if (!admin || !bcrypt.compareSync(password, admin.password)) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

//   res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'lax',
//     path: '/',
//     maxAge: 60 * 60 * 2,
//   }));

//   res.status(200).json({ message: 'Login successful' });
// }


// // frontend/src/pages/api/admin/login.js
// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const cookie = require('cookie');
// const bcrypt = require('bcryptjs');
// const { findAdminByUsername } = require('../utils/db');

// const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey'; // Use env variable in production
// const JWT_EXPIRES_IN = '2h';

// // Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   const cookies = cookie.parse(req.headers.cookie || '');
//   const token = cookies.admin_token;
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Login route
// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const admin = await findAdminByUsername(username);

//   if (!admin || !bcrypt.compareSync(password, admin.password)) {
//     return res.status(401).json({ message: 'Invalid credentials' });
//   }

//   const token = jwt.sign({ username: admin.username, role: 'admin' }, JWT_SECRET, {
//     expiresIn: JWT_EXPIRES_IN,
//   });

//   res.setHeader(
//     'Set-Cookie',
//     cookie.serialize('admin_token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict', // Changed to 'strict' for better security
//       path: '/',
//       maxAge: 60 * 60 * 2, // 2 hours
//     })
//   );

//   res.status(200).json({ message: 'Login successful' });
// });

// // Example protected route
// router.get('/dashboard', verifyToken, (req, res) => {
//   res.status(200).json({ message: 'Welcome to the admin dashboard' });
// });

// module.exports = router;