const express = require('express');
const cors = require('cors');
const path = require('path');

const createApp = () => {
  const app = express();

  // Determine allowed origins from environment
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000'
  ];

  // Middleware
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Set up EJS as the view engine
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  // Basic route for API health check
  app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
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

  return app;
};

module.exports = createApp; 