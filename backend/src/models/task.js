'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.ShortLinkProviders, {
        foreignKey: 'provider_id',
        as: 'provider',
      });

      Task.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  Task.init(
    {
      user_id: {
        type: DataTypes.STRING(10),
        unique: true,
      },
      provider_id: DataTypes.INTEGER,
      short_link: {
        type: DataTypes.STRING,
        unique: true,
      },
      verify_token: {
        type: DataTypes.STRING,
        unique: true,
      },
      status: DataTypes.TINYINT,
      earned: DataTypes.DECIMAL(15, 0),
    },
    {
      sequelize,
      modelName: 'Task',
      tableName: 'Tasks',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Task;
};
