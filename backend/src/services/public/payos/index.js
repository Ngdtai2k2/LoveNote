const PayOS = require('@payos/node');
const ShortUniqueId = require('short-unique-id');

const { Transaction, User, UserSite } = require('@models');
const { sequelize } = require('@config/connectDB');

const payOs = new PayOS(
  process.env.CLIENT_ID_PAYOS,
  process.env.API_KEY_PAYOS,
  process.env.CHECKSUM_KEY_PAYOS
);

const uid = new ShortUniqueId({
  length: 10,
  dictionary: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
});

function generateNumericOrderCode() {
  const shortId = uid.rnd();
  const timeSuffix = Date.now().toString().slice(-7);

  const orderCode = shortId + timeSuffix;

  const numericOrderCode = Number(orderCode);
  if (numericOrderCode > Number.MAX_SAFE_INTEGER) {
    return Number(orderCode.slice(0, 15));
  }

  return numericOrderCode;
}

const payosService = {
  createPaymentLink: async (req) => {
    const transaction = await sequelize.transaction();
    const { description, transactionId } = req.body;
    const userId = req.user.id;

    try {
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        throw { code: 404, messageKey: 'notfound:user' };
      }

      const transactionData = await Transaction.findByPk(transactionId, {
        transaction,
      });

      if (!transactionData) {
        throw { code: 404, messageKey: 'notfound:transaction' };
      }

      const paymentRequest = {
        amount: Number(transactionData.total_amount),
        description: description,
        orderCode: generateNumericOrderCode(),
        returnUrl: `${process.env.CLIENT_URL}/payment/success`,
        cancelUrl: `${process.env.CLIENT_URL}/payment/cancel`,
        expiredAt: Math.floor((Date.now() + 15 * 60 * 1000) / 1000),
      };

      const paymentLink = await payOs.createPaymentLink(paymentRequest);

      await transactionData.update(
        {
          payment_link: paymentLink.checkoutUrl,
          order_code: paymentRequest.orderCode,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        code: 200,
        paymentLink: paymentLink.checkoutUrl,
      };
    } catch (error) {
      await transaction.rollback();
      throw {
        code: 500,
        messageKey: 'message:server_error',
      };
    }
  },

  cancelPayment: async (req) => {
    const { orderCode } = req.body;

    const transaction = await Transaction.findOne({
      where: { order_code: orderCode },
    });

    if (!transaction) {
      throw {
        code: 404,
        messageKey: 'notfound:transaction',
      };
    }

    await transaction.update({ status: 'cancelled' });

    const userSite = await UserSite.findByPk(transaction.user_sites_id);
    await userSite.update({ is_active: false });

    return {
      code: 200,
      messageKey: 'message:cancel_payment_successful',
    };
  },

  receiveHook: async (req) => {
    const { data, success, code } = req.body;

    if (success == true || code == '00') {
      const transaction = await Transaction.findOne({
        where: {
          order_code: data.orderCode,
        },
      });

      await transaction.update({ status: 'paid' });

      const userSite = await UserSite.findByPk(transaction.user_sites_id);

      await userSite.update({ is_active: true });
    }
  },
};

module.exports = payosService;
