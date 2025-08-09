const router = require('express').Router();
const verifyMiddleware = require('@middlewares/verifyToken');

const usersController = require('@controllers/admin/users');

router.get('/', verifyMiddleware.admin, usersController.allUsers);

module.exports = router;
