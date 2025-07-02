require('dotenv').config();

const { UserSite, User, Product } = require('@models');
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
      include: [{ model: Product, as: 'product', attributes: ['slug'] }],
    });

    if (!data) throw { code: 404, messageKey: 'not_found:data' };
    return data;
  },

  createConfigSite: async (req) => {
    const userId = req.user.id;
    const { productId, slug: rawSlug, configs } = req.body;

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

    const newSite = await UserSite.create({
      user_id: userId,
      product_id: productId,
      slug,
      configs: parsedConfigs,
    });

    return {
      messageKey: 'message:create_web_success',
      data: newSite,
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

  deleteConfigSite: async (req) => {
    const { id } = req.params;
    if (!id) throw { code: 400, messageKey: 'validate:no_id' };

    const site = await UserSite.findByPk(id);
    if (!site) throw { code: 404, messageKey: 'not_found:data' };

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
