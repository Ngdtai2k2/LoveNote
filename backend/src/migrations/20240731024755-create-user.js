'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true,
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
      },
      is_banned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('users', ['email'], {
      name: 'idx_users_email',
      unique: true,
    });

    await queryInterface.addIndex('users', ['phone_number'], {
      name: 'idx_users_phone_number',
      unique: true,
    });

    await queryInterface.addIndex('users', ['role'], {
      name: 'idx_users_role',
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_email');
    await queryInterface.removeIndex('users', 'idx_users_phone_number');
    await queryInterface.removeIndex('users', 'idx_users_role');
    await queryInterface.dropTable('users');
  },
};
