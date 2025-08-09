const router = require('express').Router();
const verifyMiddleware = require('@middlewares/verifyToken');

const statsController = require('@controllers/admin/stats');

router.get('/users', verifyMiddleware.admin, statsController.countUsers);
router.get('/revenue', verifyMiddleware.admin, statsController.revenue);
router.get('/sites', verifyMiddleware.admin, statsController.countSites);
router.get('/summary', verifyMiddleware.admin, statsController.summary);
router.get('/user-sites', verifyMiddleware.admin, statsController.userSites);
router.get('/transaction', verifyMiddleware.admin, statsController.transaction);

module.exports = router;
