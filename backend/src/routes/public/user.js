const router = require('express').Router();
const userController = require('@controllers/public/user');
const verifyMiddleware = require('@middlewares/verifyToken');
const uploadMiddleware = require('@middlewares/upload');
const { User } = require('@models');

const upload = uploadMiddleware().fields([{ name: 'avatar', maxCount: 1 }]);

router.put(
  '/:userId',
  verifyMiddleware.ownership(User, {
    idParam: 'userId',
    ownerField: 'id',
  }),
  upload,
  userController.updateProfile
);

module.exports = router;
