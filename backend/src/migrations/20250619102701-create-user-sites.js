'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_sites', {
      id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      product_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onDelete: 'CASCADE',
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      title: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      logo_url: { type: Sequelize.STRING },
      cover_image: { type: Sequelize.STRING },
      data: { type: Sequelize.JSON },
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
    await queryInterface.dropTable('user_sites');
  },
};
