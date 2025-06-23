// models/Post.js
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

    Post.belongsToMany(models.Tag, {
      through: 'PostTags',
      foreignKey: 'postId',
      otherKey: 'tagId',
      as: 'tags'
    });
  };

  return Post;
};
