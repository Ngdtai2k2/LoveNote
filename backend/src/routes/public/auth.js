const router = require('express').Router();
const authController = require('@controllers/auth');
const verifyMiddleware = require('@middlewares/verifyToken');

router.get('/me', verifyMiddleware.token, authController.getCurrentUser);
router.post('/sign-out', verifyMiddleware.token, authController.signOut);
router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);
router.post('/refresh-token', authController.requestRefreshToken);
router.put(
  '/change-password/:userId',
  verifyMiddleware.ownership,
  authController.changePassword
);

module.exports = router;
