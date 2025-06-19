const router = require('express').Router();
const productController = require('@controllers/public/product');

router.get('/all', productController.getAll);

module.exports = router;
