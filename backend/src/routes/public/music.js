const router = require('express').Router();
const musicController = require('@controllers/public/music');

router.get('/', musicController.getAll);

module.exports = router;
