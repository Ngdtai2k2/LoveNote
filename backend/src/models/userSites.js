'use strict';
const { Model } = require('sequelize');
const ShortUniqueId = require('short-unique-id');

module.exports = (sequelize, DataTypes) => {
  const uid = new ShortUniqueId({ length: 10 });

  class UserSite extends Model {
    static associate(models) {
      UserSite.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'CASCADE',
      });
      UserSite.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product',
        onDelete: 'CASCADE',
      });
      UserSite.hasMany(models.Transaction, {
        foreignKey: 'user_sites_id',
        as: 'transactions',
      });
      UserSite.belongsTo(models.Music, {
        foreignKey: 'music_id',
        as: 'music',
      });
    }
  }

  UserSite.init(
    {
      id: {
        type: DataTypes.STRING(10),
        allowNull: false,
        primaryKey: true,
        defaultValue: () => uid.rnd(),
      },
      user_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      product_id: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      configs: {
        type: DataTypes.JSON,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      music_id: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'UserSite',
      tableName: 'user_sites',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return UserSite;
};
