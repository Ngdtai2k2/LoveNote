const handleError = require('@utils/handleError');
const logsService = require('@services/admin/logs');

const logsController = {
  getLogsAutoDeleteSites: async (req, res) => {
    try {
      const { code, data } = await logsService.getLogsAutoDeleteSites();
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = logsController;
