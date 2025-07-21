const paginate = require('@helpers/paginate');
const { Transaction, Product, UserSite } = require('@models');

const transactionService = {
  getByUser: async (req) => {
    const userId = req.user.id;

    if (!userId) throw { code: 400, messageKey: 'validate:no_user_id' };

    const rawTransactions = await paginate(Transaction, req, {
      where: { user_id: userId },
      include: [
        {
          model: UserSite,
          as: 'user_site',
          attributes: ['expires_at', 'is_active', 'slug'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'thumbnail_url'],
            },
          ],
        },
      ],
    });

    const transactions = {
      ...rawTransactions,
      data: rawTransactions.data.map((tx) => ({
        id: tx.id,
        status: tx.status,
        amount: tx.total_amount,
        slug: tx.user_site?.slug,
        expiresAt: tx.user_site?.expires_at,
        isActive: tx.user_site?.is_active,
        productName: tx.user_site?.product?.name,
        productThumb: tx.user_site?.product?.thumbnail_url,
      })),
    };

    return {
      code: 200,
      data: transactions,
    };
  },
};

module.exports = transactionService;
