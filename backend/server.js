// // backend/server.js
// const dotenv = require('dotenv');
// const express = require('express');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const propertyRoutes = require('./routes/properties');
// const inquiryRoutes = require('./routes/inquiries');
// const appointmentRoutes = require('./routes/appointments');
// const adminRoutes = require('./routes/admin');

// dotenv.config();
// const app = express();

// // Middleware
// // const allowedOrigins = [
// //   'http://localhost:3000',
// //   'https://odamsroyal.vercel.app'
// // ];
// // console.log('Allowed Origins:', allowedOrigins);

// // app.use(
// //   cors({
// //     origin: function (origin, callback) {
// //       console.log('CORS Origin:', origin); 
// //       // allow requests with no origin (like mobile apps, curl, etc.)
// //       if (!origin) return callback(null, true);
// //       if (allowedOrigins.includes(origin)) {
// //         return callback(null, true);
// //       } else {
// //         return callback(new Error('Not allowed by CORS'), false);
// //       }
// //     },
// //     credentials: true,
// //   })
// // );

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://odamsroyal.vercel.app'
// ];
// console.log('Allowed Origins:', allowedOrigins);


// // In your backend/server.js - Replace the CORS configuration

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log('CORS Origin:', origin); 
//       // Allow requests with no origin (like mobile apps, curl, etc.)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error('Not allowed by CORS'), false);
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
//     exposedHeaders: ['Set-Cookie']
//   })
// );

// // Add this before your routes
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });

// app.use(express.json());

// // Connect to MongoDB
// connectDB();

// // Routes
// app.use('/api/properties', propertyRoutes);
// app.use('/api/inquiries', inquiryRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/admin', adminRoutes.router);

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error('Global error:', err.stack || err);
//   res.status(err.status || 500).json({
//     message: err.message || 'Internal Server Error',
//     ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const propertyRoutes = require('./routes/properties');
const inquiryRoutes = require('./routes/inquiries');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');

dotenv.config();
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://odamsroyal.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log('CORS Origin:', origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  })
);

// Ensure credentials are allowed
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/admin', adminRoutes.router);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack || err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));