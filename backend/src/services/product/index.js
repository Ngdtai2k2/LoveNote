const { Product } = require('@models');
const paginate = require('@helpers/paginate');

const productServices = {
  getAll: async (req) => {
    const products = await paginate(Product, req);

    if (!products || products.length === 0) {
      throw { code: 404, messageKey: 'notfound:product' };
    }

    return products;
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
