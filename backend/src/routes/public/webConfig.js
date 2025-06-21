const router = require('express').Router();
const webConfigController = require('@controllers/public/webConfig');

router.get('/all', webConfigController.getAll);

module.exports = router;
