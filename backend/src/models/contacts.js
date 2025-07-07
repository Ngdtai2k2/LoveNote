'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Contacts extends Model {
    static associate(models) {
      // define association here
    }
  }

  Contacts.init(
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true,
          len: [5, 150],
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          len: [10, 1200],
        },
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: false,
        validate: {
          len: [7, 45],
        },
      },
    },
    {
      sequelize,
      modelName: 'Contacts',
      tableName: 'contacts',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Contacts;
};
