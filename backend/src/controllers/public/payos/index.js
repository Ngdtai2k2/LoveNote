const handleError = require('@utils/handleError');
const payosService = require('@services/payos');

const payosController = {
  createPaymentLink: async (req, res) => {
    try {
      const { code, paymentLink } = await payosService.createPaymentLink(req);
      return res.status(code).json({ paymentLink });
    } catch (error) {
      const status = error.code || 500;
      const messageKey = error.messageKey || 'message:server_error';

      return res.status(status).json({ message: req.t(messageKey) });
    }
  },

  cancelPayment: async (req, res) => {
    try {
      const { code, messageKey } = await payosService.cancelPayment(req);

      return res.status(code).json({
        message: req.t(messageKey),
      });
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
