const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ngo = require('../models/Ngo');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // First check if it's an admin user
      const adminUser = await User.findById(decoded.id);
      if (adminUser) {
        req.user = adminUser;
        req.userType = adminUser.role; // 'admin' or 'user'
        return next();
      }

      // If not admin, check NGO
      const ngo = await Ngo.findById(decoded.id);
      if (ngo) {
        req.user = ngo;
        req.userType = 'ngo';
        return next();
      }

      throw new Error('User not found');
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userType)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
}; 