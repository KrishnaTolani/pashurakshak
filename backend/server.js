const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { protectNgo } = require('./middleware/authMiddleware');
const { sendVolunteerEmail } = require('./config/email');
const Volunteer = require('./models/volunteerModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Add debug logging for MongoDB connection
mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Verify email service
const verifyEmailService = async () => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        await transporter.verify();
        console.log('✅ Email Service Ready');
    } catch (error) {
        console.error('❌ Email Service Error:', error);
    }
};

verifyEmailService();

// Debug middleware - log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'PashuRakshak API is running'
    });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Basic validation
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, email, password, phone'
            });
        }

        // Return success for now (you can add actual user creation later)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                name,
                email,
                phone
            }
        });
    } catch (error) {
        console.error('Error in user registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Return success for now (you can add actual authentication later)
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                email,
                token: 'dummy_token_for_testing'
            }
        });
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email'
            });
        }

        // For testing, just return success
        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing forgot password request',
            error: error.message
        });
    }
});

app.post('/api/auth/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide new password'
            });
        }

        // For testing, just return success
        res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
});

// Test endpoints
app.get('/api/test/hello', (req, res) => {
    res.json({
        success: true,
        message: 'Hello from test API!'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        endpoints: {
            test: '/api/test/hello',
            volunteers: {
                add: 'POST /api/volunteers/add (Requires NGO token)',
                list: 'GET /api/volunteers (Requires NGO token)'
            }
        }
    });
});

// Add volunteer endpoint - Protected, requires NGO authentication
app.post('/api/volunteers/add', protectNgo, async (req, res) => {
    try {
        const { name, email } = req.body;
        
        console.log('Adding volunteer:', { name, email, ngoId: req.ngo._id });
        
        // Basic validation
        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both name and email'
            });
        }

        // Check if volunteer already exists
        const existingVolunteer = await Volunteer.findOne({ email });
        if (existingVolunteer) {
            console.log('Volunteer already exists:', existingVolunteer);
            return res.status(400).json({
                success: false,
                message: 'Volunteer with this email already exists'
            });
        }

        // Generate a random password
        const password = crypto.randomBytes(4).toString('hex');

        // Create new volunteer
        const volunteerData = {
            name,
            email,
            password,
            ngo: req.ngo._id
        };
        console.log('Creating volunteer with data:', { ...volunteerData, password: '****' });
        
        const volunteer = await Volunteer.create(volunteerData);
        console.log('Volunteer created successfully:', volunteer);

        // Send welcome email to volunteer
        const emailSent = await sendVolunteerEmail(email, name, password, req.ngo.name);
        
        if (!emailSent) {
            console.warn('Failed to send welcome email to volunteer:', email);
        }

        // Return success response
        res.status(201).json({
            success: true,
            message: emailSent ? 'Volunteer added successfully and welcome email sent' : 'Volunteer added successfully but email failed',
            data: {
                id: volunteer._id,
                name: volunteer.name,
                email: volunteer.email,
                createdAt: volunteer.createdAt,
                ngo: {
                    id: req.ngo._id,
                    name: req.ngo.name
                }
            }
        });
    } catch (error) {
        console.error('Error adding volunteer:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding volunteer',
            error: error.message
        });
    }
});

// Remove volunteer endpoint
app.delete('/api/volunteers/remove/:volunteerId', protectNgo, async (req, res) => {
    try {
        const { volunteerId } = req.params;
        const ngo = req.ngo;

        // Find and remove the volunteer
        const volunteer = await Volunteer.findOne({ 
            _id: volunteerId,
            ngo: ngo._id 
        });

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                message: "Volunteer not found or doesn't belong to your NGO"
            });
        }

        // Delete the volunteer
        await Volunteer.deleteOne({ _id: volunteerId });

        res.status(200).json({
            success: true,
            message: "Volunteer removed successfully",
            data: {
                volunteerId: volunteer._id,
                name: volunteer.name,
                email: volunteer.email
            }
        });

    } catch (error) {
        console.error('Error removing volunteer:', error);
        res.status(500).json({
            success: false,
            message: "Failed to remove volunteer",
            error: error.message
        });
    }
});

// Admin routes
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if it's the admin credentials from .env
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Generate admin token
            const token = 'admin_' + crypto.randomBytes(32).toString('hex');

            res.status(200).json({
                success: true,
                message: 'Admin login successful',
                data: {
                    token,
                    email
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid admin credentials'
            });
        }
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

app.get('/api/admin/verify', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || !token.startsWith('admin_')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin token'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Admin token verified'
        });
    } catch (error) {
        console.error('Error verifying admin token:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying token',
            error: error.message
        });
    }
});

// NGO routes
app.post('/api/ngo/register', async (req, res) => {
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

        // Basic validation
        if (!name || !email || !password || !contactPerson || !organizationType || !registrationNumber || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // For now, create a simple response (you can add actual NGO creation later)
        const token = jwt.sign(
            { id: Date.now(), email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            message: 'NGO registration successful, pending admin approval',
            data: {
                name,
                email,
                token,
                status: 'pending',
                registrationNumber,
                organizationType,
                address,
                focusAreas: focusAreas || [],
                website: website || null,
                documents: documents || {}
            }
        });
    } catch (error) {
        console.error('Error in NGO registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error registering NGO',
            error: error.message
        });
    }
});

// NGO login route
app.post('/api/ngo/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // For testing, generate a token with proper MongoDB ObjectId
        const ngoId = new mongoose.Types.ObjectId();
        const token = jwt.sign(
            { 
                id: ngoId.toString(),
                email 
            },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            message: 'NGO login successful',
            data: {
                id: ngoId,
                email,
                token
            }
        });
    } catch (error) {
        console.error('Error in NGO login:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
});

// NGO profile and status routes
app.get('/api/ngo/profile', protectNgo, async (req, res) => {
    try {
        // For testing, return dummy NGO profile
        res.status(200).json({
            success: true,
            data: {
                id: req.ngo._id,
                name: req.ngo.name,
                email: req.ngo.email,
                status: 'approved',
                organizationType: req.ngo.organizationType,
                registrationNumber: req.ngo.registrationNumber
            }
        });
    } catch (error) {
        console.error('Error getting NGO profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting NGO profile',
            error: error.message
        });
    }
});

app.get('/api/ngo/status/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // For testing, return dummy status
        res.status(200).json({
            success: true,
            data: {
                id,
                status: 'pending',
                message: 'Your registration is under review'
            }
        });
    } catch (error) {
        console.error('Error checking NGO status:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking NGO status',
            error: error.message
        });
    }
});

// Admin NGO management routes
app.get('/api/admin/registrations', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || !token.startsWith('admin_')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin token'
            });
        }

        // For testing, return dummy registrations
        res.status(200).json({
            success: true,
            data: [
                {
                    id: '1',
                    name: 'Test NGO 1',
                    status: 'pending',
                    submittedAt: new Date()
                },
                {
                    id: '2',
                    name: 'Test NGO 2',
                    status: 'approved',
                    submittedAt: new Date()
                }
            ]
        });
    } catch (error) {
        console.error('Error getting NGO registrations:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting NGO registrations',
            error: error.message
        });
    }
});

app.put('/api/admin/registrations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || !token.startsWith('admin_')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin token'
            });
        }

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide valid status (approved/rejected)'
            });
        }

        // For testing, return success
        res.status(200).json({
            success: true,
            message: `NGO registration ${status}`,
            data: {
                id,
                status,
                updatedAt: new Date()
            }
        });
    } catch (error) {
        console.error('Error updating NGO registration:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating NGO registration',
            error: error.message
        });
    }
});

app.get('/api/admin/ngo/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization?.split(' ')[1];

        if (!token || !token.startsWith('admin_')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid admin token'
            });
        }

        // For testing, return dummy NGO profile
        res.status(200).json({
            success: true,
            data: {
                id,
                name: 'Test NGO',
                email: 'test@ngo.com',
                status: 'pending',
                organizationType: 'Animal Welfare',
                registrationNumber: 'TEST123',
                documents: {
                    registrationCertificate: 'url_here',
                    taxExemptionCertificate: 'url_here'
                }
            }
        });
    } catch (error) {
        console.error('Error getting NGO profile:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting NGO profile',
            error: error.message
        });
    }
});

// Image upload route
app.post('/api/upload/image', async (req, res) => {
    try {
        // For testing, return dummy upload response
        res.status(200).json({
            success: true,
            data: {
                url: 'https://res.cloudinary.com/example/image.jpg',
                public_id: 'example_id'
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.path}`
    });
});

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log('\nAvailable endpoints:');
    console.log('1. GET  http://localhost:5000/api/test/hello           - Test endpoint (Public)');
    console.log('2. POST http://localhost:5000/api/volunteers/add       - Add volunteer (Requires NGO token)');
    console.log('3. GET  http://localhost:5000/api/volunteers          - List volunteers (Requires NGO token)');
    console.log('\nExample POST data for adding volunteer:');
    console.log({
        name: "John Doe",
        email: "john@example.com"
    });
    console.log('\nRequired headers for protected endpoints:');
    console.log('Authorization: Bearer your_ngo_token_here');
});
