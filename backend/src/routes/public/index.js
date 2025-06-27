const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const productRoutes = require('./product');
const bannerRoutes = require('./banner');
const webConfigRoutes = require('./webConfig');
const userSitesRoutes = require('./userSites');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/banner', bannerRoutes);
router.use('/web-config', webConfigRoutes);
router.use('/site', userSitesRoutes);

module.exports = router;
