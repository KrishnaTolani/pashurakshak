const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Ngo = require('../models/Ngo');
const emailService = require('../utils/emailService');
const bcrypt = require('bcryptjs');
const adminController = require('../controllers/adminController');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check admin credentials
    if (
      (email === 'admin@pashurakshak.org' || email === 'admin@pashurakshak.com') &&
      password === 'admin123'
    ) {
      // Generate JWT token
      const token = jwt.sign(
        { id: 'admin', role: 'admin', email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      // Send response with token and user data
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            email,
            role: 'admin'
          }
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login'
    });
  }
});

// Protected admin routes
router.use(auth);

// Verify admin token
router.get('/verify', (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

// Get NGO profile by ID (Admin only)
router.get('/ngo/:id', adminController.getNgoById);

// Get all NGO registrations
router.get('/registrations', async (req, res) => {
  try {
    const ngos = await Ngo.find()
      .sort({ createdAt: -1 })
      .select('name email status organizationType address.state createdAt');

    res.json({
      success: true,
      registrations: ngos
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching registrations'
    });
  }
});

// Update NGO registration status
router.put('/registrations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Get the current NGO
    const currentNgo = await Ngo.findById(id);
    if (!currentNgo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    // Check if status is already set to the requested status
    if (currentNgo.status === status) {
      return res.status(400).json({
        success: false,
        message: `NGO is already ${status}`
      });
    }

    // If approving, generate a new password
    let password = null;
    if (status === 'approved') {
      // Generate a random password
      password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update NGO with new password and status
      await Ngo.findByIdAndUpdate(id, {
        password: hashedPassword,
        status
      });

      // Send approval email with login credentials
      await emailService.sendApprovalEmail(currentNgo.email, password, currentNgo.name);
    } else if (status === 'rejected') {
      // Update status and send rejection email
      await Ngo.findByIdAndUpdate(id, { status });
      await emailService.sendRejectionEmail(currentNgo.email, currentNgo.name);
    } else {
      // For any other status update
      await Ngo.findByIdAndUpdate(id, { status });
      await emailService.sendStatusUpdateEmail(currentNgo.email, currentNgo.name, status);
    }

    res.json({
      success: true,
      message: `NGO status updated to ${status}`,
      data: {
        id: currentNgo._id,
        name: currentNgo.name,
        email: currentNgo.email,
        status
      }
    });
  } catch (error) {
    console.error('Error updating NGO:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating NGO status'
    });
  }
});

module.exports = router; 