const router = require('express').Router();
const productController = require('@controllers/public/product');

router.use('/all', productController.getAll);

module.exports = router;
