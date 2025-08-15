const fs = require('fs').promises;
const path = require('path');
const { Op } = require('sequelize');

const { UserSite, Transaction } = require('@models');
const helpers = require('@helpers');

const logDir = path.resolve('logs');
const logFilePath = path.join(logDir, 'auto.log');

async function appendLog(message) {
  const timeStamp = new Date().toISOString();

  try {
    // Tạo thư mục logs nếu chưa tồn tại
    await fs.mkdir(logDir, { recursive: true });
    await fs.appendFile(logFilePath, `[${timeStamp}] ${message}\n`);
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

async function autoDeleteExpiredUserSites() {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const expiredSites = await UserSite.findAll({
      where: {
        expires_at: {
          [Op.lt]: threeDaysAgo,
        },
      },
    });

    for (const site of expiredSites) {
      try {
        const configs =
          typeof site.configs === 'string'
            ? JSON.parse(site.configs)
            : site.configs;

        const filePaths = [];

        if (configs?.images && Array.isArray(configs.images)) {
          filePaths.push(
            ...configs.images.map((img) => helpers.resolveLocalPath(img))
          );
        }

        if (configs?.audioFile) {
          filePaths.push(helpers.resolveLocalPath(configs.audioFile));
        }

        for (const filePath of filePaths) {
          await helpers.safeUnlink(filePath);
        }

        const count = await Transaction.count({
          where: { user_sites_id: site.id },
        });

        if (count > 0) {
          await Transaction.destroy({
            where: { user_sites_id: site.id },
          });
        }

        await site.destroy();

        await appendLog(
          `Deleted UserSite id=${site.id} and related transactions/files`
        );
      } catch (innerError) {
        await appendLog(
          `Failed to delete UserSite id=${site.id}: ${innerError.message || innerError}`
        );
      }
    }
  } catch (error) {
    await appendLog(
      `Error in autoDeleteExpiredUserSites: ${error.message || error}`
    );
  }
}

module.exports = {
  autoDeleteExpiredUserSites,
};
