'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        id: 'PRODUCT-01',
        name: 'Fashion Template',
        slug: 'fashion-1',
        description: 'A clean and modern fashion store layout',
        price: 199000,
        thumbnail_url: 'https://example.com/images/fashion-thumb.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'PRODUCT-02',
        name: 'Food Delivery Template',
        slug: 'food-1',
        description: 'A fast and responsive food delivery landing page',
        price: 149000,
        thumbnail_url: 'https://example.com/images/food-thumb.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', {
      id: {
        [Sequelize.Op.in]: ['P000001', 'P000002'],
      },
    });
  },
};
