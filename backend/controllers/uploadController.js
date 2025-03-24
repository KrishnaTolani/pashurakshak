const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

/**
 * Upload an image to Cloudinary using express-fileupload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.uploadImage = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Get category and filename from request
    const { category, filename } = req.body;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Image category is required (certificates or rescue)'
      });
    }

    // Validate category
    if (!['certificates', 'rescue'].includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be either "certificates" or "rescue"'
      });
    }

    // Get the uploaded file
    const imageFile = req.files.image;
    console.log('Uploaded file:', {
      name: imageFile.name,
      mimetype: imageFile.mimetype,
      size: imageFile.size,
      tempFilePath: imageFile.tempFilePath
    });

    // Set folder path based on category
    const folder = `pashurakshak/${category}`;
    
    // Set upload options
    const uploadOptions = {
      folder,
      resource_type: 'auto', // Let Cloudinary detect the resource type
    };
    
    // Use provided filename if available
    if (filename) {
      uploadOptions.public_id = filename;
    }

    // Log upload attempt
    console.log('Attempting to upload to Cloudinary:', {
      folder,
      options: uploadOptions
    });

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.tempFilePath, uploadOptions);
    
    // Remove temporary file after upload
    fs.unlinkSync(imageFile.tempFilePath);

    // Log successful upload
    console.log('Successfully uploaded to Cloudinary:', {
      url: result.secure_url,
      public_id: result.public_id
    });

    // Return success response with image URL
    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
        public_id: result.public_id
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // Clean up any temporary file if it exists
    if (req.files && req.files.image && req.files.image.tempFilePath) {
      try {
        fs.unlinkSync(req.files.image.tempFilePath);
      } catch (err) {
        console.error('Error deleting temporary file:', err);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
}; 