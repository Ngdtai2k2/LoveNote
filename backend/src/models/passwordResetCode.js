'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PasswordResetCode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PasswordResetCode.init(
    {
      email: DataTypes.STRING,
      code: DataTypes.STRING,
      expires_at: DataTypes.DATE,
      used: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'PasswordResetCode',
      tableName: 'password_reset_code',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  return PasswordResetCode;
};
