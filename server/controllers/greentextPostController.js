// controllers/greentextPostController.js
const mongoose      = require('mongoose');
const GreentextPost = require('../models/GreentextPost'); // path & case

/* ---------- PUBLIC ---------- */
exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'volume_number',
      order = 'asc',
    } = req.query;

    const sortOrder  = order === 'desc' ? -1 : 1;
    const query      = { status: 'published' };
    const totalPosts = await GreentextPost.countDocuments(query);

    const posts = await GreentextPost.find(query)
      .sort({ [sortBy]: sortOrder })
      .limit(+limit)
      .skip((+page - 1) * +limit);

    res.json({
      message: 'Published posts fetched.',
      data: posts,
      currentPage: +page,
      totalPages: Math.ceil(totalPosts / +limit),
      totalPosts,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts.', error: err.message });
  }
};

exports.getPostByVolumeNumber = async (req, res) => {
  try {
    const post = await GreentextPost.findOne({
      volume_number: req.params.volume_number,
      status: 'published',
    });

    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ message: 'Post fetched.', data: post });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching post.', error: err.message });
  }
};

/* ---------- ADMIN ---------- */
exports.createPost = async (req, res) => {
  try {
    const { volume_number, title, story_content_raw } = req.body;
    if (!volume_number || !title || !story_content_raw)
      return res
        .status(400)
        .json({ message: 'volume_number, title, story_content_raw are required.' });

    const post = await GreentextPost.create({ ...req.body });
    res.status(201).json({ message: 'Post created.', data: post });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.volume_number)
      return res.status(409).json({ message: 'Duplicate volume_number.' });
    res.status(500).json({ message: 'Create failed.', error: err.message });
  }
};

exports.getAllPostsForAdmin = async (_req, res) => {
  const posts = await GreentextPost.find().sort({ volume_number: -1 });
  res.json({ message: 'All posts (admin).', data: posts, count: posts.length });
};

exports.getPostByIdForAdmin = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid ID.' });

  const post = await GreentextPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  res.json({ message: 'Post fetched (admin).', data: post });
};

exports.updatePost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid ID.' });

  try {
    const post = await GreentextPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found.' });
    res.json({ message: 'Post updated.', data: post });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern.volume_number)
      return res.status(409).json({ message: 'Duplicate volume_number.' });
    res.status(500).json({ message: 'Update failed.', error: err.message });
  }
};

exports.softDeletePost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid ID.' });

  const post = await GreentextPost.findByIdAndUpdate(
    req.params.id,
    { status: 'deleted' },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  res.json({ message: 'Post soft-deleted.', data: { id: post._id, status: post.status } });
};

exports.restorePost = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid ID.' });

  const post = await GreentextPost.findByIdAndUpdate(
    req.params.id,
    { status: 'draft' },
    { new: true }
  );
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  res.json({ message: 'Post restored to draft.', data: post });
};
