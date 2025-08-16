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

    // --- 1. Delete expired vouchers ---
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
          `Deleted expired Voucher id=${voucher.id} and related redemptions`
        );
      } catch (err) {
        await appendLog(
          `Failed to delete expired Voucher id=${voucher.id}: ${err.message || err}`
        );
      }
    }

    // --- 2. Delete expired VoucherTemplate ---
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
          `Deleted expired VoucherTemplate id=${template.id} and related redemptions`
        );
      } catch (err) {
        await appendLog(
          `Failed to delete expired VoucherTemplate id=${template.id}: ${err.message || err}`
        );
      }
    }

    // --- 3. Delete vouchers that have been used for more than 3 days ---
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // find the redemptions that have been used for more than 3 days
    const oldRedemptions = await UserVoucherRedemption.findAll({
      where: {
        is_used: 1,
        updated_at: { [Op.lt]: threeDaysAgo },
      },
      transaction: t,
    });

    for (const redemption of oldRedemptions) {
      try {
        if (redemption.voucher_id) {
          await Voucher.destroy({
            where: { id: redemption.voucher_id },
            transaction: t,
          });
        }

        await redemption.destroy({ transaction: t });

        await appendLog(
          `Deleted used Voucher id=${redemption.voucher_id} and redemption id=${redemption.id} (older than 3 days)`
        );
      } catch (err) {
        await appendLog(
          `Failed to delete redemption id=${redemption.id}: ${err.message || err}`
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
