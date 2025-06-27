const router = require('express').Router();
const userSitesController = require('@controllers/public/userSites');
const verifyMiddleware = require('@middlewares/verifyToken');

router.get('/configs', userSitesController.getConfigSite);
router.post(
  '/configs',
  verifyMiddleware.token,
  userSitesController.createConfigSite
);

module.exports = router;
