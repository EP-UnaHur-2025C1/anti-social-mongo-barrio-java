'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
  }, {
    tableName: 'Tags',
    timestamps: true,
  });

  Tag.associate = function(models) {
    Tag.belongsToMany(models.Post, {
      through: 'PostTags',
      foreignKey: 'tagId',
      otherKey: 'postId',
      as: 'posts'
    });
  };

  return Tag;
};