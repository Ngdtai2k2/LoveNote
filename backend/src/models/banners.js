'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Banner extends Model {}
  Banner.init(
    {
      title: DataTypes.STRING,
      image: DataTypes.STRING,
      link: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Banner',
      tableName: 'banners',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return Banner;
};
