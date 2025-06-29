const router = require('express').Router();
const userSitesController = require('@controllers/public/userSites');
const verifyMiddleware = require('@middlewares/verifyToken');
const uploadMiddleware = require('@middlewares/upload');

router.get('/configs', userSitesController.getConfigSite);

router.post(
  '/configs',
  verifyMiddleware.token,
  (req, res, next) => {
    const upload = uploadMiddleware().fields([
      { name: 'file', maxCount: 1 },
      { name: 'images', maxCount: 5 },
    ]);
    upload(req, res, next);
  },
  userSitesController.createConfigSite
);

router.get('/check', userSitesController.checkSlugExists);

module.exports = router;
