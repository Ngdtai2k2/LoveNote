'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('web_configs', null, {});
    await queryInterface.bulkInsert('web_configs', [
      {
        key: 'site_name',
        value: JSON.stringify({ vi: 'LoveNote', en: 'LoveNote' }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'description_site',
        value: JSON.stringify({
          vi: 'LoveNote là nền tảng giúp bạn dễ dàng tạo những trang web nhỏ xinh để gửi thông điệp yêu thương, lời chúc ngọt ngào hoặc món quà tinh tế đến người đặc biệt của bạn. Chỉ với vài bước đơn giản, bạn có thể chọn mẫu, viết lời nhắn và chia sẻ đến người thân, bạn bè hoặc người yêu — tạo nên những khoảnh khắc ý nghĩa và đáng nhớ.',
          en: 'LoveNote is a platform that lets you easily create personalized mini websites to send heartfelt messages, sweet wishes, or thoughtful gifts to your loved ones. With just a few simple steps, you can choose a template, write your message, and share it with your partner, family, or friends — turning everyday moments into meaningful memories.',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'copyright',
        value: JSON.stringify({
          vi: 'Bản quyền © 2025 - @ngdtai2k2',
          en: 'Copyright © 2025 - @ngdtai2k2',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'contacts',
        value: JSON.stringify({
          phone: '0967273792',
          email: 'support@notelove.com',
          google_map: 'https://maps.app.goo.gl/RhBnQki42gVzsdz56',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'socials',
        value: JSON.stringify({
          facebook: 'https://fb.me/ngdtai2k2',
          instagram: '#',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        key: 'contacts_note',
        value: JSON.stringify({
          vi: 'Nếu có vấn đề gì thắc mắc hãy liên hệ cho tôi nhe!',
          en: 'If you have any questions or concerns, please contact me!',
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('web_configs', null, {});
  },
};
