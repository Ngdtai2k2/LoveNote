'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('short_link_providers', [
      {
        name: '1short',
        base_url:
          'https://api.1short.io/public/links?token={api_key}&url={link}&method_level=level_3_plus',
        api_key: process.env.ONE_LINK_KEY,
        view_limit_per_day: 2,
        price: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Link4m',
        base_url: 'https://link4m.co/api-shorten/v2?api={api_key}&url={link}',
        api_key: process.env.LINK_4M_KEY,
        view_limit_per_day: 2,
        price: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Link2m',
        base_url: 'https://link2m.net/api-shorten/v2?api={api_key}&url={link}',
        api_key: process.env.LINK_2M_KEY,
        view_limit_per_day: 2,
        price: 10,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Shrink Me',
        base_url: 'https://shrinkme.io/api?api={api_key}&url={link}',
        api_key: process.env.SHRINK_ME_KEY,
        view_limit_per_day: 1,
        price: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('short_link_providers', null, {});
  },
};
