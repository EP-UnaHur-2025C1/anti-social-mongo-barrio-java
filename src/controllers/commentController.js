const { Comment, User } = require('../db/models');

// Crear comentario
exports.createComment = async (req, res) => {
  try {
    const { text, postId, userId } = req.body;
    if (!text || !postId || !userId) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }
    const newComment = await Comment.create({ text, postId, userId });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error al crear comentario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener comentario por ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });
    res.json(comment);
  } catch (error) {
    console.error("Error al obtener comentario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los comentarios de un post
exports.getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.findAll({ where: { postId } });
    res.json(comments);
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener todos los comentarios (con nickName de usuario)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [{ model: User, as: 'user', attributes: ['nickName'] }],
      order: [['id', 'ASC']]
    });
    // Devuelve también el nickName del usuario
    const result = comments.map(c => ({
      id: c.id,
      text: c.text,
      postId: c.postId,
      userId: c.userId,
      nickName: c.user ? c.user.nickName : 'Usuario',
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

// Obtener todos los comentarios de un usuario
exports.getCommentsByUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const comments = await Comment.findAll({
      where: { userId },
      attributes: ['id', 'text', 'postId', 'userId', 'createdAt', 'updatedAt']
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios del usuario' });
  }
};

// Actualizar comentario
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'El texto es requerido' });
    }
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    comment.text = text;
    await comment.save();

    res.json({ mensaje: 'Comentario actualizado', comment });
  } catch (error) {
    console.error("Error al actualizar comentario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar comentario
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: 'Comentario no encontrado' });

    await comment.destroy();
    res.json({ mensaje: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
