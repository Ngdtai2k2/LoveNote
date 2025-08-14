const voucherService = require('@services/admin/voucher');
const handleError = require('@utils/handleError');

const voucherController = {
  getVoucherTemplate: async (req, res) => {
    try {
      const { code, vouchers } = await voucherService.getVoucherTemplate(req);
      return res.status(code).json(vouchers);
    } catch (error) {
      handleError(res, req, error);
    }
  },

  createTemplate: async (req, res) => {
    try {
      const { code, messageKey } = await voucherService.createTemplate(req);
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },

  assignVoucher: async (req, res) => {
    try {
      const { code, messageKey } = await voucherService.assignVoucher(req);
      return res.status(code).json({ message: req.t(messageKey) });
    } catch (error) {
      handleError(res, req, error);
    }
  },
};

module.exports = voucherController;
