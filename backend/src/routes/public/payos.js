const router = require('express').Router();
const payOsController = require('@controllers/public/payos');
const verifyMiddleware = require('@middlewares/verifyToken');

router.post(
  '/create-payment-link',
  verifyMiddleware.token,
  payOsController.createPaymentLink
);
router.post(
  '/cancel-payment',
  verifyMiddleware.token,
  payOsController.cancelPayment
);
router.post('/receive-hook', payOsController.receiveHook);

module.exports = router;
