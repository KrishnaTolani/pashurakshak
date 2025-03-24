const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');

/**
 * @route   POST /api/upload/image
 * @desc    Upload single image to Cloudinary
 * @access  Public
 * @body    multipart/form-data
 * @fields  image (File), category (String), filename (String, optional)
 */
router.post('/image', uploadController.uploadImage);

module.exports = router; 