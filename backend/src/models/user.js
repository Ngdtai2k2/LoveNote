'use strict';
const { Model } = require('sequelize');
const ShortUniqueId = require('short-unique-id');

module.exports = (sequelize, DataTypes) => {
  const uid = new ShortUniqueId({ length: 10 });
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Wallet, {
        foreignKey: 'user_id',
        as: 'wallet',
        onDelete: 'CASCADE',
      });

      User.hasMany(models.UserVoucherRedemption, {
        foreignKey: 'user_id',
        as: 'voucher_redemptions',
        onDelete: 'CASCADE',
      });

      User.belongsToMany(models.Voucher, {
        through: models.UserVoucherRedemption,
        foreignKey: 'user_id',
        otherKey: 'voucher_id',
        as: 'vouchers',
      });
    }
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
      hooks: {
        async afterCreate(user, options) {
          const { Wallet } = sequelize.models;

          await Wallet.create(
            {
              user_id: user.id,
              token_balance: 0,
            },
            { transaction: options.transaction }
          );
        },
      },
    }
  );
  return User;
};
