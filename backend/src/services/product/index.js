const { Product } = require('@models');
const paginate = require('@helpers/paginate');

const productServices = {
  getAll: async (req) => {
    const { page, limit } = req.query;

    if (page && limit) {
      const products = await paginate(Product, req);

      if (!products || products.length === 0) {
        throw { code: 404, messageKey: 'notfound:product' };
      }

      return {
        code: 200,
        data: products,
      };
    }

    const products = await Product.findAll({
      attributes: ['id', 'name', 'slug'],
      order: [['created_at', 'DESC']],
    });

    return {
      code: 200,
      data: products,
    };
  },

  getProductBySlug: async (req) => {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
    });

    if (!product) {
      throw { code: 404, messageKey: 'notfound:product' };
    }

    return product;
  },
};

module.exports = productServices;
