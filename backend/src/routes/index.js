const express = require('express');
const router = express.Router();

const userRoutes = require('./public');
const adminRoutes = require('./admin');

const fs = require('fs').promises;
const path = require('path');

const logFilePath = path.resolve(
  __dirname,
  '..',
  '..',
  'logs',
  'autoDeleteExpiredUserSites.log'
);

router.get('/logs/auto-delete', async (req, res) => {
  try {
    const data = await fs.readFile(logFilePath, 'utf-8');
    res.status(200).json({ data });
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.status(200).json({ data: '' });
    } else {
      res.status(500).json({ error: 'Failed to read log file' });
    }
  }
});

router.use('/', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
