const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
const ngoRoutes = require('./routes/ngoRoutes');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Function to drop all problematic indexes
async function dropProblematicIndexes() {
  try {
    const ngosCollection = mongoose.connection.collection('ngos');
    
    // Get all indexes
    const indexes = await ngosCollection.indexes();
    console.log('Current indexes:', indexes);

    // Drop problematic indexes
    const indexesToDrop = ['codeNo_1', 'certificateNumber_1', 'recognitionNumber_1'];
    for (const indexName of indexesToDrop) {
      try {
        await ngosCollection.dropIndex(indexName);
        console.log(`Dropped index: ${indexName}`);
      } catch (error) {
        console.log(`Index ${indexName} not found or already dropped`);
      }
    }

    // Drop the entire collection and recreate it
    try {
      await ngosCollection.drop();
      console.log('Collection dropped and will be recreated');
    } catch (error) {
      console.log('Collection not found or already dropped');
    }
  } catch (error) {
    console.error('Error handling indexes:', error);
  }
}

// MongoDB connection with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pashurakshak', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    
    // Drop problematic indexes after connection
    await dropProblematicIndexes();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to MongoDB before starting the server
connectWithRetry();

// Routes
console.log('Mounting routes...');
app.use('/api/auth', require('./routes/authRoutes'));
console.log('Auth routes mounted');
app.use('/api/admin', adminRoutes);
console.log('Admin routes mounted');
app.use('/api/ngo', ngoRoutes);
console.log('NGO routes mounted');

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

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
