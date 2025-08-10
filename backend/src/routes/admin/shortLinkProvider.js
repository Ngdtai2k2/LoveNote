const router = require('express').Router();
const verifyMiddleware = require('@middlewares/verifyToken');

const shortLinkProviderController = require('@controllers/admin/shortLinkProvider');

router.get(
  '/',
  verifyMiddleware.admin,
  shortLinkProviderController.getAllProviders
);
router.put('/:id', verifyMiddleware.admin, shortLinkProviderController.update);

module.exports = router;
