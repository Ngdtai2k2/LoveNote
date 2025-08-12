const handleError = require('@utils/handleError');
const notificationService = require('@services/notification');

const notificationController = {
  getByUser: async (req, res) => {
    try {
      const { code, data } = await notificationService.getByUser(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  markRead: async (req, res) => {
    try {
      const { code, data } = await notificationService.markRead(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  markReadAll: async (req, res) => {
    try {
      const { code, data } = await notificationService.markReadAll(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = notificationController;
