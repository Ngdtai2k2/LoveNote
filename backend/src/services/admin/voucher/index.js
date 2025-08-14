const {
  VoucherTemplate,
  Product,
  User,
  Voucher,
  UserVoucherRedemption,
} = require('@models');
const paginate = require('@helpers/paginate');
const ShortUniqueId = require('short-unique-id');

const { DICTIONARY_CAP } = require('@constants');

const voucherService = {
  getVoucherTemplate: async (req) => {
    const { type } = req.query;

    const where = {};
    if (type) where.type = type;

    const templates = await paginate(VoucherTemplate, req, {
      where,
    });

    if (!templates || templates.length === 0) {
      throw { code: 404, messageKey: 'notfound:data' };
    }

    const vouchersWithProducts = await Promise.all(
      templates.data.map(async (voucher) => {
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
      vouchers: {
        currentPage: templates.currentPage,
        totalPages: templates.totalPages,
        hasNextPage: templates.hasNextPage,
        data: vouchersWithProducts,
      },
    };
  },
  createTemplate: async (req) => {
    let {
      name,
      description,
      discountType,
      discountValue,
      templates,
      expiresAt,
      redeemTokenCost,
      siteLifespanDays,
      maxUsagePerUser,
      totalRedeemLimit,
      type,
    } = req.body;

    if (!name || !discountType || !discountValue || !type) {
      throw {
        code: 400,
        messageKey: 'validate:no_data',
      };
    }

    description = description === '' ? null : description;
    templates = templates && templates.length ? templates : ['*'];
    expiresAt = expiresAt === '' ? null : expiresAt;
    redeemTokenCost = redeemTokenCost === '' ? null : redeemTokenCost;
    siteLifespanDays = siteLifespanDays === '' ? null : siteLifespanDays;
    maxUsagePerUser = maxUsagePerUser === '' ? null : maxUsagePerUser;
    totalRedeemLimit = totalRedeemLimit === '' ? null : totalRedeemLimit;

    await VoucherTemplate.create({
      name,
      description,
      discount_type: discountType,
      discount_value: discountValue,
      templates,
      expires_at: expiresAt,
      redeem_token_cost: redeemTokenCost,
      site_lifespan_days: siteLifespanDays,
      max_usage_per_user: maxUsagePerUser,
      total_redeem_limit: totalRedeemLimit,
      type,
    });

    return {
      code: 201,
      messageKey: 'message:create_voucher_template_success',
    };
  },

  assignVoucher: async (req) => {
    const { voucherTemplateId, userIds, emails } = req.body;

    if (!voucherTemplateId) {
      throw {
        code: 400,
        messageKey: 'validate:no_data',
      };
    }

    const template = await VoucherTemplate.findByPk(voucherTemplateId);

    if (!template) {
      throw { code: 404, messageKey: 'notfound:voucher' };
    }

    let users;

    if (
      (Array.isArray(userIds) && userIds.length > 0) ||
      (Array.isArray(emails) && emails.length > 0)
    ) {
      const whereCondition = {};
      if (Array.isArray(userIds) && userIds.length > 0) {
        whereCondition.id = userIds;
      }
      if (Array.isArray(emails) && emails.length > 0) {
        whereCondition.email = emails;
      }

      users = await User.findAll({ where: whereCondition });
    } else {
      users = await User.findAll();
    }

    if (!users || users.length === 0) {
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    let vouchers = [];

    const uuid = new ShortUniqueId({ length: 10, dictionary: DICTIONARY_CAP });

    if (template.type === 'global') {
      const code = uuid.rnd();

      const voucher = await Voucher.create({
        code,
        type: 'global',
        max_usage: null,
        used_count: 0,
        expires_at:
          template.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      vouchers.push(voucher);

      const redemptions = users.map((user) => ({
        user_id: user.id,
        voucher_id: voucher.id,
        voucher_template_id: template.id,
        is_used: false,
      }));
      await UserVoucherRedemption.bulkCreate(redemptions);
    } else {
      for (let user of users) {
        const code = uuid.rnd();

        const voucher = await Voucher.create({
          code,
          type: template.type,
          max_usage: 1,
          used_count: 0,
          expires_at:
            template.expires_at ||
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        vouchers.push(voucher);

        await UserVoucherRedemption.create({
          user_id: user.id,
          voucher_id: voucher.id,
          voucher_template_id: template.id,
          is_used: false,
        });
      }
    }

    return {
      code: 200,
      messageKey: 'message:gift_voucher_success',
    };
  },
};

module.exports = voucherService;
