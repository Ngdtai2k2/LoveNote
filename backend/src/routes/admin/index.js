const router = require('express').Router();

const statsRoutes = require('./stats');
const usersRoutes = require('./users');
const logsRoutes = require('./logs');
const shortLinkProviderRoutes = require('./shortLinkProvider');
const voucherRoutes = require('./voucher');

router.use('/stats', statsRoutes);
router.use('/users', usersRoutes);
router.use('/logs', logsRoutes);
router.use('/shortener-provider', shortLinkProviderRoutes);
router.use('/voucher', voucherRoutes);

module.exports = router;
