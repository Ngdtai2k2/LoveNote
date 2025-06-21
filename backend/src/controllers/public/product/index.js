const productServices = require('@services/product');
const handleError = require('@utils/handleError');

const productController = {
  getAll: async (req, res) => {
    try {
      const result = await productServices.getAll(req);
      res.status(200).json(result);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = productController;
