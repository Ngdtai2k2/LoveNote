'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('voucher_templates', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.JSON,
      },
      description: {
        type: Sequelize.JSON,
      },
      discount_type: {
        type: Sequelize.ENUM('percent', 'amount', 'day'),
        allowNull: false,
      },
      discount_value: {
        type: Sequelize.INTEGER,
      },
      templates: {
        type: Sequelize.JSON,
      },
      expires_at: {
        type: Sequelize.DATE,
      },
      redeem_token_cost: {
        type: Sequelize.DECIMAL,
      },
      site_lifespan_days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      max_usage_per_user: {
        type: Sequelize.INTEGER,
      },
      total_redeem_limit: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM('redeemable', 'global', 'personal'),
        allowNull: false,
        defaultValue: 'redeemable',
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
    await queryInterface.dropTable('voucher_templates');
  },
};
