const express = require('express');
const cors = require('cors');
const path = require('path');

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
  }));

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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