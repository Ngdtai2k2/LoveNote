require('dotenv').config();

const {
  UserSite,
  User,
  Product,
  Transaction,
  Voucher,
  UserVoucherRedemption,
  VoucherTemplate,
} = require('@models');
const ShortUniqueId = require('short-unique-id');
const paginate = require('@helpers/paginate');
const helpers = require('@helpers');

const userSiteServices = {
  checkSlugExists: async (req) => {
    const { slug } = req.query;
    if (!slug) throw { code: 400, messageKey: 'validate:slug' };
    const data = await UserSite.findOne({ where: { slug } });
    return !!data;
  },

  getConfigSite: async (req) => {
    const { slug, id } = req.query;
    if (!slug && !id) throw { code: 400, messageKey: 'validate:slug_or_id' };

    const whereClause = slug ? { slug } : { id };
    const data = await UserSite.findOne({
      where: whereClause,
      include: [
        {
          where: {},
          model: Product,
          as: 'product',
          attributes: ['slug'],
          required: false,
        },
      ],
    });

    if (!data) throw { code: 404, messageKey: 'notfound:data' };
    return data;
  },

  create: async (req) => {
    const userId = req.user.id;
    const { productId, slug: rawSlug, configs, voucherCode } = req.body;
    let totalAmount = 0;
    let expiresAt = null;
    let transaction = null;
    let is_active = false;

    if (!userId || !productId || !configs) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    let slug = rawSlug;
    if (!slug) {
      slug = new ShortUniqueId({ length: 10 }).rnd();
    } else {
      const exists = await UserSite.findOne({ where: { slug } });
      if (exists) throw { code: 409, messageKey: 'validate:slug_exists' };
    }

    const user = await User.findByPk(userId);
    if (!user) throw { code: 404, messageKey: 'notfound:user' };

    const product = await Product.findByPk(productId);
    if (!product) throw { code: 404, messageKey: 'notfound:product' };

    let parsedConfigs;
    try {
      parsedConfigs =
        typeof configs === 'string' ? JSON.parse(configs) : configs;
    } catch {
      throw { code: 400, messageKey: 'validate:invalid_config_json' };
    }

    if (req.files?.images && Array.isArray(req.files.images)) {
      parsedConfigs.images = req.files.images.map(
        (file) =>
          `${process.env.SERVER_URL}/assets/web/${userId}/${file.filename}`
      );
    }

    if (req.files?.audio?.[0]) {
      parsedConfigs.audioFile = `${process.env.SERVER_URL}/assets/audio/${userId}/${req.files.audio[0].filename}`;
    }

    let skipTransaction = false;

    // check voucher
    if (voucherCode) {
      const voucher = await Voucher.findOne({ where: { code: voucherCode } });

      if (!voucher) {
        throw { code: 404, messageKey: 'notfound:voucher' };
      }

      if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
        throw { code: 400, messageKey: 'message:voucher_expired' };
      }

      if (voucher.used_count >= voucher.max_usage) {
        throw { code: 400, messageKey: 'message:voucher_not_available' };
      }

      await voucher.increment('used_count');

      const redemption = await UserVoucherRedemption.findOne({
        where: {
          user_id: userId,
          voucher_id: voucher.id,
        },
        include: [
          {
            model: VoucherTemplate,
            as: 'template',
            attributes: ['discount_type', 'discount_value'],
          },
        ],
      });

      if (redemption && !redemption.is_used) {
        await redemption.update({ is_used: true });

        const { discount_type, discount_value } = redemption.template;

        if (discount_type === 'day') {
          // Free number of days of use
          expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + discount_value);
          skipTransaction = true;
          is_active = true;
        } else if (discount_type === 'percent') {
          // Discount by %
          const rawPrice = parseFloat(product.price || 0);
          totalAmount = Math.floor(rawPrice * (1 - discount_value / 100));
        }
      }
    }

    // If there is no voucher or no % discount, then take the original price.
    if (!totalAmount) {
      totalAmount = parseFloat(product.price || 0);
    }

    // create new site
    const newSite = await UserSite.create({
      user_id: userId,
      product_id: productId,
      slug,
      configs: parsedConfigs,
      expires_at: expiresAt,
      is_active: is_active,
    });

    // create transaction
    if (!skipTransaction) {
      transaction = await Transaction.create({
        user_id: userId,
        user_sites_id: newSite.id,
        total_amount: totalAmount,
      });
    }

    return {
      messageKey: 'message:create_web_success',
      data: {
        ...newSite.toJSON(),
        transaction_id: transaction?.id || null,
      },
    };
  },

  getSitesByUser: async (req) => {
    const userId = req.user.id;
    if (!userId) throw { code: 400, messageKey: 'validate:no_user_id' };

    const sites = await paginate(UserSite, req, {
      where: { user_id: userId },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['slug', 'name', 'thumbnail_url'],
        },
      ],
    });

    return sites;
  },

  delete: async (req) => {
    const { id } = req.params;
    if (!id) throw { code: 400, messageKey: 'validate:no_id' };

    const site = await UserSite.findByPk(id);
    if (!site) throw { code: 404, messageKey: 'notfound:data' };

    const configs =
      typeof site.configs === 'string'
        ? JSON.parse(site.configs)
        : site.configs;

    try {
      const filePaths = [];

      if (configs?.images && Array.isArray(configs.images)) {
        filePaths.push(
          ...configs.images.map((img) => helpers.resolveLocalPath(img))
        );
      }

      if (configs?.audioFile) {
        filePaths.push(helpers.resolveLocalPath(configs.audioFile));
      }

      for (const filePath of filePaths) {
        await helpers.safeUnlink(filePath);
      }

      const count = await Transaction.count({
        where: { user_sites_id: id },
      });

      if (count > 0) {
        await Transaction.destroy({
          where: { user_sites_id: id },
        });
      }

      await site.destroy();

      return {
        code: 200,
        messageKey: 'message:delete_web_success',
      };
    } catch (error) {
      throw error.code
        ? error
        : { code: 500, messageKey: 'message:server_error' };
    }
  },
};

module.exports = userSiteServices;
