const router = require('express').Router();
const verifyMiddleware = require('@middlewares/verifyToken');
const transactionController = require('@controllers/public/transaction');

router.get('/me', verifyMiddleware.token, transactionController.getByUser);

module.exports = router;
