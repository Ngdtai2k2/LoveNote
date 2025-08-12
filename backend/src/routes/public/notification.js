const router = require('express').Router();
const verifyMiddleware = require('@middlewares/verifyToken');
const notificationController = require('@controllers/public/notification');

router.get('/me', verifyMiddleware.token, notificationController.getByUser);
router.put(
  '/read/:id',
  verifyMiddleware.token,
  notificationController.markRead
);
router.put(
  '/read-all',
  verifyMiddleware.token,
  notificationController.markReadAll
);

module.exports = router;
