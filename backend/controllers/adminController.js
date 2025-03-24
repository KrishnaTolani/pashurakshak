const Ngo = require('../models/Ngo');

/**
 * Get complete profile of an NGO by ID (Admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getNgoById = async (req, res) => {
  try {
    const ngoId = req.params.id;
    
    // Find the NGO by ID
    const ngo = await Ngo.findById(ngoId);
    
    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: 'NGO not found'
      });
    }
    
    // Return the complete NGO profile
    return res.status(200).json({
      success: true,
      data: ngo
    });
  } catch (error) {
    console.error('Error getting NGO profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving NGO profile',
      error: error.message
    });
  }
}; 