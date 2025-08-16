const handleError = require('@utils/handleError');
const contactService = require('@services/admin/contact');

const contactController = {
  getAll: async (req, res) => {
    try {
      const { code, data } = await contactService.getAll(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  delete: async (req, res) => {
    try {
      const { code, messageKey } = await contactService.delete(req);
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = contactController;
