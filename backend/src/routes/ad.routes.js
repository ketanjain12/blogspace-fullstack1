
const router = require('express').Router();

const controller = require('../controllers/ad.controller');


router.get('/', controller.list);

module.exports = router;
