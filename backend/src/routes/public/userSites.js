const router = require('express').Router();
const userSitesController = require('@controllers/public/userSites');
const verifyMiddleware = require('@middlewares/verifyToken');
const upload = require('@middlewares/upload')();

router.get('/configs', userSitesController.getConfigSite);
router.get('/check', userSitesController.checkSlugExists);
router.get('/me', verifyMiddleware.token, userSitesController.getSitesByUser);

router.post(
  '/configs',
  verifyMiddleware.token,
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'images', maxCount: 5 },
  ]),
  userSitesController.createConfigSite
);

module.exports = router;
