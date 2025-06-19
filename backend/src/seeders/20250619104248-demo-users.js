'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const password = '12345678';
    const hashedPassword = await bcrypt.hash(password, 12);

    await queryInterface.bulkInsert('users', [
      {
        id: 'U000000001',
        full_name: 'Admin',
        email: 'admin@gmail.com',
        phone_number: '0111111110',
        password: hashedPassword,
        role: 1,
        is_banned: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'U000000002',
        full_name: 'User',
        email: 'user@gmail.com',
        phone_number: '0111111111',
        password: hashedPassword,
        role: 0,
        is_banned: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: ['admin@gmail.com', 'user@gmail.com'],
      },
    });
  },
};
