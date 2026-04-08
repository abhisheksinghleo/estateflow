const express = require('express');

const favoriteController = require('../controllers/favorite.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const favoriteValidator = require('../validators/favorite.validator');

const router = express.Router();

router.get(
  '/my/list',
  authMiddleware.authenticate,
  favoriteController.myFavorites
);

router.post(
  '/:propertyId',
  authMiddleware.authenticate,
  favoriteValidator.favoriteParamValidator,
  validate,
  favoriteController.addFavorite
);

router.delete(
  '/:propertyId',
  authMiddleware.authenticate,
  favoriteValidator.favoriteParamValidator,
  validate,
  favoriteController.removeFavorite
);

module.exports = router;
