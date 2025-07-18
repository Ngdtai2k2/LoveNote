'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VoucherTemplate extends Model {
    static associate(models) {
      VoucherTemplate.hasMany(models.UserVoucherRedemption, {
        foreignKey: 'voucher_template_id',
        as: 'redemptions',
        onDelete: 'CASCADE',
      });

      VoucherTemplate.hasMany(models.Voucher, {
        as: 'vouchers',
        foreignKey: 'template_id',
      });
    }
  }

  VoucherTemplate.init(
    {
      name: DataTypes.JSON,
      description: DataTypes.JSON,
      discount_type: DataTypes.STRING,
      discount_value: DataTypes.INTEGER,
      templates: DataTypes.JSON,
      expires_at: DataTypes.DATE,
      redeem_token_cost: DataTypes.DECIMAL(15, 0),
      site_lifespan_days: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      max_usage_per_user: DataTypes.INTEGER,
      total_redeem_limit: DataTypes.INTEGER,
      type: {
        type: DataTypes.ENUM('redeemable', 'global', 'personal'),
        allowNull: false,
        defaultValue: 'redeemable',
      },
    },
    {
      sequelize,
      modelName: 'VoucherTemplate',
      tableName: 'voucher_templates',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return VoucherTemplate;
};
