const { User, Post, UserFollow, Comment, Like, Report, PostTag } = require('../db/models');



exports.createUser = async (req, res) => {
  const { nickName, account_device_token, email } = req.body;
  let profileImage = null;
  if (req.file) {
    // Guardar la ruta relativa para servir la imagen
    profileImage = '/uploads/' + req.file.filename;
  }
  try {
    if (!nickName || !account_device_token || !email) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    // Verifica unicidad de nickName y email
    const exists = await User.findOne({ where: { nickName } });
    if (exists) {
      return res.status(400).json({ error: 'El nickName ya está registrado' });
    }
    const existsEmail = await User.findOne({ where: { email } });
    if (existsEmail) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    const newUser = await User.create({ nickName, account_device_token, email, profileImage });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userPosts = await Post.findAll({
      where: { userId: userId },
      include: [{
        model: User,
        as: 'user',
      }
    ] // Si quieres incluir los datos del usuario
    });
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'nickName', 'profileImage'] });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({error: 'Error al obtener los usuarios'});
  }
};

// Seguir a un usuario
exports.followUser = async (req, res) => {
  const followerId = req.body.followerId;
  const followedId = req.params.id;
  if (followerId == followedId) return res.status(400).json({ error: 'No puedes seguirte a ti mismo.' });
  try {
    const [follow, created] = await UserFollow.findOrCreate({ where: { followerId, followedId } });
    if (!created) return res.status(400).json({ error: 'Ya sigues a este usuario.' });
    res.json({ mensaje: 'Ahora sigues a este usuario.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al seguir usuario.' });
  }
};

// Dejar de seguir a un usuario
exports.unfollowUser = async (req, res) => {
  const followerId = req.body.followerId;
  const followedId = req.params.id;
  try {
    const deleted = await UserFollow.destroy({ where: { followerId, followedId } });
    if (!deleted) return res.status(400).json({ error: 'No sigues a este usuario.' });
    res.json({ mensaje: 'Dejaste de seguir a este usuario.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al dejar de seguir usuario.' });
  }
};

// Obtener seguidores de un usuario
exports.getFollowers = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers', attributes: ['id', 'nickName'] }]
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.Followers);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener seguidores.' });
  }
};

// Obtener seguidos de un usuario
exports.getFollowing = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Following', attributes: ['id', 'nickName'] }]
    });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.Following);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener seguidos.' });
  }
};

// Borrado en cascada manual de usuario
exports.deleteUserCascade = async (req, res) => {
  const userId = req.params.id;
  try {
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
    res.json({ mensaje: 'Usuario eliminado correctamente (borrado total)' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario en cascada', detalle: error.message });
  }
};