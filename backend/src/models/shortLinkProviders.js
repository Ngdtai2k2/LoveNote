'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShortLinkProviders extends Model {
    static associate(models) {
      ShortLinkProviders.hasOne(models.UserProviderLimit, {
        foreignKey: 'provider_id',
        as: 'user_provider',
      });
    }
  }
  ShortLinkProviders.init(
    {
      name: DataTypes.STRING,
      base_url: DataTypes.STRING,
      api_key: DataTypes.STRING,
      view_limit_per_day: DataTypes.INTEGER,
      price: DataTypes.DECIMAL(15, 0),
    },
    {
      sequelize,
      modelName: 'ShortLinkProviders',
      tableName: 'short_link_providers',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return ShortLinkProviders;
};
