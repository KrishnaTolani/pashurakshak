const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ngoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide NGO name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  contactPerson: {
    name: {
      type: String,
      required: [true, 'Please provide contact person name'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact person phone'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide contact person email'],
      lowercase: true,
      trim: true
    }
  },
  organizationType: {
    type: String,
    required: [true, 'Please provide organization type'],
    enum: ['Animal Welfare', 'Wildlife Conservation', 'Pet Adoption', 'Other']
  },
  registrationNumber: {
    type: String,
    required: [true, 'Please provide registration number'],
    trim: true
  },
  address: {
    street: String,
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'Please provide state'],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, 'Please provide pincode'],
      trim: true
    }
  },
  focusAreas: [{
    type: String,
    required: true,
    trim: true
  }],
  website: {
    type: String,
    trim: true
  },
  documents: {
    registrationCertificate: {
      type: String,
      required: [true, 'Please provide registration certificate']
    },
    taxExemptionCertificate: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
ngoSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
ngoSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Ngo', ngoSchema); 