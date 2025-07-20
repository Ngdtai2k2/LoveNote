'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      order_code: {
        type: Sequelize.STRING(15),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      user_sites_id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'user_sites', key: 'id' },
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 0),
      },
      status: {
        type: Sequelize.ENUM('pending', 'paid', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_link: {
        type: Sequelize.STRING(255),
      },
      payment_method: {
        type: Sequelize.STRING(255),
        defaultValue: 'PAYOS',
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
    await queryInterface.dropTable('transactions');
  },
};
