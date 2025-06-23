// models/posttag.js
module.exports = (sequelize, DataTypes) => {
  const PostTag = sequelize.define('PostTag', {}, {
    tableName: 'PostTags',
    timestamps: true
  });
  return PostTag;
};
