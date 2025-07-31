const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
dotenv.config();

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Common email template styles
const emailStyles = `
  font-family: 'Arial', 'Helvetica', sans-serif;
  color: #333333;
  line-height: 1.6;
  background-color: #f9fafb;
  margin: 0;
  padding: 0;
`;

const containerStyles = `
  max-width: 600px;
  margin: 0 auto;
  background-color: #ffffff;
  border: 1px solid #f97316;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
`;

const buttonStyles = `
  display: inline-block;
  padding: 12px 24px;
  background-color: #f97316;
  color: #ffffff;
  text-decoration: none;
  border-radius: 9999px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: background-color 0.3s ease;
`;

const footerStyles = `
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f97316;
  font-size: 14px;
  color: #666666;
  text-align: center;
`;

async function sendInquiryResponse(to, subject, responseMessage, inquiry) {
  console.log('DEBUG inquiry object for email:', inquiry);

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!to || !emailRegex.test(to)) {
    console.warn('Invalid or missing email for inquiry response:', to, inquiry);
    throw new Error('Invalid email address');
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Odamz Royal - Inquiry Response</title>
    </head>
    <body style="${emailStyles}">
      <div style="${containerStyles}">
        <img
          src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg"
          alt="Odamz Royal Consultz Logo"
          style="display: block; margin: 0 auto 24px; max-width: 150px; border-radius: 12px;"
        >
        <h2 style="color: #f97316; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 16px;">
          Inquiry Response
        </h2>
        <p style="font-size: 16px; margin-bottom: 16px;">
          Dear ${inquiry?.name || 'User'},
        </p>
        <p style="font-size: 16px; margin-bottom: 16px;">
          Thank you for reaching out to us regarding <strong>${
            inquiry?.propertyTitle || 'a property'
          }</strong>.
        </p>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Your Inquiry:</p>
          <p style="font-size: 16px;">
            ${inquiry?.message || inquiry?.body || '[No inquiry message provided]'}
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
          <p style="font-size: 16px; font-weight: bold; margin-bottom: 8px;">Our Response:</p>
          <p style="font-size: 16px;">${responseMessage}</p>
        </div>
        <p style="font-size: 16px; margin-bottom: 16px;">
          If you have further questions, feel free to reply to this email or
          <a href="mailto:info.odamzroyalty@gmail.com" style="color: #f97316; text-decoration: underline;">
            contact us
          </a>.
        </p>
        <p style="font-size: 16px; margin-bottom: 16px;">
          Best regards,<br><strong>Odamz Royal Team</strong>
        </p>
        <div style="${footerStyles}">
          <p>
            📍 CBD, Abuja (Center Business District), Nigeria<br>
            📞 <a href="tel:+2347061198858" style="color: #f97316; text-decoration: none;">07061198858</a>,
            <a href="tel:+2348123485718" style="color: #f97316; text-decoration: none;">08123485718</a><br>
            📧 <a href="mailto:info.odamzroyalty@gmail.com" style="color: #f97316; text-decoration: none;">
              info.odamzroyalty@gmail.com
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `Odamz Royal <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Inquiry response email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('EMAIL SEND ERROR (Inquiry):', err.message, '\nMail options:', mailOptions);
    throw new Error(`Failed to send inquiry response email: ${err.message}`);
  }
}

async function sendAppointmentApproved(appointment) {
  if (!appointment.email) {
    console.warn('No email provided for appointment approval notification', appointment);
    throw new Error('No email provided');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(appointment.email)) {
    console.warn('Invalid email format:', appointment.email, appointment);
    throw new Error('Invalid email format');
  }

  console.log('Attempting to send approval email to:', appointment.email);
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'MISSING'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? 'SET' : 'MISSING'}`);
  console.log('Appointment data:', appointment);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Odamz Royal - Appointment Approved</title>
    </head>
    <body style="${emailStyles}">
      <div style="${containerStyles}">
        <img
          src="https://res.cloudinary.com/drkli5pwj/image/upload/v1753880711/odamzlogo_cqgm0c.jpg"
          alt="Odamz Royal Consultz Logo"
          style="display: block; margin: 0 auto 24px; max-width: 150px; border-radius: 12px;"
        >
        <h2 style="color: #f97316; font-size: 24px; font-weight: bold; text-align: center; margin-bottom: 16px;">
          Appointment Approved
        </h2>
        <p style="font-size: 16px; margin-bottom: 16px;">
          Dear ${appointment.name || 'User'},
        </p>
        <p style="font-size: 16px; margin-bottom: 16px;">
          Your appointment for <strong>${appointment.service || 'a service'}</strong> on
          <strong>${
            appointment.date ? new Date(appointment.date).toLocaleString() : 'N/A'
          }</strong> has been
          <span style="color: #16a34a; font-weight: bold;">approved</span>.
        </p>
        <p style="font-size: 16px; margin-bottom: 16px;">
          We look forward to seeing you! If you have any questions, please
          <a href="mailto:info.odamzroyalty@gmail.com" style="color: #f97316; text-decoration: underline;">
            contact us
          </a>.
        </p>
        <a
          href="https://www.google.com/maps?q=CBD,+Abuja,+Nigeria"
          style="${buttonStyles}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Location
        </a>
        <div style="${footerStyles}">
          <p>
            📍 CBD, Abuja (Center Business District), Nigeria<br>
            📞 <a href="tel:+2347061198858" style="color: #f97316; text-decoration: none;">07061198858</a>,
            <a href="tel:+2348123485718" style="color: #f97316; text-decoration: none;">08123485718</a><br>
            📧 <a href="mailto:info.odamzroyalty@gmail.com" style="color: #f97316; text-decoration: none;">
              info.odamzroyalty@gmail.com
            </a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `Odamz Royal <${process.env.EMAIL_USER}>`,
    to: appointment.email,
    subject: 'Your Appointment is Approved',
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment approval email sent successfully:', info.messageId);
    return info;
  } catch (err) {
    console.error('EMAIL SEND ERROR (Appointment Approved):', err.message, '\nMail options:', mailOptions);
    throw new Error(`Failed to send appointment approval email: ${err.message}`);
  }
}

module.exports = { sendInquiryResponse, sendAppointmentApproved };