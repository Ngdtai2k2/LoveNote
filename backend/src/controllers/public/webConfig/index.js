const webConfigServices = require('@services/webConfig');
const handleError = require('@utils/handleError');
const { parseBoolean } = require('@helpers');

const webConfigController = {
  getAll: async (req, res) => {
    try {
      const raw = parseBoolean(req.query.raw);
      const data = await webConfigServices.getAll({ raw });

      return res.status(200).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = webConfigController;
