'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vouchers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.ENUM('personal', 'global'),
        allowNull: false,
      },
      discount_type: {
        type: Sequelize.ENUM('percent', 'amount'),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.DECIMAL,
      },
      max_usage: {
        type: Sequelize.INTEGER,
      },
      used_count: {
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      templates: {
        type: Sequelize.JSON,
      },
      expires_at: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('vouchers');
  },
};
