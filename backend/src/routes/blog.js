const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { validateBlog } = require('../middleware/validator');

// Public routes
router.get('/', blogController.getAllPosts);
router.get('/:slug', blogController.getPost);
router.get('/:slug/comments', blogController.getComments);
router.post('/:slug/comments', blogController.addComment);

// Protected routes (admin only)
router.post('/', auth, validateBlog, blogController.createPost);
router.put('/:id', auth, blogController.updatePost);
router.delete('/:id', auth, blogController.deletePost);
router.patch('/:id/publish', auth, blogController.togglePublish);

module.exports = router;
