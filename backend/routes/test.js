// // backend/routes/test.js
// const express = require('express');
// const router = express.Router();
// const { sendAppointmentApproved } = require('../utils/mailer');

// router.get('/test-email', async (req, res) => {
//   try {
//     const testAppointment = {
//       email: 'mfonobongumoh75@gmail.com',
//       name: 'Test User',
//       service: 'Test Service',
//       date: new Date(),
//     };
//     await sendAppointmentApproved(testAppointment);
//     res.json({ message: 'Test email sent' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// backend/routes/test.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { sendAppointmentApproved } = require('../utils/mailer');

router.get('/test-email/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    await sendAppointmentApproved(appointment);
    res.json({ message: 'Test email sent', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;