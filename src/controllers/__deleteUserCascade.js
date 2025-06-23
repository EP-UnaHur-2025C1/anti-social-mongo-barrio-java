// Script temporal para borrado en cascada manual de usuario
// (No se usará en producción, solo para referencia)

const { User, Post, Comment, Like, Report, UserFollow, PostTag } = require('../db/models');

async function deleteUserCascade(userId) {
  // Eliminar likes del usuario
  await Like.destroy({ where: { userId } });
  // Eliminar comentarios del usuario
  await Comment.destroy({ where: { userId } });
  // Eliminar reports del usuario
  await Report.destroy({ where: { userId } });
  // Eliminar relaciones de follow (seguidores y seguidos)
  await UserFollow.destroy({ where: { followerId: userId } });
  await UserFollow.destroy({ where: { followedId: userId } });
  // Eliminar posts y sus dependencias
  const posts = await Post.findAll({ where: { userId } });
  for (const post of posts) {
    // Eliminar likes de cada post
    await Like.destroy({ where: { postId: post.id } });
    // Eliminar comentarios de cada post
    await Comment.destroy({ where: { postId: post.id } });
    // Eliminar reports de cada post
    await Report.destroy({ where: { postId: post.id } });
    // Eliminar tags asociados (PostTags)
    await PostTag.destroy({ where: { postId: post.id } });
    // Eliminar el post
    await post.destroy();
  }
  // Finalmente, eliminar el usuario
  await User.destroy({ where: { id: userId } });
}

module.exports = deleteUserCascade;
