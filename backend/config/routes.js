const setupRoutes = (app) => {
  // API Routes
  app.use('/api/auth', require('../routes/authRoutes'));
  app.use('/api/admin', require('../routes/adminRoutes'));
  app.use('/api/ngo', require('../routes/ngoRoutes'));
  app.use('/api/upload', require('../routes/uploadRoutes'));
  
  // 404 handler for undefined routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint not found'
    });
  });
  
  // Return the configured app
  return app;
};

module.exports = setupRoutes; 