// // backend/utils/mailer.js
// const dotenv = require('dotenv');
// const nodemailer = require('nodemailer');
// dotenv.config();


// // Configure your transporter
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // Change to your email provider
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendInquiryResponse(to, subject, responseMessage, inquiry) {
//   console.log('DEBUG inquiry object for email:', inquiry);
//   const html = `
//     <div style="font-family: Arial, sans-serif; color: #222;">
//       <h2 style="color: #1a56db;">Odamz Royal - Inquiry Response</h2>
//       <p>Dear ${inquiry?.name || 'User'},</p>
//       <p>Thank you for reaching out to us regarding <b>${inquiry?.propertyTitle || 'a property'}</b>.</p>
//       <p><b>Your Inquiry:</b><br/>${inquiry?.message || inquiry?.body || '[No inquiry message provided]'}</p>
//       <hr/>
//       <p><b>Our Response:</b><br/>${responseMessage}</p>
//       <p style="margin-top:2em;">If you have further questions, feel free to reply to this email.<br/>Best regards,<br/><b>Odamz Royal Team</b></p>
//     </div>
//   `;
//   const mailOptions = {
//     from: `Odamz Royal <${process.env.EMAIL_USER}>`,
//     to,
//     subject,
//     html,
//   };
//   try {
//     return await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error('EMAIL SEND ERROR (Inquiry):', err, '\nMail options:', mailOptions);
//     throw err;
//   }
// }

// async function sendAppointmentApproved(appointment) {
//   // if (!appointment.email) return;
//   if (!appointment.email){
//     console.warn('No email provided for appointment approval notification');
//     return;
//   }
//   console.log('DEBUG: Email confiiguration check')
//   console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'MISSING'}`);
//   console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'MISSING'}`);
//   console.log('DEBUG appointment object for email:', appointment);
//   const html = `
//     <div style="font-family: Arial, sans-serif; color: #222;">
//       <h2 style="color: #1a56db;">Odamz Royal - Appointment Approved</h2>
//       <p>Dear ${appointment.name || 'User'},</p>
//       <p>Your appointment for <b>${appointment.service || 'a service'}</b> on <b>${appointment.date ? new Date(appointment.date).toLocaleString() : ''}</b> has been <span style="color:green"><b>approved</b></span>.</p>
//       <p>We look forward to seeing you. If you have any questions, reply to this email or contact us at <a href="mailto:info.odamzroyalty@gmail.com">info.odamzroyalty@gmail.com</a>.</p>
//       <p>📍 CBD, Abuja (Center Business District ), Nigeria</p>
//       <p>📞 07061198858, 08123485718</p>
//       <p style="margin-top:2em;">Thank you for choosing Odamz Royal!<br/><b>Odamz Royal Team</b></p>
//     </div>
//   `;
//   const mailOptions = {
//     from: `Odamz Royal <${process.env.EMAIL_USER}>`,
//     to: appointment.email,
//     subject: 'Your Appointment is Approved',
//     html,
//   };
//   try {
//     return await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error('EMAIL SEND ERROR (Appointment Approved):', err, '\nMail options:', mailOptions);
//     throw err;
//   }
// }

// module.exports = { sendInquiryResponse, sendAppointmentApproved };
// backend/utils/mailer.js
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();


// Configure your transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendInquiryResponse(to, subject, responseMessage, inquiry) {
  console.log('DEBUG inquiry object for email:', inquiry);
  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #1a56db;">Odamz Royal - Inquiry Response</h2>
      <p>Dear ${inquiry?.name || 'User'},</p>
      <p>Thank you for reaching out to us regarding <b>${inquiry?.propertyTitle || 'a property'}</b>.</p>
      <p><b>Your Inquiry:</b><br/>${inquiry?.message || inquiry?.body || '[No inquiry message provided]'}</p>
      <hr/>
      <p><b>Our Response:</b><br/>${responseMessage}</p>
      <p style="margin-top:2em;">If you have further questions, feel free to reply to this email.<br/>Best regards,<br/><b>Odamz Royal Team</b></p>
    </div>
  `;
  const mailOptions = {
    from: `Odamz Royal <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('EMAIL SEND ERROR (Inquiry):', err, '\nMail options:', mailOptions);
    throw err;
  }
}

// backend/utils/mailer.js
async function sendAppointmentApproved(appointment) {
  if (!appointment.email) {
    console.warn('No email provided for appointment approval notification', appointment);
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(appointment.email)) {
    console.warn('Invalid email format:', appointment.email, appointment);
    return;
  }
  console.log('Attempting to send approval email to:', appointment.email);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'MISSING'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'MISSING'}`);
  console.log('Appointment data:', appointment);

  const html = `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2 style="color: #1a56db;">Odamz Royal - Appointment Approved</h2>
      <p>Dear ${appointment.name || 'User'},</p>
      <p>Your appointment for <b>${appointment.service || 'a service'}</b> on <b>${
        appointment.date ? new Date(appointment.date).toLocaleString() : ''
      }</b> has been <span style="color:green"><b>approved</b></span>.</p>
      <p>We look forward to seeing you. If you have any questions, reply to this email or contact us at <a href="mailto:info.odamzroyalty@gmail.com">info.odamzroyalty@gmail.com</a>.</p>
      <p>📍 CBD, Abuja (Center Business District), Nigeria</p>
      <p>📞 07061198858, 08123485718</p>
      <p style="margin-top:2em;">Thank you for choosing Odamz Royal!<br/><b>Odamz Royal Team</b></p>
    </div>
  `;
  const mailOptions = {
    from: `Odamz Royal <${process.env.EMAIL_USER}>`,
    to: appointment.email,
    subject: 'Your Appointment is Approved',
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('EMAIL SEND ERROR (Appointment Approved):', err, '\nMail options:', mailOptions);
    throw err;
  }
}

module.exports = { sendInquiryResponse, sendAppointmentApproved };
