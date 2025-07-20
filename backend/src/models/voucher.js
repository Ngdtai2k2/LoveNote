'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.hasMany(models.UserVoucherRedemption, {
        foreignKey: 'voucher_id',
        as: 'redemptions',
      });
    }
  }
  Voucher.init(
    {
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      max_usage: DataTypes.INTEGER,
      used_count: DataTypes.INTEGER,
      expires_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Voucher',
      tableName: 'vouchers',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Voucher;
};
