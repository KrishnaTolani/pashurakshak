const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');

// Load environment variables
dotenv.config();

const app = express();

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pashurakshak')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const ngoRoutes = require('./routes/ngoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const testRoutes = require('./routes/testRoutes');

// Routes
app.use('/api/ngo', ngoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/test', testRoutes);

// Basic root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to Pashurakshak API',
        endpoints: {
            test: {
                hello: 'GET /api/test/hello',
                echo: 'POST /api/test/echo'
            },
            ngo: {
                login: 'POST /api/ngo/login'
            },
            volunteer: {
                add: 'POST /api/volunteer/add',
                list: 'GET /api/volunteer',
                delete: 'DELETE /api/volunteer/:volunteerId'
            }
        }
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('\nAvailable routes:');
    console.log('- GET  /                         (Root endpoint with API documentation)');
    console.log('- GET  /api/test/hello          (Test endpoint)');
    console.log('- POST /api/test/echo           (Echo endpoint)');
    console.log('- POST /api/ngo/login           (NGO login)');
    console.log('- POST /api/volunteer/add       (Add volunteer)');
    console.log('- GET  /api/volunteer           (List volunteers)');
    console.log('- DELETE /api/volunteer/:id     (Delete volunteer)');
}); 