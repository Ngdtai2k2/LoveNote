const {
  VoucherTemplate,
  UserVoucherRedemption,
  Wallet,
  Product,
  Voucher,
} = require('@models');
const ShortUniqueId = require('short-unique-id');

const { DICTIONARY_CAP } = require('@constants');

const voucherService = {
  getVoucherTemplate: async (req) => {
    const { type } = req.query;

    const where = {};
    if (type) where.type = type;

    const templates = await VoucherTemplate.findAll({ where });

    if (!templates || templates.length === 0) {
      throw { code: 404, messageKey: 'notfound:data' };
    }

    const vouchersWithProducts = await Promise.all(
      templates.map(async (voucher) => {
        const templateSlugs = voucher.templates;

        let productNames = [];

        if (
          Array.isArray(templateSlugs) &&
          templateSlugs.length > 0 &&
          !(templateSlugs.length === 1 && templateSlugs[0] === '*')
        ) {
          const products = await Product.findAll({
            where: {
              slug: templateSlugs,
            },
            attributes: ['slug', 'name'],
          });

          productNames = products.map((p) => p.name);
        }

        return {
          ...voucher.toJSON(),
          product_names: productNames,
        };
      })
    );

    return {
      code: 200,
      vouchers: vouchersWithProducts,
    };
  },

  redeem: async (req, transaction) => {
    const userId = req.user.id;
    const { templateId } = req.body;

    const voucher = await VoucherTemplate.findByPk(templateId, {
      transaction,
    });

    if (!voucher) {
      throw { code: 404, messageKey: 'notfound:voucher' };
    }

    if (voucher.type !== 'redeemable') {
      throw { code: 400, messageKey: 'message:voucher_not_available' };
    }

    if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
      throw { code: 400, messageKey: 'message:voucher_expired' };
    }

    const totalRedemptions = await UserVoucherRedemption.count({
      where: { voucher_template_id: templateId },
      transaction,
    });

    if (
      voucher.total_redeem_limit &&
      totalRedemptions >= voucher.total_redeem_limit
    ) {
      throw { code: 400, messageKey: 'message:voucher_run_out' };
    }

    const userRedemptions = await UserVoucherRedemption.count({
      where: {
        user_id: userId,
        voucher_template_id: templateId,
      },
      transaction,
    });

    if (
      voucher.max_usage_per_user &&
      userRedemptions >= voucher.max_usage_per_user
    ) {
      throw {
        code: 400,
        messageKey: 'message:voucher_run_out_user',
      };
    }

    const userWallet = await Wallet.findOne({
      where: { user_id: userId },
      transaction,
    });

    if (
      !userWallet ||
      parseFloat(userWallet.token_balance) <
        parseFloat(voucher.redeem_token_cost)
    ) {
      throw { code: 400, messageKey: 'message:not_enough_tokens' };
    }

    userWallet.token_balance -= parseFloat(voucher.redeem_token_cost);
    await userWallet.save({ transaction });

    const uuid = new ShortUniqueId({
      length: 10,
      dictionary: DICTIONARY_CAP,
    });
    const codeVoucher = uuid.rnd();

    const voucherData = await Voucher.create(
      {
        code: codeVoucher,
        type: 'personal',
        max_usage: 1,
        used_count: 0,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      { transaction }
    );

    await UserVoucherRedemption.create(
      {
        user_id: userId,
        voucher_id: voucherData.id,
        voucher_template_id: templateId,
      },
      { transaction }
    );

    return {
      code: 200,
      messageKey: 'message:redeem_successful',
    };
  },
};

module.exports = voucherService;
