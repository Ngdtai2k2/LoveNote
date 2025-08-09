const cron = require('node-cron');
const { autoDeleteExpiredUserSites } = require('./autoDeleteExpiredUserSites');

// Schedule the auto-delete task to run every day at midnight and 13 pm
cron.schedule(
  '0 1,13 * * *',
  async () => {
    try {
      console.log('Running auto-delete expired user sites task...');
      await autoDeleteExpiredUserSites();
    } catch (err) {
      console.error('Error in cron job:', err);
    } finally {
      console.log('Auto-delete expired user sites task completed.');
    }
  },
  {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh',
  }
);
