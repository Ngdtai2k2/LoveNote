const router = require('express').Router();

const statsRoutes = require('./stats');
const usersRoutes = require('./users');
const logsRoutes = require('./logs');

router.use('/stats', statsRoutes);
router.use('/users', usersRoutes);
router.use('/logs', logsRoutes);

module.exports = router;
