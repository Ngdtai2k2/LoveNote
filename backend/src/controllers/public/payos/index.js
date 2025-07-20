const handleError = require('@utils/handleError');
const payosService = require('@services/payos');

const payosController = {
  createPaymentLink: async (req, res) => {
    try {
      const { code, paymentLink } = await payosService.createPaymentLink(req);
      return res.status(code).json({ paymentLink });
    } catch (error) {
      handleError(res, req, error);
    }
  },
  receiveHook: async (req, res) => {
    try {
      await payosService.receiveHook(req);
      return res.sendStatus(200);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = payosController;
