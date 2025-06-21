const router = require('express').Router();
const productController = require('@controllers/public/product');

router.get('/', productController.getAll);

module.exports = router;
