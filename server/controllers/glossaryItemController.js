// server/controllers/glossaryItemController.js

// Import the GlossaryItem model
const GlossaryItem = require('../models/GlossaryItem'); // Ensure the path and casing are correct
const mongoose = require('mongoose');

// --- Controller Functions ---

// @desc    Get all glossary items (for viewers)
// @route   GET /api/glossary
// @access  Public
const getAllGlossaryItems = async (req, res) => {
  console.log('[GlossaryCtrl] getAllGlossaryItems called. Query:', req.query);
  try {
    const { term } = req.query; // For basic search by term
    let query = {};

    if (term) {
      // Case-insensitive search for the term
      query.term = { $regex: `^${term}$`, $options: 'i' }; 
    }

    const items = await GlossaryItem.find(query).sort({ term: 1 }); // Sort alphabetically by term
    res.status(200).json({
      message: "Glossary items fetched successfully.",
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error("Error in getAllGlossaryItems:", error.message, error.stack);
    res.status(500).json({ message: "Error fetching glossary items.", error: error.message });
  }
};

// @desc    Get all glossary items for Admin (can be same as public or different)
// @route   GET /api/glossary/admin
// @access  Private/Admin
const getAllGlossaryItemsForAdmin = async (req, res) => {
  console.log('[GlossaryCtrl] getAllGlossaryItemsForAdmin called.');
   try {
    const items = await GlossaryItem.find({}).sort({ term: 1 }); 
    res.status(200).json({
      message: "All glossary items fetched for admin.",
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error("Error in getAllGlossaryItemsForAdmin:", error.message, error.stack);
    res.status(500).json({ message: "Error fetching glossary items for admin.", error: error.message });
  }
};


// @desc    Create a new glossary item (Admin only)
// @route   POST /api/glossary/admin
// @access  Private/Admin
const createGlossaryItem = async (req, res) => {
  console.log('[GlossaryCtrl] createGlossaryItem called with body:', req.body);
  try {
    const { term, description } = req.body;

    if (!term || !description) {
      return res.status(400).json({ message: "Error: Both 'term' and 'description' are required." });
    }

    const newItem = new GlossaryItem({ term, description });
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Glossary item created successfully.", data: savedItem });

  } catch (error) {
    console.error("Error in createGlossaryItem:", error.message, error.stack);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.term) { // Handle duplicate term
        return res.status(409).json({ message: `Error: Glossary term '${error.keyValue.term}' already exists.`, error: error.message });
    }
    res.status(500).json({ message: "Error creating glossary item.", error: error.message });
  }
};

// @desc    Get a single glossary item by MongoDB _id for admin editing
// @route   GET /api/glossary/admin/:id
// @access  Private/Admin
const getGlossaryItemByIdForAdmin = async (req, res) => {
  console.log('[GlossaryCtrl] getGlossaryItemByIdForAdmin called with ID:', req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid glossary item ID format." });
    }
    const item = await GlossaryItem.findById(req.params.id);
    if (item) {
      res.status(200).json({ message: "Glossary item fetched for admin successfully.", data: item });
    } else {
      res.status(404).json({ message: "Error: Glossary item not found with this ID." });
    }
  } catch (error) {
    console.error("Error in getGlossaryItemByIdForAdmin:", error.message, error.stack);
    res.status(500).json({ message: "Error fetching glossary item for admin.", error: error.message });
  }
};

// @desc    Update an existing glossary item (Admin only)
// @route   PUT /api/glossary/admin/:id
// @access  Private/Admin
const updateGlossaryItem = async (req, res) => {
  console.log('[GlossaryCtrl] updateGlossaryItem called for ID:', req.params.id, 'with body:', req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid glossary item ID format." });
    }
    const { term, description } = req.body;
    if (!term && !description) { // Check if there's anything to update
        return res.status(400).json({ message: "Error: Nothing to update. Provide 'term' or 'description'." });
    }

    const updatedItem = await GlossaryItem.findByIdAndUpdate(
      req.params.id,
      req.body, // Mongoose will only update fields present in req.body
      { new: true, runValidators: true }
    );

    if (updatedItem) {
      res.status(200).json({ message: "Glossary item updated successfully.", data: updatedItem });
    } else {
      res.status(404).json({ message: "Error: Glossary item not found, cannot update." });
    }
  } catch (error) {
    console.error("Error in updateGlossaryItem:", error.message, error.stack);
    if (error.code === 11000 && error.keyPattern && error.keyPattern.term) { // Handle duplicate term on update
        return res.status(409).json({ message: `Error: Glossary term '${error.keyValue.term}' already exists.`, error: error.message });
    }
    res.status(500).json({ message: "Error updating glossary item.", error: error.message });
  }
};

// @desc    Delete a glossary item (Admin only)
// @route   DELETE /api/glossary/admin/:id
// @access  Private/Admin
const deleteGlossaryItem = async (req, res) => {
  console.log('[GlossaryCtrl] deleteGlossaryItem called for ID:', req.params.id);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid glossary item ID format." });
    }
    const deletedItem = await GlossaryItem.findByIdAndDelete(req.params.id);

    if (deletedItem) {
      res.status(200).json({ message: "Glossary item deleted successfully.", data: { id: deletedItem._id } });
    } else {
      res.status(404).json({ message: "Error: Glossary item not found, cannot delete." });
    }
  } catch (error) {
    console.error("Error in deleteGlossaryItem:", error.message, error.stack);
    res.status(500).json({ message: "Error deleting glossary item.", error: error.message });
  }
};

// Export all controller functions
module.exports = {
  getAllGlossaryItems,
  createGlossaryItem,
  getAllGlossaryItemsForAdmin,
  getGlossaryItemByIdForAdmin,
  updateGlossaryItem,
  deleteGlossaryItem
};
console.log('[GlossaryCtrl] Glossary controller functions exported.');
