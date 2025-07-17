'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    static associate(models) {
      Voucher.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      Voucher.hasMany(models.UserVoucherRedemption, {
        foreignKey: 'voucher_id',
        as: 'redemptions',
        onDelete: 'CASCADE',
      });
    }
  }
  Voucher.init(
    {
      code: DataTypes.STRING,
      type: DataTypes.STRING,
      discount_type: DataTypes.STRING,
      discount_value: DataTypes.DECIMAL(15, 0),
      max_usage: DataTypes.INTEGER,
      used_count: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      templates: DataTypes.JSON,
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
