const { UserSite, User, Product } = require('@models');
const ShortUniqueId = require('short-unique-id');
const path = require('path');
const fs = require('fs');

const userSiteServices = {
  checkSlugExists: async (req) => {
    const { slug } = req.query;
    if (!slug) throw { code: 400, messageKey: 'validate:slug' };

    const data = await UserSite.findOne({ where: { slug } });
    return !!data;
  },
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
    const userId = req.user.id;
    const { productId, slug: rawSlug } = req.body;
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
    if (!user) throw { code: 404, messageKey: 'notfound:user' };

    const product = await Product.findByPk(productId);
    if (!product) throw { code: 404, messageKey: 'not_found:product' };

    let parsedConfigs;
    try {
      parsedConfigs = JSON.parse(configs);
    } catch (e) {
      throw { code: 400, messageKey: 'validate:invalid_config_json' };
    }

    const avatarDir = path.join(
      __dirname,
      `../../../public/assets/images/${userId}`
    );
    const audioDir = path.join(
      __dirname,
      `../../../public/assets/audio/${userId}`
    );

    fs.mkdirSync(avatarDir, { recursive: true });
    fs.mkdirSync(audioDir, { recursive: true });

    if (req.files?.images && Array.isArray(req.files.images)) {
      const imageUrls = req.files.images.map((file) => {
        return `${process.env.SERVER_URL}/assets/images/${userId}/${file.filename}`;
      });
      parsedConfigs.images = imageUrls;
    }

    if (req.files?.file?.[0]) {
      const file = req.files.file[0];
      parsedConfigs.audioFile = `${process.env.SERVER_URL}/assets/audio/${userId}/${file.filename}`;
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
