// backend/server.js
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

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL || 'https://odamsroyal.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  })
);
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
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));