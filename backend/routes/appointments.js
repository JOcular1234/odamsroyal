// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Create appointment
router.post('/', async (req, res) => {
  try {
    const appointment = new Appointment(req.body);
    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: 'Error booking appointment' });
  }
});

// Get all appointments (admin)
const { verifyToken } = require('./admin');

router.get('/', verifyToken, async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Update appointment status (approve/reject)
const { updateAppointmentStatus } = require('../controllers/appointmentController');
router.patch('/:id', verifyToken, updateAppointmentStatus);

module.exports = router;