const productServices = require('@services/product');

const productController = {
  getAll: async (req, res) => {
    try {
      const result = await productServices.getAll(req);
      res.status(200).json(result);
    } catch (error) {
      const code = error.code || 500;
      const messageKey = error.messageKey || 'message:server_error';
      res.status(code).json({ message: req.t(messageKey) });
    }
  },
};

module.exports = productController;
