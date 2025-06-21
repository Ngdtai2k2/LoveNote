'use strict';
require('dotenv').config();

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banners', null, {});

    const SERVER_URL = process.env.SERVER_URL;

    await queryInterface.bulkInsert('banners', [
      {
        title: 'Write a special note to someone you love',
        image: `${SERVER_URL}/assets/images/banner-1.PNG`,
        link: '#',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Send a special message to a loved one',
        image: `${SERVER_URL}/assets/images/banner-2.PNG`,
        link: '#',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: 'Create a love note and share it',
        image: `${SERVER_URL}/assets/images/banner-1.PNG`,
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
