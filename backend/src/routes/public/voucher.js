const router = require('express').Router();
const voucherController = require('@controllers/public/voucher');
const verifyMiddleware = require('@middlewares/verifyToken');

router.get('/template', voucherController.getVoucherTemplate);
router.post('/redeem', verifyMiddleware.token, voucherController.redeem);
router.get(
  '/redeem/me',
  verifyMiddleware.token,
  voucherController.getVoucherRedeemByUser
);

module.exports = router;
