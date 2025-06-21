'use strict';
const bcrypt = require('bcrypt');
const ShortUniqueId = require('short-unique-id');

module.exports = {
  async up(queryInterface, Sequelize) {
      const password = '12345678';
      const hashedPassword = await bcrypt.hash(password, 12);
      const uid = new ShortUniqueId({ length: 10 });

      await queryInterface.bulkDelete('users', null, {});

      await queryInterface.bulkInsert('users', [
        {
          id: uid.rnd(),
          full_name: 'Admin',
          email: 'admin@gmail.com',
          password: hashedPassword,
          role: 1,
          is_banned: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uid.rnd(),
          full_name: 'User',
          email: 'user@gmail.com',
          password: hashedPassword,
          role: 0,
          is_banned: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
