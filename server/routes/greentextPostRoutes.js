const express = require('express');
const router = express.Router();

const greentextPostController = require('../controllers/greentextPostController');

router.get('/', greentextPostController.getAllPosts);
router.get('/:volume_number', greentextPostController.getPostsByVolumeNumber);

router.post('/admin', greentextPostController.createPost);
router.get('/admin', greentextPostController.getAllPostsForAdmin);
router.get('/admin/:id', greentextPostController.getPostByIdForAdmin);
router.put('/admin/:id', greentextPostController.updatePost);
router.delete('/admin/:id', greentextPostController.softDeletePost);
router.post('/admin/:id/restore', greentextPostController.restorePost);


module.exports = router;