const ShortUniqueId = require('short-unique-id');

const {
  User,
  Task,
  Wallet,
  ShortLinkProviders,
  UserProviderLimit,
} = require('@models');
const { sequelize } = require('@config/connectDB');

const createShortLink = require('@helpers/shortLink');
const userProviderLimitService = require('../userProviderLimit');

const uid = new ShortUniqueId();

const taskService = {
  createShortLinks: async (req) => {
    const transaction = await sequelize.transaction();

    const { providerId } = req.body;
    const userId = req.user.id;

    const token = uid.stamp(32);

    const user = await User.findByPk(userId, { transaction });

    if (!user) {
      await transaction.rollback();
      throw {
        code: 404,
        messageKey: 'notfound:user',
      };
    }

    const provider = await ShortLinkProviders.findByPk(providerId, {
      transaction,
    });

    if (!provider) {
      await transaction.rollback();
      throw {
        code: 404,
        messageKey: 'notfound:provider',
      };
    }

    const userProviderLimitData = await userProviderLimitService.create(req, {
      transaction,
    });

    if (userProviderLimitData.views_today <= 0) {
      await transaction.rollback();
      throw {
        code: 403,
        messageKey: 'message:view_limit',
      };
    }

    const shortLink = await createShortLink(
      provider.base_url,
      provider.api_key,
      `${process.env.CLIENT_URL}/verify-token/${token}`
    );

    await Task.create(
      {
        user_id: user.id,
        provider_id: providerId,
        verify_token: token,
        short_link: shortLink,
        earned: provider.price,
        status: 0,
      },
      { transaction }
    );

    await transaction.commit();

    return {
      code: 200,
      url: shortLink,
    };
  },

  verifyTokenShortLink: async (req) => {
    const transaction = await sequelize.transaction();

    const { token } = req.params;

    const task = await Task.findOne({
      where: { verify_token: token },
      transaction,
    });

    if (task.status === 1) {
      await transaction.rollback();
      throw {
        code: 403,
        messageKey: 'message:task_already_completed',
      };
    }

    task.status = 1;
    await task.save({ transaction });

    const userProviderLimit = await UserProviderLimit.findOne({
      where: { user_id: task.user_id, provider_id: task.provider_id },
      transaction,
    });

    if (userProviderLimit.views_today > 0) {
      userProviderLimit.views_today -= 1;
      await userProviderLimit.save({ transaction });
    }

    const userWallet = await Wallet.findOne({
      where: { user_id: task.user_id },
      transaction,
    });

    if (userWallet) {
      userWallet.token_balance =
        parseFloat(userWallet.token_balance) + parseFloat(task.earned);
      await userWallet.save({ transaction });
    }

    await transaction.commit();

    return {
      code: 200,
      messageKey: 'message:completed_task',
    };
  },

  checkVerifyTokenExp: async (req) => {
    const task = await Task.findOne({
      where: { verify_token: req.params.token, status: 0 },
    });

    return {
      code: 200,
      exp: !!task,
    };
  },
};

module.exports = taskService;
