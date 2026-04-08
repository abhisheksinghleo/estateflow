const express = require('express');

const authRoutes = require('./auth.routes');
const propertyRoutes = require('./property.routes');
const inquiryRoutes = require('./inquiry.routes');
const favoriteRoutes = require('./favorite.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/properties', propertyRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
