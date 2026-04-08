const { body } = require('express-validator');

const createPropertyValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),

  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),

  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('type')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Type cannot be empty'),

  body('purpose')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Purpose cannot be empty'),

  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be an integer greater than or equal to 0'),

  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be an integer greater than or equal to 0'),

  body('area')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Area must be a positive number'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),

  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),

  body('zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Zip code cannot be empty'),
];

const updatePropertyValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('price')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),

  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address cannot be empty'),

  body('city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City cannot be empty'),

  body('type')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Type cannot be empty'),

  body('purpose')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Purpose cannot be empty'),

  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be an integer greater than or equal to 0'),

  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be an integer greater than or equal to 0'),

  body('area')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('Area must be a positive number'),

  body('state')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('State cannot be empty'),

  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country cannot be empty'),

  body('zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Zip code cannot be empty'),
];

module.exports = {
  createPropertyValidator,
  updatePropertyValidator,
};
