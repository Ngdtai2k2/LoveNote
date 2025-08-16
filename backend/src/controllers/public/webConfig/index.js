const webConfigServices = require('@services/public/webConfig');
const handleError = require('@utils/handleError');
const { parseBoolean } = require('@helpers');

const webConfigController = {
  getAll: async (req, res) => {
    try {
      const raw = parseBoolean(req.query.raw);
      const { code, data } = await webConfigServices.getAll({ raw });

      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = webConfigController;
