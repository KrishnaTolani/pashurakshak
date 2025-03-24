const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const User = require('../models/User');
const emailService = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// User Registration (was NGO Registration before)
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in user registration',
      error: error.message
    });
  }
});

// User Login (was NGO Login before)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
});

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Render the reset password page when users click on the link in the email
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Hash the token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    
    // Find user with valid token and expiration
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.render('resetPasswordPage', {
        validToken: false,
        error: 'Password reset token is invalid or has expired',
        token: ''
      });
    }
    
    // Render the password reset page
    return res.render('resetPasswordPage', {
      validToken: true,
      error: '',
      token: token
    });
  } catch (error) {
    console.error('Reset password page error:', error);
    res.render('resetPasswordPage', {
      validToken: false,
      error: 'An error occurred. Please try again.',
      token: ''
    });
  }
});

module.exports = router;
