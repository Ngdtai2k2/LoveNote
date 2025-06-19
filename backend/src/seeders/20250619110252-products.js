'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        id: 'PRODUCT-01',
        name: 'Romantic Letter Template',
        slug: 'romantic-letter',
        description:
          'A heartfelt letter template to express your deepest love.',
        price: 15.99,
        discount: 20,
        thumbnail_url: 'https://example.com/images/love-letter.jpg',
        demo_video_url: 'https://example.com/videos/love-letter-demo.mp4',
        rating: 4.8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'PRODUCT-02',
        name: 'Valentine Card Template',
        slug: 'valentine-card',
        description:
          "A beautiful Valentine's Day card template with floral design.",
        price: 12.5,
        discount: 10,
        thumbnail_url: 'https://example.com/images/valentine-card.jpg',
        demo_video_url: 'https://example.com/videos/valentine-card.mp4',
        rating: 4.5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'PRODUCT-03',
        name: 'Anniversary Note Template',
        slug: 'anniversary-note',
        description:
          'Celebrate your anniversary with this elegant love note design.',
        price: 10.0,
        discount: 5,
        thumbnail_url: 'https://example.com/images/anniversary-note.jpg',
        demo_video_url: 'https://example.com/videos/anniversary-note.mp4',
        rating: 4.2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'PRODUCT-04',
        name: 'Wedding Invitation Template',
        slug: 'wedding-invitation',
        description:
          'Invite your guests in style with this romantic wedding template.',
        price: 25.0,
        discount: 15,
        thumbnail_url: 'https://example.com/images/wedding-invitation.jpg',
        demo_video_url: 'https://example.com/videos/wedding-invitation.mp4',
        rating: 4.9,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', {
      id: {
        [Sequelize.Op.in]: [
          'PRODUCT-01',
          'PRODUCT-02',
          'PRODUCT-03',
          'PRODUCT-04',
        ],
      },
    });
  },
};
