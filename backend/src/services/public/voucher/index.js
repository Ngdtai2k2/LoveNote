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

        let productsInfo = [];

        if (
          Array.isArray(templateSlugs) &&
          templateSlugs.length > 0 &&
          !(templateSlugs.length === 1 && templateSlugs[0] === '*')
        ) {
          const products = await Product.findAll({
            where: {
              slug: templateSlugs,
            },
            attributes: ['slug', 'name', 'thumbnail_url'],
          });

          productsInfo = products.map((p) => ({
            slug: p.slug,
            name: p.name,
            thumbnail_url: p.thumbnail_url,
          }));
        }

        const { templates, ...voucherData } = voucher.toJSON();

        return {
          ...voucherData,
          products: productsInfo,
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

  getVoucherRedeemByUser: async (req) => {
    const userId = req.user.id;
    const { is_used } = req.query;

    const where = {
      user_id: userId,
    };

    if (is_used) {
      where.is_used = is_used;
    } else {
      where.is_used = false;
    }

    const redemptions = await UserVoucherRedemption.findAll({
      where,
      include: [
        {
          model: Voucher,
          as: 'voucher',
          attributes: ['code', 'expires_at'],
        },
        {
          model: VoucherTemplate,
          as: 'template',
          attributes: ['name', 'description', 'templates'],
        },
      ],
    });

    const results = await Promise.all(
      redemptions.map(async (item) => {
        const redemption = item.toJSON();
        const { voucher, template, is_used } = redemption;

        let productsInfo = [];

        if (
          template?.templates &&
          Array.isArray(template.templates) &&
          template.templates.length > 0 &&
          !(template.templates.length === 1 && template.templates[0] === '*')
        ) {
          const products = await Product.findAll({
            where: {
              slug: template.templates,
            },
            attributes: ['slug', 'name', 'thumbnail_url'],
          });

          productsInfo = products.map((p) => ({
            slug: p.slug,
            name: p.name,
            thumbnail_url: p.thumbnail_url,
          }));
        }

        return {
          code: voucher?.code,
          expires_at: voucher?.expires_at,
          is_used,
          name: template?.name || {},
          description: template?.description || {},
          products: productsInfo,
        };
      })
    );

    return {
      code: 200,
      vouchers: results,
    };
  },

  checkVoucher: async (req) => {
    const code = req.body.voucher || req.params.code;
    const slug = req.query.slug;
    const userId = req.user.id;

    const voucher = await Voucher.findOne({
      where: { code },
      attributes: [
        'id',
        'code',
        'type',
        'max_usage',
        'used_count',
        'expires_at',
      ],
    });

    if (!voucher) {
      throw {
        code: 404,
        messageKey: 'notfound:voucher',
      };
    }

    const now = new Date();

    if (voucher.expires_at && new Date(voucher.expires_at) < now) {
      throw {
        code: 400,
        messageKey: 'message:voucher_expired',
      };
    }

    if (voucher.max_usage !== null && voucher.used_count >= voucher.max_usage) {
      throw { code: 400, messageKey: 'message:voucher_not_available' };
    }

    const redemption = await UserVoucherRedemption.findOne({
      where: {
        user_id: userId,
        voucher_id: voucher.id,
      },
      include: [
        {
          model: VoucherTemplate,
          as: 'template',
          attributes: ['discount_type', 'discount_value', 'templates'],
        },
      ],
    });

    if (!redemption) {
      throw {
        code: 400,
        messageKey: 'message:voucher_not_available',
      };
    }

    if (redemption.is_used) {
      throw {
        code: 400,
        messageKey: 'message:voucher_has_used',
      };
    }

    if (!redemption.template) {
      throw {
        code: 400,
        messageKey: 'message:voucher_invalid_template',
      };
    }

    const allowedTemplates = redemption.template.templates || [];

    let isSlugAllowed = false;

    if (Array.isArray(allowedTemplates)) {
      if (allowedTemplates.includes('*')) {
        isSlugAllowed = true;
      } else {
        isSlugAllowed = allowedTemplates.some((item) => item === slug);
      }
    }

    if (!isSlugAllowed) {
      throw {
        code: 400,
        messageKey: 'message:voucher_not_applicable',
      };
    }

    return {
      code: 200,
      data: {
        code: voucher.code,
        discount_type: redemption.template.discount_type,
        discount_value: redemption.template.discount_value,
        expires_at: voucher.expires_at,
      },
    };
  },
};

module.exports = voucherService;
