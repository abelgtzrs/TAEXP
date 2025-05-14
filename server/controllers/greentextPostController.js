const GreentextPost = require('../models/greentextPost');

const getPublishedPosts = async (req, res) => {
    try {
        const {page = 1, limit = 10, sortBy = 'volume_number', order = 'asc'} = req.query;
        const sortOrder = order === 'desc' ? -1 : 1;

        const posts = await GreentextPost.find({ status: 'published' })
            .sort({ [sortBy]: sortOrder })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
      
        const totalPosts = await GreentextPost.countDocuments({ status: 'published' });

        res.status(200).json({
            message: "Published posts fetched successfully.",
            data: posts,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalPosts / parseInt(limit)),
            totalPosts
        });
    } catch (error) {
        console.error("Error in getPublishedPosts:", error.message);
        res.status(500).json({ message: "Error fetching published posts.", error: error.message });
  }
};

const getPostByVolumeNumber = async (req, res) => {
  try {
    const post = await GreentextPost.findOne({ 
      volume_number: req.params.volumeNumber, 
      status: 'published' 
    });

    if (post) {
      res.status(200).json({ message: "Post fetched successfully.", data: post });
    } else {
      res.status(404).json({ message: "Error: Published post not found with this volume number." });
    }
  } catch (error) {
    console.error("Error in getPostByVolumeNumber:", error.message);
    res.status(500).json({ message: "Error fetching post.", error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    // Destructure expected fields from request body
    const { 
      volume_number, 
      title, 
      story_content_raw, 
      blessings_intro, 
      blessings_list, 
      edition_footer,
      tags,
      status, // Admin might set status directly, or it defaults to 'draft'
      publication_date 
    } = req.body;
        
    if (!volume_number || !title || !story_content_raw) {
      return res.status(400).json({ message: "Error: Missing required fields (volume_number, title, story_content_raw)." });
    }

    const newPost = new GreentextPost({
      volume_number,
      title,
      story_content_raw,
      blessings_intro,
      blessings_list,
      edition_footer,
      tags,
      status: status || 'draft', // Default to draft if not provided
      publication_date: publication_date || Date.now()
    });

    const savedPost = await newPost.save(); // Mongoose pre-save middleware will run here
    res.status(201).json({ message: "Post created successfully.", data: savedPost });

  } catch (error) {
    console.error("Error in createPost:", error.message);
    // Handle potential duplicate volume_number error (code 11000)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.volume_number) {
        return res.status(409).json({ message: `Error: Volume number ${error.keyValue.volume_number} already exists.`, error: error.message });
    }
    res.status(500).json({ message: "Error creating post.", error: error.message });
  }
};

const getAllPostsForAdmin = async (req, res) => {
  try {
    // Add pagination and filtering/sorting later
    const posts = await GreentextPost.find({}).sort({ volume_number: -1 }); // Sort by volume_number descending
    res.status(200).json({ message: "All posts fetched for admin.", data: posts, count: posts.length });
  } catch (error) {
    console.error("Error in getAllPostsForAdmin:", error.message);
    res.status(500).json({ message: "Error fetching all posts for admin.", error: error.message });
  }
};

const getPostByIdForAdmin = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid post ID format." });
    }
    const post = await GreentextPost.findById(req.params.id);
    if (post) {
      res.status(200).json({ message: "Post fetched for admin successfully.", data: post });
    } else {
      res.status(404).json({ message: "Error: Post not found with this ID." });
    }
  } catch (error) {
    console.error("Error in getPostByIdForAdmin:", error.message);
    res.status(500).json({ message: "Error fetching post for admin.", error: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid post ID format." });
    }
    const updatedPost = await GreentextPost.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // new: true returns modified doc, runValidators ensures schema validation
    );

    if (updatedPost) {
      res.status(200).json({ message: "Post updated successfully.", data: updatedPost });
    } else {
      res.status(404).json({ message: "Error: Post not found, cannot update." });
    }
  } catch (error) {
    console.error("Error in updatePost:", error.message);
     if (error.code === 11000 && error.keyPattern && error.keyPattern.volume_number) {
        return res.status(409).json({ message: `Error: Volume number ${error.keyValue.volume_number} already exists.`, error: error.message });
    }
    res.status(500).json({ message: "Error updating post.", error: error.message });
  }
};

const softDeletePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid post ID format." });
    }
    const post = await GreentextPost.findByIdAndUpdate(
      req.params.id,
      { status: 'deleted', updated_at: Date.now() }, // Also update 'updated_at' manually here if pre-save doesn't run on status change alone
      { new: true }
    );

    if (post) {
      res.status(200).json({ message: "Post soft deleted successfully.", data: { id: post._id, status: post.status } });
    } else {
      res.status(404).json({ message: "Error: Post not found, cannot delete." });
    }
  } catch (error) {
    console.error("Error in softDeletePost:", error.message);
    res.status(500).json({ message: "Error soft deleting post.", error: error.message });
  }
};

const restorePost = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Error: Invalid post ID format." });
    }
    const post = await GreentextPost.findByIdAndUpdate(
      req.params.id,
      { status: 'draft', updated_at: Date.now() }, // Update 'updated_at'
      { new: true }
    );

    if (post) {
      res.status(200).json({ message: "Post restored to drafts successfully.", data: post });
    } else {
      res.status(404).json({ message: "Error: Post not found, cannot restore." });
    }
  } catch (error) {
    console.error("Error in restorePost:", error.message);
    res.status(500).json({ message: "Error restoring post.", error: error.message });
  }
};

module.exports = {
  getPublishedPosts,
  getPostByVolumeNumber,
  createPost,
  getAllPostsForAdmin,
  getPostByIdForAdmin,
  updatePost,
  softDeletePost,
  restorePost
};