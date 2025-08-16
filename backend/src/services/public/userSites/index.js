require('dotenv').config();

const {
  Wallet,
  UserSite,
  User,
  Product,
  Transaction,
  Voucher,
  UserVoucherRedemption,
  VoucherTemplate,
  Music,
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
        {
          model: Music,
          as: 'music',
          attributes: ['url'],
          required: false,
        },
      ],
    });

    if (!data) throw { code: 404, messageKey: 'notfound:data' };

    return {
      code: 200,
      data,
    };
  },

  create: async (req, transactionDB) => {
    const userId = req.user.id;
    const {
      productId,
      slug: rawSlug,
      configs,
      voucherCode,
      musicId,
    } = req.body;

    let totalAmount = 0;
    let expiresAt = null;
    let transaction = null;
    let is_active = false;

    if (
      !userId ||
      !productId ||
      !configs ||
      (productId !== 'love-005' && !musicId)
    ) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    let slug = rawSlug;
    if (!slug) {
      slug = new ShortUniqueId({ length: 10 }).rnd();
    } else {
      const exists = await UserSite.findOne({
        where: { slug },
        transaction: transactionDB,
      });
      if (exists) throw { code: 409, messageKey: 'validate:slug_exists' };
    }

    const user = await User.findByPk(userId, { transaction: transactionDB });
    if (!user) throw { code: 404, messageKey: 'notfound:user' };

    const product = await Product.findByPk(productId, {
      transaction: transactionDB,
    });
    if (!product) throw { code: 404, messageKey: 'notfound:product' };

    const music = musicId
      ? await Music.findByPk(musicId, { transaction: transactionDB })
      : null;

    if (musicId && !music) throw { code: 404, messageKey: 'notfound:music' };

    let parsedConfigs;
    try {
      parsedConfigs =
        typeof configs === 'string' ? JSON.parse(configs) : configs;
    } catch {
      throw { code: 400, messageKey: 'validate:invalid_config_json' };
    }

    if (req.files?.images && Array.isArray(req.files.images)) {
      parsedConfigs.images = req.files.images.map(
        (file) => `/assets/web/${userId}/${file.filename}`
      );
    }

    let skipTransaction = false;

    if (voucherCode) {
      const voucher = await Voucher.findOne({
        where: { code: voucherCode },
        transaction: transactionDB,
      });

      if (!voucher) throw { code: 404, messageKey: 'notfound:voucher' };

      if (voucher.expires_at && new Date(voucher.expires_at) < new Date()) {
        throw { code: 400, messageKey: 'message:voucher_expired' };
      }

      if (
        voucher.max_usage !== null &&
        voucher.used_count >= voucher.max_usage
      ) {
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
        transaction: transactionDB,
      });

      if (!redemption || redemption.is_used) {
        throw { code: 400, messageKey: 'message:voucher_not_available' };
      }

      const allowedTemplates = redemption.template?.templates || [];
      const isSlugAllowed =
        allowedTemplates.includes('*') ||
        allowedTemplates.some((t) =>
          typeof t === 'string' ? t === product.slug : t?.slug === product.slug
        );

      if (!isSlugAllowed) {
        throw { code: 400, messageKey: 'message:voucher_not_applicable' };
      }

      await voucher.increment('used_count', { transaction: transactionDB });
      await redemption.update(
        { is_used: true },
        { transaction: transactionDB }
      );

      const { discount_type, discount_value } = redemption.template;

      if (discount_type === 'day') {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + discount_value);
        skipTransaction = true;
        is_active = true;
      } else if (discount_type === 'percent') {
        const rawPrice = parseFloat(product.price || 0);
        totalAmount = Math.floor(rawPrice * (1 - discount_value / 100));
      }
    }

    if (totalAmount === null || totalAmount === undefined) {
      totalAmount = parseFloat(product.price || 0);
    }

    if (totalAmount == 0) {
      is_active = true;
      skipTransaction = true;
    }

    const newSite = await UserSite.create(
      {
        user_id: userId,
        product_id: productId,
        slug,
        configs: parsedConfigs,
        expires_at: expiresAt,
        is_active: is_active,
        music_id: musicId || (productId == 'love-005' ? 5 : null),
      },
      { transaction: transactionDB }
    );

    if (!skipTransaction) {
      transaction = await Transaction.create(
        {
          user_id: userId,
          user_sites_id: newSite.id,
          total_amount: totalAmount,
        },
        { transaction: transactionDB }
      );
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
      attributes: { exclude: ['configs', 'user_id', 'product_id'] },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'slug', 'name', 'thumbnail_url'],
        },
        {
          model: Transaction,
          as: 'transactions',
          attributes: ['id', 'total_amount'],
          required: false,
        },
      ],
    });

    sites.data = sites.data.map((site) => {
      const json = site.toJSON();
      const has_transaction =
        Array.isArray(json.transactions) && json.transactions.length > 0;

      const transaction = has_transaction ? json.transactions[0] : null;

      delete json.transactions;

      return {
        ...json,
        has_transaction,
        total_amount: transaction?.total_amount ?? null,
        transaction_id: transaction?.id ?? null,
      };
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

  activeSite: async (req, transaction) => {
    const { id, num_days, token } = req.query;
    const userId = req.user.id;

    const days = parseInt(num_days, 10);
    if (isNaN(days) || days <= 0) {
      throw { code: 400, messageKey: 'validate:invalid_num_days' };
    }

    const site = await UserSite.findByPk(id, { transaction });
    if (!site) throw { code: 404, messageKey: 'notfound:data' };

    const now = new Date();

    if (new Date(site.expires_at) > now) {
      throw {
        code: 400,
        messageKey: 'message:site_already_active',
      };
    }

    const baseDate =
      site.expires_at && new Date(site.expires_at) > now
        ? new Date(site.expires_at)
        : now;

    const newExpiresAt = new Date(
      baseDate.getTime() + days * 24 * 60 * 60 * 1000
    );

    const userWallet = await Wallet.findOne({
      where: { user_id: userId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (
      !userWallet ||
      parseFloat(userWallet.token_balance) < parseFloat(token)
    ) {
      throw { code: 400, messageKey: 'message:not_enough_tokens' };
    }

    userWallet.token_balance -= parseFloat(token);
    await userWallet.save({ transaction });

    await site.update(
      {
        is_active: true,
        expires_at: newExpiresAt,
      },
      { transaction }
    );

    return {
      code: 200,
      messageKey: 'message:active_site_success',
    };
  },
};

module.exports = userSiteServices;
