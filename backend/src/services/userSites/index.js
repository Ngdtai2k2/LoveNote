const { UserSite, User, Product } = require('@models');
const ShortUniqueId = require('short-unique-id');

const userSiteServices = {
  getConfigSite: async (req) => {
    const { slug, id } = req.query;

    if (!slug && !id) {
      throw { code: 400, messageKey: 'validate:slug_or_id' };
    }

    const whereClause = slug ? { slug } : { id };

    const data = await UserSite.findOne({
      where: whereClause,
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'slug'],
        },
      ],
    });

    if (!data || data.length === 0) {
      throw { code: 404, messageKey: 'not_found:data' };
    }

    return data;
  },
  createConfigSite: async (req) => {
    const { userId, productId, slug: rawSlug } = req.body;
    let { configs } = req.body;

    if (!userId || !productId || !configs) {
      throw { code: 400, messageKey: 'validate:no_data' };
    }

    let slug = rawSlug;
    if (!slug) {
      const uid = new ShortUniqueId({ length: 10 });
      slug = uid.rnd();
    } else {
      const slugExists = await UserSite.findOne({ where: { slug } });
      if (slugExists) {
        throw { code: 409, messageKey: 'validate:slug_exists' };
      }
    }

    const user = await User.findByPk(userId);
    if (!user) {
      throw { code: 404, messageKey: 'notfound:user' };
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw { code: 404, messageKey: 'not_found:product' };
    }

    let parsedConfigs;

    try {
      parsedConfigs = JSON.parse(configs);
    } catch (e) {
      throw { code: 400, messageKey: 'validate:invalid_config_json' };
    }

    if (req.file) {
      const fileUrl = `${process.env.SERVER_URL}/assets/music/${userId}/${req.file.filename}`;
      parsedConfigs.audioFile = fileUrl;
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
};

module.exports = userSiteServices;
