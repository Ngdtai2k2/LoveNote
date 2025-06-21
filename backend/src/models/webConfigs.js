'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class WebConfig extends Model {}
  WebConfig.init(
    {
      key: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      value: {
        type: DataTypes.JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WebConfig',
      tableName: 'web_configs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return WebConfig;
};
