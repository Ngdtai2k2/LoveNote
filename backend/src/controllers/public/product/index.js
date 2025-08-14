const productServices = require('@services/product');
const handleError = require('@utils/handleError');

const productController = {
  getAll: async (req, res) => {
    try {
      const { code, data } = await productServices.getAll(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  getProductBySlug: async (req, res) => {
    try {
      const result = await productServices.getProductBySlug(req);
      return res.status(200).json(result);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = productController;
