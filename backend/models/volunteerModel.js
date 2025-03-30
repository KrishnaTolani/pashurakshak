const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide volunteer name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide volunteer email'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NGO',
        required: [true, 'Volunteer must belong to an NGO']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create indexes
volunteerSchema.index({ email: 1 });
volunteerSchema.index({ ngo: 1 });

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer; 