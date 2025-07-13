const taskService = require('@services/task');

const taskController = {
  createShortLinks: async (req, res) => {
    try {
      const { url, code } = await taskService.createShortLinks(req);

      return res.status(code).json(url);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  verifyTokenShortLink: async (req, res) => {
    try {
      const { code, messageKey } = await taskService.verifyTokenShortLink(req);

      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  checkVerifyTokenExp: async (req, res) => {
    try {
      const { exp } = await taskService.checkVerifyTokenExp(req);

      return res.status(200).json(exp);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = taskController;
