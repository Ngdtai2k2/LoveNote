const router = require('express').Router();
const userController = require('@controllers/public/user');
const verifyMiddleware = require('@middlewares/verifyToken');

router.put(
  '/:userId',
  verifyMiddleware.ownership,
  userController.updateProfile
);

module.exports = router;
