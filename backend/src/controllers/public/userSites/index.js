const handleError = require('@utils/handleError');
const userSiteServices = require('@services/public/userSites');
const { sequelize } = require('@config/connectDB');

const userSitesController = {
  checkSlugExists: async (req, res) => {
    try {
      const data = await userSiteServices.checkSlugExists(req);
      return res.status(200).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  getConfigSite: async (req, res) => {
    try {
      const { code, data } = await userSiteServices.getConfigSite(req);
      return res.status(code).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  create: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const result = await userSiteServices.create(req, transaction);
      await transaction.commit();
      return res.status(201).json({
        data: result.data,
        message: req.t(result.messageKey),
      });
    } catch (error) {
      await transaction.rollback();
      return handleError(res, req, error);
    }
  },

  getSitesByUser: async (req, res) => {
    try {
      const data = await userSiteServices.getSitesByUser(req);
      return res.status(200).json(data);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await userSiteServices.delete(req);
      return res.status(200).json({
        message: req.t(data.messageKey),
      });
    } catch (error) {
      return handleError(res, req, error);
    }
  },

  activeSite: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { code, messageKey } = await userSiteServices.activeSite(
        req,
        transaction
      );
      await transaction.commit();
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      await transaction.rollback();
      handleError(res, req, error);
    }
  },
};

module.exports = userSitesController;
