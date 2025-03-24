const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

// Create transporter with environment variables
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service is ready');
  }
});

/**
 * Send password reset email with dynamic links
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.resetLink - Reset password link
 * @param {string} options.userName - User's name
 * @returns {Promise<boolean>} - Success status
 */
const sendPasswordResetEmail = async ({ email, resetLink, userName }) => {
  try {
    // Make sure the resetLink is using the backend URL
    if (!resetLink.includes(process.env.BACKEND_URL) && process.env.BACKEND_URL) {
      // Extract token from the link
      const token = resetLink.split('/').pop();
      resetLink = `${process.env.BACKEND_URL}/api/auth/reset-password/${token}`;
    }

    const templatePath = path.join(__dirname, '../views/resetPassword.ejs');
    const html = await ejs.renderFile(templatePath, {
      resetLink,
      userName: userName || 'User'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - Action Required',
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
}; 