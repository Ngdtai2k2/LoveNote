const cron = require('node-cron');
const { autoDeleteExpiredUserSites } = require('./autoDeleteExpiredUserSites');
const { autoDeleteExpiredVouchers } = require('./autoDeleteExpiredVouchers');

cron.schedule(
  '0 1,13 * * *',
  async () => {
    try {
      await autoDeleteExpiredUserSites();
      await autoDeleteExpiredVouchers();
    } catch (err) {
      console.error('Error in combined auto-delete cron job:', err);
    } finally {
      console.log('Combined auto-delete task completed.');
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  }
);
