'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});

    await queryInterface.bulkInsert('banners', [
      {
        title: 'Chào mừng đến với shop!',
        image: '/img/banner1.jpg',
        link: '/',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Giảm giá mùa hè',
        image: '/img/banner2.jpg',
        link: '/summer-sale',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Sắp ra mắt',
        image: '/img/banner3.jpg',
        link: null,
        is_active: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});
  },
};
