const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const { validateProject } = require('../middleware/validator');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/featured/list', projectController.getFeaturedProjects);
router.get('/:slug', projectController.getProject);

// Protected routes (admin only)
router.post('/', auth, validateProject, projectController.createProject);
router.put('/:id', auth, projectController.updateProject);
router.patch('/:id/featured', auth, projectController.toggleFeatured);
router.delete('/:id', auth, projectController.deleteProject);
router.post('/:id/images', auth, projectController.addProjectImages);

module.exports = router;
