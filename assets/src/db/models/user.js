'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.hasMany(models.Like, {
        foreignKey: 'userId',
        as: 'likes',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.hasMany(models.Report, {
        foreignKey: 'userId',
        as: 'reports',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.belongsToMany(models.User, {
        as: 'Followers',
        through: models.UserFollow,
        foreignKey: 'followedId',
        otherKey: 'followerId',
        onDelete: 'CASCADE',
        hooks: true
      });
      User.belongsToMany(models.User, {
        as: 'Following',
        through: models.UserFollow,
        foreignKey: 'followerId',
        otherKey: 'followedId',
        onDelete: 'CASCADE',
        hooks: true
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // <-- clave única
    },
    account_device_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // <-- recomendable también
      validate: {
        isEmail: true
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, 
  {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  });
  return User;
};