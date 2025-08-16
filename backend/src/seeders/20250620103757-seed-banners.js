'use strict';
require('dotenv').config();

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});

    await queryInterface.bulkInsert('banners', [
      {
        title: '',
        image: '/assets/images/banner-1.PNG',
        link: '#',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: '',
        image: '/assets/images/banner-2.PNG',
        link: '#',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: '',
        image: '/assets/images/banner-3.PNG',
        link: '#',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});
  },
};
