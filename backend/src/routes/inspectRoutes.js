const express = require('express');
const { analyzeImage, getHistory, getMetrics } = require('../controllers/inspectController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateQuery } = require('../middleware/validate');
const { inspectQuerySchema } = require('../schemas/inspectSchema');

const router = express.Router();

// All inspection routes are protected by JWT authentication
router.use(authMiddleware);

// Analyze Image Endpoint (Multipart upload with 'image' field)
router.post('/analyze', upload.single('image'), analyzeImage);

// Historical Inspection Records
router.get('/history', validateQuery(inspectQuerySchema), getHistory);

// Analytics & Aggregated Metrics
router.get('/metrics', getMetrics);

module.exports = router;
