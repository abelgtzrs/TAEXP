// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/authController');

// @route   POST /api/auth/register
// @desc    Register a new admin (should be protected or used for initial setup)
router.post('/register', registerAdmin);

// @route   POST /api/auth/login
// @desc    Authenticate admin and get token
router.post('/login', loginAdmin);

module.exports = router;
