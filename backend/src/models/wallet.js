'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    static associate(models) {
      Wallet.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  Wallet.init(
    {
      user_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      token_balance: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: 'Wallet',
      tableName: 'wallets',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Wallet;
};
