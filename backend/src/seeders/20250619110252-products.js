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
        slug: 'matrix-love-rain',
        description: `Gửi đến người bạn yêu những dòng chữ ngọt ngào rơi như mưa trên màn hình, 
            kết hợp hiệu ứng chạm tạo pháo hoa chữ lung linh.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/matrix-love-rain.png`,
        demo_video_url: '#',
        rating: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'love-002',
        name: 'Nhịp Tim 3D',
        slug: 'heart-beat-visualizer',
        description: `Một món quà 3D lãng mạn kết hợp âm nhạc và ánh sáng –
         trái tim đập giữa thiên hà cùng nhịp với từng giai điệu. Lý tưởng để gửi gắm tình yêu trong dịp đặc biệt.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/heart-beat-visualizer.png`,
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
