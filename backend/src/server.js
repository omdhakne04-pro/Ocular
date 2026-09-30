const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const inspectRoutes = require('./routes/inspectRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      // In development, allow localhost origins
      if (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin === CLIENT_URL ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for hackathon testing
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsing Middleware
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check & Root Endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    system: 'Ocular Visual Intelligence Engine',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      gemini_ai: process.env.GEMINI_API_KEY ? 'configured' : 'fallback-simulation',
      supabase_db: process.env.SUPABASE_URL ? 'configured' : 'in-memory-fallback',
    },
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Ocular API - Enterprise Visual Intelligence & Assistive Inspection Platform',
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      inspect: [
        'POST /api/inspect/analyze (multipart image + mode)',
        'GET /api/inspect/history',
        'GET /api/inspect/metrics',
      ],
      health: 'GET /health',
    },
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/inspect', inspectRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err);

  // Multer File Upload Errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size limit exceeded. Maximum allowed size is 10MB.',
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
    });
  }

  return res.status(err.status || 500).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`👁️  OCULAR BACKEND SERVER RUNNING ON PORT: ${PORT}`);
  console.log(`🌐  Local Health Check: http://localhost:${PORT}/health`);
  console.log(`🔒  Client URL: ${CLIENT_URL}`);
  console.log('====================================================');
});

module.exports = app;
