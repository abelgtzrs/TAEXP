const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true,
    lowercase: true // Store usernames in lowercase for consistency
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters long.'] // Basic length validation
  },
  role: { // For potential future expansion if you have different user types
    type: String,
    enum: ['admin'], // For now, only 'admin'
    default: 'admin'
  },
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware to hash password before saving a new user
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    this.updated_at = Date.now();
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware/error handler
  }
});

// Method to compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update 'updated_at' timestamp before any update operation that uses 'findOneAndUpdate'
UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updated_at: Date.now() });
  next();
});


module.exports = mongoose.model('User', UserSchema);
