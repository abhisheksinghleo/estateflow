const express = require('express');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const authValidator = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', authValidator.registerValidator, validate, authController.register);
router.post('/login', authValidator.loginValidator, validate, authController.login);
router.get('/me', authMiddleware.authenticate, authController.me);

module.exports = router;
