'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('short_link_providers', [
      {
        name: '1short',
        base_url:
          'https://api.1short.io/public/links?token={api_key}&url={link}&method_level=level_3_plus',
        api_key: '',
        view_limit_per_day: 1,
        price: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('short_link_providers', {
      name: '1short',
    });
  },
};
