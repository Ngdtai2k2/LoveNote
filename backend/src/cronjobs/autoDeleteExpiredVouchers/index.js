const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');

const {
  Voucher,
  VoucherTemplate,
  UserVoucherRedemption,
  sequelize,
} = require('@models');

const logDir = path.resolve('logs');
const logFilePath = path.join(logDir, 'auto.log');

async function appendLog(message) {
  const timeStamp = new Date().toISOString();

  try {
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFilePath, `[${timeStamp}] ${message}\n`);
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

async function autoDeleteExpiredVouchers() {
  const t = await sequelize.transaction();
  try {
    const now = new Date();

    const expiredVouchers = await Voucher.findAll({
      where: { expires_at: { [Op.lt]: now } },
      transaction: t,
    });

    for (const voucher of expiredVouchers) {
      try {
        await UserVoucherRedemption.destroy({
          where: { voucher_id: voucher.id },
          transaction: t,
        });

        await voucher.destroy({ transaction: t });

        await appendLog(
          `Deleted Voucher id=${voucher.id} and related redemptions`
        );
      } catch (err) {
        await appendLog(
          `Failed to delete Voucher id=${voucher.id}: ${err.message || err}`
        );
      }
    }

    const expiredTemplates = await VoucherTemplate.findAll({
      where: { expires_at: { [Op.lt]: now } },
      transaction: t,
    });

    for (const template of expiredTemplates) {
      try {
        await UserVoucherRedemption.destroy({
          where: { voucher_template_id: template.id },
          transaction: t,
        });

        await template.destroy({ transaction: t });

        await appendLog(
          `Deleted VoucherTemplate id=${template.id} and related redemptions`
        );
      } catch (err) {
        await appendLog(
          `Failed to delete VoucherTemplate id=${template.id}: ${err.message || err}`
        );
      }
    }

    await t.commit();
  } catch (error) {
    await t.rollback();
    await appendLog(
      `Error in autoDeleteExpiredVouchers: ${error.message || error}`
    );
  }
}

module.exports = {
  autoDeleteExpiredVouchers,
};
