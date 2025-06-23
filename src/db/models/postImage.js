// models/Post_Image.js
module.exports = (sequelize, DataTypes) => {
  const Post_Image = sequelize.define('Post_Image', {
    url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Post_Image.associate = function (models) {
    Post_Image.belongsTo(models.Post, { foreignKey: 'postId' });
  };

  return Post_Image;
};
