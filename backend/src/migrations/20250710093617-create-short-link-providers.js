'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('short_link_providers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      base_url: {
        type: Sequelize.STRING,
        unique: false,
      },
      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      view_limit_per_day: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(15, 0),
        defaultValue: 0,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('short_link_providers');
  },
};
