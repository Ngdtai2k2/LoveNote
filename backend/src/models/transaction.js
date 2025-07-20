'use strict';
const { Model } = require('sequelize');
const ShortUniqueId = require('short-unique-id');

module.exports = (sequelize, DataTypes) => {
  const uid = new ShortUniqueId({ length: 10 });

  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Transaction.init(
    {
      id: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        defaultValue: () => uid.rnd(),
      },
      order_code: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      user_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      user_sites_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      total_amount: DataTypes.DECIMAL(15, 0),
      status: DataTypes.STRING,
      payment_link: DataTypes.STRING(255),
      payment_method: {
        type: DataTypes.STRING(255),
        defaultValue: 'PAYOS',
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Transaction;
};
