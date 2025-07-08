const { Op } = require('sequelize');
const { Contacts } = require('@models');

const ContactServices = {
  create: async (req) => {
    const { fullName, email, message } = req.body;

    let ipAddress =
      req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (ipAddress === '::1') {
      ipAddress = '127.0.0.1';
    }

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentCount = await Contacts.count({
      where: {
        ip_address: ipAddress,
        created_at: { [Op.gte]: oneHourAgo },
      },
    });

    if (recentCount >= 3) {
      throw { code: 429, messageKey: 'message:send_too_many' };
    }

    await Contacts.create({
      name: fullName,
      email,
      message,
      ip_address: ipAddress,
    });

    return {
      code: 201,
      messageKey: 'message:data_sent_success',
    };
  },
};

module.exports = ContactServices;
