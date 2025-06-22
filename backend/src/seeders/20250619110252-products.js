'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    const SERVER_URL = process.env.SERVER_URL;

    await queryInterface.bulkInsert('products', [
      {
        id: 'love-001',
        name: 'Mưa Chữ Yêu Thương',
        slug: 'love-001',
        description: `Gửi đến người bạn yêu những dòng chữ ngọt ngào rơi như mưa trên màn hình, 
            kết hợp hiệu ứng chạm tạo pháo hoa chữ lung linh.
            Một cách đầy cảm xúc để thể hiện tình yêu của bạn, nhẹ nhàng mà sâu lắng.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/love-001.png`,
        demo_video_url: '#',
        rating: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  },
};
