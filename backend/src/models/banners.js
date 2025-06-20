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
      modelName: 'Banners',
      tableName: 'banners',
      underscored: true,
      timestamps: true,
    }
  );
  return Banner;
};
