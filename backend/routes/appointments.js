// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Enhanced token verification middleware that checks both cookie and header
const verifyToken = (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const cookie = require('cookie');
    const JWT_SECRET = process.env.JWT_SECRET;
    
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

// Create appointment (public route)
router.post('/', async (req, res) => {
  try {
    console.log('Creating appointment with data:', req.body);
    const appointment = new Appointment(req.body);
    await appointment.save();
    console.log('Appointment created successfully:', appointment._id);
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(400).json({ 
      message: 'Error booking appointment',
      error: error.message 
    });
  }
});

// Get all appointments (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Fetching appointments for admin user:', req.user.username);
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    console.log(`Found ${appointments.length} appointments`);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ 
      message: 'Error fetching appointments',
      error: error.message 
    });
  }
});

// Update appointment status (admin only)
// router.patch('/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;
    
//     console.log(`Updating appointment ${id} status to: ${status}`);
    
//     // Validate status
//     if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ 
//         message: 'Invalid status. Must be pending, approved, or rejected.' 
//       });
//     }

//     // Find and update appointment
//     const appointment = await Appointment.findByIdAndUpdate(
//       id,
//       { 
//         status, 
//         updatedAt: new Date(),
//         updatedBy: req.user.username // Track who updated it
//       },
//       { new: true, runValidators: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     if (status === 'approved') {
//       try {
//         const {sendAppoitmentApproved}= require('../utils/mailer');
//         await sendAppoitmentApproved(appointment);
       


//     console.log('Appointment updated successfully:', appointment._id);
//     res.json(appointment);
//   } catch (error) {
//     console.error('Error updating appointment:', error);
//     res.status(500).json({ 
//       message: 'Error updating appointment',
//       error: error.message 
//     });
//   }
// });

// Update appointment status (admin only)
// router.patch('/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     console.log(`Updating appointment ${id} status to: ${status}`);

//     // Validate status
//     if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
//       return res.status(400).json({ 
//         message: 'Invalid status. Must be pending, approved, or rejected.' 
//       });
//     }

//     // Find and update appointment
//     const appointment = await Appointment.findByIdAndUpdate(
//       id,
//       {
//         status,
//         updatedAt: new Date(),
//         updatedBy: req.user.username // Track who updated it
//       },
//       { new: true, runValidators: true }
//     );

//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }

//     // Send email if approved
//     if (status === 'approved') {
//       try {
//         const { sendAppointmentApproved } = require('../utils/mailer');
//         await sendAppointmentApproved(appointment);
//       } catch (emailError) {
//         console.error('Error sending approval email:', emailError.message);
//       }
//     }

//     console.log('Appointment updated successfully:', appointment._id);
//     res.json(appointment);

//   } catch (error) {
//     console.error('Error updating appointment:', error);
//     res.status(500).json({ 
//       message: 'Error updating appointment',
//       error: error.message 
//     });
//   }
// });


// PATCH /api/appointments/patch/:id
router.patch('/patch/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, updatedBy } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date(),
        updatedBy: updatedBy || 'admin',
      },
      { new: true } // ✅ Ensure you get the updated document
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Appointment after update:', appointment);
  let emailSent = true;

    // ✅ Check if email exists before sending
    if (status === 'approved') {
      try {
        console.log('Preparing to send approval email to:', appointment.email);
        const { sendAppointmentApproved } = require('../utils/mailer');
        await sendAppointmentApproved(appointment);
        console.log('✅ Approval email sent to:', appointment.email);
      } catch (emailError) {
        console.error('❌ Error sending approval email:', emailError.message);
      }
    }

    res.json({ message: 'Appointment updated successfully', appointment });
    console.log('Appointment updated successfully:', appointment._id);
      res.json({ ...appointment.toObject(), emailSent });


  } catch (error) {
    console.error('❌ Error updating appointment:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single appointment by ID (admin only)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ 
      message: 'Error fetching appointment',
      error: error.message 
    });
  }
});

// Delete appointment (admin only) - optional
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    console.log('Appointment deleted:', appointment._id);
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      message: 'Error deleting appointment',
      error: error.message 
    });
  }
});

module.exports = router;