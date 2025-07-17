const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const productRoutes = require('./product');
const bannerRoutes = require('./banner');
const webConfigRoutes = require('./webConfig');
const userSitesRoutes = require('./userSites');
const contactRoutes = require('./contact');
const taskRoutes = require('./task');
const shortLinkProviderRoute = require('./shortLinkProvider');
const voucherRoute = require('./voucher');

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/banner', bannerRoutes);
router.use('/web-config', webConfigRoutes);
router.use('/site', userSitesRoutes);
router.use('/contact', contactRoutes);
router.use('/task', taskRoutes);
router.use('/shortener-provider', shortLinkProviderRoute);
router.use('/voucher', voucherRoute);

module.exports = router;
