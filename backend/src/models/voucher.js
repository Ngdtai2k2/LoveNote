'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.belongsTo(models.VoucherTemplate, {
        as: 'template',
        foreignKey: 'template_id',
      });

      Voucher.hasMany(models.UserVoucherRedemption, {
        as: 'redemptions',
        foreignKey: 'voucher_id',
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
