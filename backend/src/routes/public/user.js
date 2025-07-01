const router = require('express').Router();
const userController = require('@controllers/public/user');
const verifyMiddleware = require('@middlewares/verifyToken');
const uploadMiddleware = require('@middlewares/upload');

const upload = uploadMiddleware().fields([{ name: 'avatar', maxCount: 1 }]);

router.put(
  '/:userId',
  verifyMiddleware.ownership,
  upload,
  userController.updateProfile
);

module.exports = router;
