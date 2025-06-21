const router = require('express').Router();
const bannerController = require('@controllers/public/banner');

router.get('/all', bannerController.getAll);

module.exports = router;
