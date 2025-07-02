const router = require('express').Router();
const userSitesController = require('@controllers/public/userSites');
const verifyMiddleware = require('@middlewares/verifyToken');
const upload = require('@middlewares/upload')();
const { UserSite } = require('@models');

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
router.delete(
  '/configs/:id/delete',
  verifyMiddleware.adminOrOwner(UserSite, {
    idParam: 'id',
    ownerField: 'user_id',
  }),
  userSitesController.deleteConfigSite
);

module.exports = router;
