'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserVoucherRedemption extends Model {
    static associate(models) {
      UserVoucherRedemption.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });

      UserVoucherRedemption.belongsTo(models.Voucher, {
        foreignKey: 'voucher_id',
        as: 'voucher',
      });

      UserVoucherRedemption.belongsTo(models.VoucherTemplate, {
        foreignKey: 'voucher_template_id',
        as: 'template',
      });
    }
  }
  UserVoucherRedemption.init(
    {
      user_id: DataTypes.INTEGER,
      voucher_id: DataTypes.INTEGER,
      voucher_template_id: DataTypes.INTEGER,
      is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'UserVoucherRedemption',
      tableName: 'user_voucher_redemptions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return UserVoucherRedemption;
};
