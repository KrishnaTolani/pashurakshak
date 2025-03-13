const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const {
  registerNgo,
  loginNgo,
  getAllNgos,
  approveNgo,
  rejectNgo,
  getNgoPendingRequests,
  getNgoProfile
} = require('../controllers/ngoController');
const Ngo = require('../models/Ngo');

// Public routes
router.post('/register', registerNgo);
router.post('/login', loginNgo);

// Protected routes
router.use(protect);

// NGO routes
router.get('/profile', restrictTo('ngo'), getNgoProfile);

// Admin only routes
router.get('/all', restrictTo('admin'), getAllNgos);
router.get('/pending', restrictTo('admin'), getNgoPendingRequests);
router.patch('/approve/:id', restrictTo('admin'), approveNgo);
router.patch('/reject/:id', restrictTo('admin'), rejectNgo);

// Register new NGO
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      codeNo,
      certificateNumber,
      recognitionYear,
      state,
      district,
      address,
      pincode,
      email,
      phone,
      contactPerson,
      organizationType,
      focusAreas,
      registrationCertificate,
      panCard
    } = req.body;

    // Check if NGO already exists
    const existingNGO = await Ngo.findOne({
      $or: [
        { email },
        { codeNo },
        { certificateNumber }
      ]
    });

    if (existingNGO) {
      return res.status(400).json({
        success: false,
        message: 'NGO already registered with this email, code number, or certificate number'
      });
    }

    // Create new NGO
    const ngo = await Ngo.create({
      name,
      codeNo,
      certificateNumber,
      recognitionYear,
      state,
      district,
      address,
      pincode,
      email,
      phone,
      contactPerson,
      organizationType,
      focusAreas,
      registrationCertificate,
      panCard,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'NGO registration submitted successfully',
      data: ngo
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering NGO'
    });
  }
});

// Get NGO status
router.get('/status/:id', async (req, res) => {
  try {
    const ngo = await Ngo.findById(req.params.id)
      .select('name status createdAt');

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }

    res.json({
      success: true,
      data: ngo
    });
  } catch (error) {
    console.error('Error fetching NGO status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching NGO status'
    });
  }
});

module.exports = router; 