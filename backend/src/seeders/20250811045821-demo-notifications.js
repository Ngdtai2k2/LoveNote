'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(`
      SELECT id, email FROM users WHERE email IN ('admin@gmail.com', 'user@gmail.com')
    `);

    const adminId = users.find((u) => u.email === 'admin@gmail.com')?.id;
    const userId = users.find((u) => u.email === 'user@gmail.com')?.id;

    if (!adminId || !userId) {
      throw new Error('Không tìm thấy admin hoặc user trong bảng users');
    }

    const now = new Date();

    // 2 thông báo ban đầu
    const notifications = [
      {
        title: 'Chào mừng Admin!',
        message: 'Tài khoản admin đã được tạo thành công.',
        type: 'system',
        data: JSON.stringify({ redirect: '/admin/dashboard' }),
        user_id: adminId,
        is_read: false,
        read_at: null,
        created_at: now,
        updated_at: now,
      },
      {
        title: 'Chào mừng User!',
        message: 'Tài khoản của bạn đã được tạo thành công.',
        type: 'system',
        data: JSON.stringify({ redirect: '/' }),
        user_id: userId,
        is_read: false,
        read_at: null,
        created_at: now,
        updated_at: now,
      },
    ];

    // 10 thông báo thêm cho user
    const extraUserNotifications = Array.from({ length: 30 }, (_, i) => ({
      title: `Thông báo số ${i + 1}`,
      message: `Đây là nội dung thông báo số ${i + 1} dành cho bạn.`,
      type: 'system',
      data: JSON.stringify({ redirect: `/page/${i + 1}` }),
      user_id: userId,
      is_read: false,
      read_at: null,
      created_at: new Date(now.getTime() - i * 86400000), // mỗi thông báo lùi 1 ngày
      updated_at: new Date(now.getTime() - i * 86400000),
    }));

    await queryInterface.bulkInsert(
      'notifications',
      [...notifications, ...extraUserNotifications],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  },
};
