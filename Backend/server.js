const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();

// CORS configuration - MUST be before other middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://openhousecaffe.netlify.app',
      'http://localhost:5173'
    ];
    
    // Allow any localhost/127.0.0.1 for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow preview/forwarded URLs (common patterns)
    if (origin.includes('gitpod.io') || 
        origin.includes('github.dev') || 
        origin.includes('codespaces') ||
        origin.includes('replit.dev')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development, allow all origins (change in production)
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MongoDB connection - Don't block server startup
let isMongoConnected = false;

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
}).then(() => {
  console.log('✅ MongoDB connected successfully');
  isMongoConnected = true;
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.warn('⚠️  Server will continue without MongoDB. Some features may not work.');
});

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established');
  isMongoConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err.message);
  isMongoConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
  isMongoConnected = false;
});

// Root endpoint for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'Server is running',
    mongoConnected: isMongoConnected,
    mongoState: mongoose.connection.readyState, // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    mongoConnected: isMongoConnected,
    mongoState: mongoose.connection.readyState,
    env: {
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongoUri: !!process.env.MONGO_URI,
      hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET)
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const healthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: {
      connected: isMongoConnected,
      readyState: mongoose.connection.readyState
    }
  };
  
  if (!isMongoConnected) {
    return res.status(503).json({ ...healthStatus, status: 'degraded' });
  }
  
  res.json(healthStatus);
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error', 
    error: err.message 
  });
});

const PORT = process.env.PORT || 5000;

// Start server regardless of MongoDB status
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Local: http://localhost:${PORT}`);
  console.log(` Network: http://0.0.0.0:${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});