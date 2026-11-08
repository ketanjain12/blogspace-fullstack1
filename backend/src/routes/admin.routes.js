
const router = require('express').Router();

const c = require('../controllers/admin.controller');
const {
    authenticate,
    requireAdmin
} = require('../middleware/auth.middleware');

// Apply authentication and admin authorization
router.use(authenticate, requireAdmin);

// Dashboard statistics
router.get('/stats', c.stats);

// Post routes
router.get('/posts', c.listPosts);
router.post('/posts', c.createPost);
router.put('/posts/:id', c.updatePost);
router.delete('/posts/:id', c.deletePost);

// User routes
router.get('/users', c.listUsers);
router.put('/users/:id', c.updateUser);
router.delete('/users/:id', c.deleteUser);

module.exports = router;
