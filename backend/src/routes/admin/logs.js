const router = require('express').Router();

const verifyMiddleware = require('@middlewares/verifyToken');
const logsController = require('@controllers/admin/logs');

router.get(
  '/auto-delete-sites',
  verifyMiddleware.admin,
  logsController.getLogsAutoDeleteSites
);

module.exports = router;
