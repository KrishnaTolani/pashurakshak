const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword } = require('../controllers/authController');
const Ngo = require('../models/Ngo');
const emailService = require('../utils/emailService');
const jwt = require('jsonwebtoken');

// NGO Registration
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactPerson,
      organizationType,
      registrationNumber,
      address,
      focusAreas,
      website,
      documents
    } = req.body;

    // Check if NGO already exists
    const existingNgo = await Ngo.findOne({ email });
    if (existingNgo) {
      return res.status(400).json({
        success: false,
        message: 'An NGO with this email already exists'
      });
    }

    // Create new NGO
    const ngo = await Ngo.create({
      name,
      email,
      password,
      contactPerson,
      organizationType,
      registrationNumber,
      address,
      focusAreas,
      website,
      documents,
      status: 'pending'
    });

    // Send registration confirmation email
    await emailService.sendRegistrationEmail(email, name, ngo._id);

    res.status(201).json({
      success: true,
      message: 'NGO registration submitted successfully',
      data: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        status: ngo.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in NGO registration',
      error: error.message
    });
  }
});

// NGO Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await Ngo.findOne({ email }).select('+password');
    if (!ngo || !(await ngo.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if NGO is approved
    if (ngo.status !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your registration is pending approval'
      });
    }

    const token = jwt.sign(
      { id: ngo._id, role: 'ngo' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        ngo: {
          id: ngo._id,
          name: ngo.name,
          email: ngo.email,
          status: ngo.status
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

module.exports = router;
