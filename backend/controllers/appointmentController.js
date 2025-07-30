// backend/controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const { sendAppointmentApproved } = require('../utils/mailer');

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    // Only send mail if approved
    if (status === 'approved') {
      try {
        await sendAppointmentApproved(appointment);
      } catch (mailErr) {
        console.error('Failed to send approval email:', mailErr);
      }
    }

    res.json(appointment);
  } catch (error) {
    next(error);
  }
};
