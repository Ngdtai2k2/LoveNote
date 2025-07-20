const router = require('express').Router();
const payosController = require('@controllers/public/payos');
const verifyMiddleware = require('@middlewares/verifyToken');

router.post(
  '/create-payment-link',
  verifyMiddleware.token,
  payosController.createPaymentLink
);
router.post('/receive-hook', payosController.receiveHook);

module.exports = router;
