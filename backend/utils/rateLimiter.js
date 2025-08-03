// backend/utils/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Limit login attempts to 5 per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 30 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = { loginLimiter };
