const router = require('express').Router();
const taskController = require('@controllers/public/task');
const verifyMiddleware = require('@middlewares/verifyToken');

router.post('/', verifyMiddleware.token, taskController.createShortLinks);
router.post(
  '/verify/:token',
  verifyMiddleware.token,
  taskController.verifyTokenShortLink
);
router.get(
  '/check/:token',
  verifyMiddleware.token,
  taskController.checkVerifyTokenExp
);

module.exports = router;
