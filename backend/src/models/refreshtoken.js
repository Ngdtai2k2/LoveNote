'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  RefreshToken.init(
    {
      user_id: {
        type: DataTypes.STRING(10),
        unique: true,
      },
      token: DataTypes.STRING,
      expires_at: DataTypes.DATE,
      device_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return RefreshToken;
};
