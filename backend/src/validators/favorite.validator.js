const { param } = require('express-validator');

const favoriteParamValidator = [
  param('propertyId')
    .trim()
    .notEmpty()
    .withMessage('propertyId is required')
    .isString()
    .withMessage('propertyId must be a string'),
];

module.exports = {
  favoriteParamValidator,
};
