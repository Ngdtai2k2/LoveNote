'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProviderLimit extends Model {
    static associate(models) {
      UserProviderLimit.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
    }
  }
  UserProviderLimit.init(
    {
      user_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      provider_id: DataTypes.INTEGER,
      views_today: DataTypes.INTEGER,
      last_reset_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'UserProviderLimit',
      tableName: 'user_provider_limits',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return UserProviderLimit;
};
