const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validateBody } = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../schemas/inspectSchema');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public Authentication Routes
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);

// Protected Authentication Profile Route
router.get('/me', authMiddleware, getMe);

module.exports = router;
