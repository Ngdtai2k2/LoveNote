const router = require('express').Router();

const verifyMiddleware = require('@middlewares/verifyToken');
const contactController = require('@controllers/admin/contact');

router.get('/', verifyMiddleware.admin, contactController.getAll);
router.delete('/:id', verifyMiddleware.admin, contactController.delete);

module.exports = router;
