const handleError = require('@utils/handleError');
const ContactServices = require('@services/contact');

const contactController = {
  create: async (req, res) => {
    try {
      const { code, messageKey } = await ContactServices.create(req);

      return res.status(code).json({
        message: req.t(messageKey),
      });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = contactController;
