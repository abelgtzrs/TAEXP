// server/controllers/authController.js

const User = require('../models/User'); // Assuming your User model is in User.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access JWT_SECRET from .env

// --- Helper function to generate JWT ---
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d', // e.g., '1d', '30d', '1h'
  });
};

// @desc    Register a new admin user (Primarily for initial setup)
// @route   POST /api/auth/register
// @access  Public (should be restricted after initial admin setup)
const registerAdmin = async (req, res) => {
  console.log('[AuthCtrl] registerAdmin called with body:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {
    const userExists = await User.findOne({ username: username.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // For simplicity, the first registered user is an admin.
    // In a real app, you might have a more complex role assignment or a specific admin registration key.
    const user = await User.create({
      username: username.toLowerCase(),
      password,
      role: 'admin' // Explicitly set role
    });

    if (user) {
      res.status(201).json({
        message: 'Admin user registered successfully.',
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data.' });
    }
  } catch (error) {
    console.error("Error in registerAdmin:", error.message, error.stack);
    res.status(500).json({ message: 'Error registering admin.', error: error.message });
  }
};

// @desc    Authenticate admin user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res) => {
  console.log('[AuthCtrl] loginAdmin called with body:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password.' });
  }

  try {
    const user = await User.findOne({ username: username.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      if (user.role !== 'admin') { // Ensure only admins can log in via this route if needed
        return res.status(403).json({ message: 'Access denied. Not an admin.' });
      }
      res.json({
        message: 'Login successful.',
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password.' }); // Unauthorized
    }
  } catch (error) {
    console.error("Error in loginAdmin:", error.message, error.stack);
    res.status(500).json({ message: 'Error during login.', error: error.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
console.log('[AuthCtrl] Auth controller functions exported.');
