const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service is ready');
  }
});

const sendPasswordResetEmail = async ({ email, resetLink, userName }) => {
  try {
    const templatePath = path.join(__dirname, '../views/resetPassword.ejs');
    const html = await ejs.renderFile(templatePath, {
      resetLink,
      userName: userName || 'User'
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
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