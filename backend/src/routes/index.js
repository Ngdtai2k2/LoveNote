const express = require('express');
const router = express.Router();

const userRoutes = require('./public');

router.use('/', userRoutes);

module.exports = router;
