
const router = require('express').Router();

const controller = require('../controllers/post.controller');

// Get all posts
router.get('/', controller.list);

// Get post by slug
router.get('/:slug', controller.getBySlug);

module.exports = router;
