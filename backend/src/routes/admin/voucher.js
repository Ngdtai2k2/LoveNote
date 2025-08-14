const router = require('express').Router();

const verifyMiddleware = require('@middlewares/verifyToken');
const voucherController = require('@controllers/admin/voucher');

router.get(
  '/template',
  verifyMiddleware.admin,
  voucherController.getVoucherTemplate
);
router.post(
  '/template/create',
  verifyMiddleware.admin,
  voucherController.createTemplate
);
router.post('/assign', verifyMiddleware.admin, voucherController.assignVoucher);

module.exports = router;
