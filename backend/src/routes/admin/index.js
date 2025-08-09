const router = require('express').Router();

const statsRoutes = require('./stats');
const usersRoutes = require('./users');

router.use('/stats', statsRoutes);
router.use('/users', usersRoutes);

module.exports = router;
