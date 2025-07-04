'use strict';
const { Model } = require('sequelize');
const ShortUniqueId = require('short-unique-id');

module.exports = (sequelize, DataTypes) => {
  const uid = new ShortUniqueId({ length: 10 });
  class User extends Model {
    static associate() {}
  }
  User.init(
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        defaultValue: () => uid.rnd(),
      },
      full_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      role: DataTypes.TINYINT,
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return User;
};
