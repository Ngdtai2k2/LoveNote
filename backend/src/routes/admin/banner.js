const router = require('express').Router();

const verifyMiddleware = require('@middlewares/verifyToken');
const bannerController = require('@controllers/admin/banner');

router.get('/', verifyMiddleware.admin, bannerController.getAll);
router.post(
  '/:id/activated',
  verifyMiddleware.admin,
  bannerController.activated
);

module.exports = router;
