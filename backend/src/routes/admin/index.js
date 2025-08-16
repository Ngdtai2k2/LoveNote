const router = require('express').Router();

const statsRoutes = require('./stats');
const usersRoutes = require('./users');
const logsRoutes = require('./logs');
const voucherRoutes = require('./voucher');
const contactRoutes = require('./contact');
const bannerRoutes = require('./banner');
const shortLinkProviderRoutes = require('./shortLinkProvider');

router.use('/stats', statsRoutes);
router.use('/users', usersRoutes);
router.use('/logs', logsRoutes);
router.use('/voucher', voucherRoutes);
router.use('/contact', contactRoutes);
router.use('/banner', bannerRoutes);
router.use('/shortener-provider', shortLinkProviderRoutes);

module.exports = router;
