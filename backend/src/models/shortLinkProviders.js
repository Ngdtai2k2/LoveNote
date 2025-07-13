'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shortLinkProviders extends Model {
    static associate(models) {
      // define association here
    }
  }
  shortLinkProviders.init(
    {
      name: DataTypes.STRING,
      base_url: DataTypes.STRING,
      api_key: DataTypes.STRING,
      view_limit_per_day: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(15, 0),
    },
    {
      sequelize,
      modelName: 'shortLinkProviders',
      tableName: 'short_link_providers',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return shortLinkProviders;
};
