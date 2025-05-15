// server/routes/greentextPostRoutes.js

const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/greentextPostController');
const { protect, admin } = require('../middleware/authMiddleware'); // Assuming this path is correct

// ----- Admin Routes (Protected) -----
// Ensure these are defined before routes with similar path structures like /:volume_number
router.post('/admin',                 protect, admin, ctrl.createPost);
router.get ('/admin',                 protect, admin, ctrl.getAllPostsForAdmin);
router.get ('/admin/:id',             protect, admin, ctrl.getPostByIdForAdmin);
router.put ('/admin/:id',             protect, admin, ctrl.updatePost);
router.delete('/admin/:id',           protect, admin, ctrl.softDeletePost);
router.post('/admin/:id/restore',     protect, admin, ctrl.restorePost);

// ----- Public Routes -----
router.get('/',                       ctrl.getAllPosts); // Renamed in your controller
router.get('/:volume_number',         ctrl.getPostByVolumeNumber);

module.exports = router;
