const webConfigServices = require("@services/webConfig");
const handleError = require("@utils/handleError");

const webConfigController = {
  getAll: async (req, res) => {
    try {
      const result = await webConfigServices.getAll();
      res.status(200).json(result);
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = webConfigController;
