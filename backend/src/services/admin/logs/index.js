const fs = require('fs').promises;
const path = require('path');

const rootDir = path.resolve(__dirname, '../../../../');
const logFilePath = path.join(
  rootDir,
  'logs',
  'autoDeleteExpiredUserSites.log'
);

const logsService = {
  getLogsAutoDeleteSites: async () => {
    try {
      const data = await fs.readFile(logFilePath, 'utf-8');
      return {
        code: 200,
        data: data,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          code: 200,
          data: '',
        };
      }
      throw {
        code: 500,
        messageKey: 'message:failed_read_file',
      };
    }
  },
};

module.exports = logsService;
