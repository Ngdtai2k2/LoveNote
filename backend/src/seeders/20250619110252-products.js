'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
    const SERVER_URL = process.env.SERVER_URL;

    await queryInterface.bulkInsert('products', [
      {
        id: 'love-001',
        name: 'Mưa Chữ Yêu Thương (I)',
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
      {
        id: 'love-003',
        name: 'Ngân hà chữ',
        slug: 'galaxy-love-letter',
        description: `Một thông điệp kỹ thuật số giữa dải ngân hà, kết hợp hiệu ứng vũ trụ 3D và âm nhạc ngọt ngào.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/galaxy-love-letter.png`,
        demo_video_url: '#',
        rating: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'love-004',
        name: 'Mưa Chữ Yêu Thương (II)',
        slug: 'matrix-rain-text',
        description: `Từng từ, từng thông điệp xuất hiện như đang được viết giữa trời mưa Matrix – tạo nên một khoảnh khắc bất ngờ và xúc động.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/matrix-rain-text.png`,
        demo_video_url: '#',
        rating: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'love-005',
        name: 'Tràn bộ nhớ',
        slug: 'memory-overflow',
        description: `Mô phỏng hiệu ứng tràn bộ nhớ – nơi ký ức dồn nén vỡ òa thành những cảm xúc không thể gọi tên.`,
        price: 0,
        discount: 0,
        thumbnail_url: `${SERVER_URL}/assets/images/memory-overflow.png`,
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
