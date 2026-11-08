
const router = require('express').Router();

const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Register a new user
router.post('/register', controller.register);

// User login
router.post('/login', controller.login);

router.get('/me', authenticate, controller.me);

module.exports = router;
