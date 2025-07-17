const userService = require('@services/voucher');
const { sequelize } = require('@config/connectDB');
const handleError = require('@utils/handleError');

const voucherController = {
  getVoucherTemplate: async (req, res) => {
    try {
      const { code, vouchers } = await userService.getVoucherTemplate(req);
      return res.status(code).json(vouchers);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  redeem: async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      const { code, messageKey } = await userService.redeem(req, transaction);
      await transaction.commit();
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      await transaction.rollback();
      return handleError(res, req, error);
    }
  },
};

module.exports = voucherController;
