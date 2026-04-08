const express = require('express');

const inquiryController = require('../controllers/inquiry.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const inquiryValidator = require('../validators/inquiry.validator');

const router = express.Router();

router.post(
  '/',
  authMiddleware.authenticate,
  inquiryValidator.createInquiryValidator,
  validate,
  inquiryController.createInquiry
);

router.get(
  '/my',
  authMiddleware.authenticate,
  inquiryController.myInquiries
);

router.get(
  '/property/:propertyId',
  authMiddleware.authenticate,
  authMiddleware.authorize('SELLER', 'AGENT', 'ADMIN_HEAD', 'ADMIN_CO_HEAD'),
  inquiryController.listPropertyInquiries
);

module.exports = router;
