const handleError = require('@utils/handleError');
const transactionService = require('@services/public/transaction');

const transactionController = {
  getByUser: async (req, res) => {
    try {
      const { code, data } = await transactionService.getByUser(req);

      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = transactionController;
