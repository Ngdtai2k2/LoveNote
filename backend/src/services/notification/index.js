const paginate = require('@helpers/paginate');
const { Notification } = require('@models');

const notificationService = {
  getByUser: async (req) => {
    const userId = req.user?.id;

    if (!userId) throw { code: 400, messageKey: 'validate:no_user_id' };

    const notifications = await paginate(Notification, req, {
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });

    return {
      code: 200,
      data: notifications,
    };
  },

  markRead: async (req) => {
    const { id: notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({
      where: { id: notificationId, user_id: userId },
    });

    if (!notification) {
      throw { code: 404, messageKey: 'not_found:notification' };
    }

    if (notification.read_at) {
      throw { code: 400, messageKey: 'validate:already_read' };
    }

    await notification.update({
      read_at: new Date(),
      is_read: true,
    });

    return {
      code: 200,
      data: notification,
    };
  },

  markReadAll: async (req) => {
    const userId = req.user.id;

    const [updatedCount] = await Notification.update(
      {
        read_at: new Date(),
        is_read: true,
      },
      {
        where: {
          user_id: userId,
          is_read: false,
        },
      }
    );

    return {
      code: 200,
      data: updatedCount,
    };
  },
};

module.exports = notificationService;
