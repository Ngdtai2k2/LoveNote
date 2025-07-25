const router = require('express').Router();
const productController = require('@controllers/public/product');

router.get('/', productController.getAll);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
