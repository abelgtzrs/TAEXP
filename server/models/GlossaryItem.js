const mongoose = require('mongoose');

// Define the schema for Glossary Items
const GlossaryItemSchema = new mongoose.Schema({
  term: {
    type: String,
    required: [true, 'Glossary term is required.'],
    unique: true, // Each term must be unique
    trim: true,   // Remove leading/trailing whitespace
    index: true   // Create an index for faster queries on term
  },
  description: {
    type: String,
    required: [true, 'Glossary description is required.'],
    trim: true
  },
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true // Once set, this should not change
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the 'updated_at' timestamp before saving
GlossaryItemSchema.pre('save', function(next) {
  // Only update 'updated_at' if the document is being modified (not on creation)
  // or if it's a new document (though default handles creation, this is belt-and-suspenders)
  if (this.isModified() || this.isNew) {
    this.updated_at = Date.now();
  }
  next(); // Continue with the save operation
});

// Create and export the Mongoose model
// For 'GlossaryItem', the collection will be 'glossaryitems'.
module.exports = mongoose.model('GlossaryItem', GlossaryItemSchema);