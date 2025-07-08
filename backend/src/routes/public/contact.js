const router = require('express').Router();
const contactController = require('@controllers/public/contact');

router.post('/', contactController.create);

module.exports = router;
