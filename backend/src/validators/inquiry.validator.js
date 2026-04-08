const { body } = require('express-validator');

const createInquiryValidator = [
  body('propertyId')
    .trim()
    .notEmpty()
    .withMessage('propertyId is required'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('message is required')
    .isLength({ min: 5, max: 2000 })
    .withMessage('message must be between 5 and 2000 characters')
];

module.exports = {
  createInquiryValidator
};
