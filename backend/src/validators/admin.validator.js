const { body } = require('express-validator');

const updatePropertyStatusValidator = [
  body('action')
    .exists({ checkFalsy: true })
    .withMessage('action is required')
    .bail()
    .isIn(['APPROVE', 'REJECT'])
    .withMessage('action must be APPROVE or REJECT'),

  body('rejectionReason')
    .optional()
    .trim(),

  body('rejectionReason')
    .if(body('action').equals('REJECT'))
    .exists({ checkFalsy: true })
    .withMessage('rejectionReason is required when action is REJECT')
    .bail()
    .isLength({ min: 3, max: 500 })
    .withMessage('rejectionReason must be between 3 and 500 characters'),
];

module.exports = {
  updatePropertyStatusValidator,
};
