const handleError = require('@utils/handleError');
const statsService = require('@services/admin/stats');

const statsController = {
  countUsers: async (req, res) => {
    try {
      const users = await statsService.countUsers(req);
      res.status(200).json({ users });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  revenue: async (req, res) => {
    try {
      const revenue = await statsService.revenue(req);
      res.status(200).json({ revenue });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  countSites: async (req, res) => {
    try {
      const sites = await statsService.countSites(req);
      res.status(200).json({ sites });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  summary: async (req, res) => {
    try {
      const summary = await statsService.summary();
      res.status(200).json(summary);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  userSites: async (req, res) => {
    try {
      const { code, data } = await statsService.userSites(req);
      res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  transaction: async (req, res) => {
    try {
      const { code, data } = await statsService.transaction(req);
      res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = statsController;
