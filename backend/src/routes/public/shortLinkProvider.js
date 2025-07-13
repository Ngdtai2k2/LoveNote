const router = require('express').Router();
const ShortLinkProviderController = require('@controllers/public/shortLinkProvider');
const verifyMiddleware = require('@middlewares/verifyToken');

router.get(
  '/me',
  verifyMiddleware.token,
  ShortLinkProviderController.getAllForUser
);

module.exports = router;
