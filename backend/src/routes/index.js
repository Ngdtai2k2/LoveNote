const express = require('express');
const router = express.Router();

const userRoutes = require('./public');
const adminRoutes = require('./admin');

router.use('/', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
