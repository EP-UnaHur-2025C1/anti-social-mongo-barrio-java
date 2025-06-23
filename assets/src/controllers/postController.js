const { Post, User, Tag, Comment, Like, Image, Report } = require('../db/models');

// Crear un nuevo post
exports.createPost = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);

    const { postContent, text, userId, tags } = req.body;
    const postText = postContent || text;
    const user = userId ? parseInt(userId, 10) : 1;
    let tagIds = [];
    if (tags) {
      try {
        tagIds = JSON.parse(tags);
      } catch (e) { tagIds = []; }
    }



    // Verifica que el usuario exista
    const userExists = await User.findByPk(user);
    if (!userExists) {
      return res.status(400).json({ error: 'El usuario no existe' });
    }

    const image = req.file ? req.file.filename : null;
    // Asegura que la URL de la imagen no tenga doble barra ni espacios
    const imageUrl = image ? `/uploads/${encodeURIComponent(image)}` : null;

    const newPost = await Post.create({ text: postText, userId: user, imageUrl });
    if (Array.isArray(tagIds) && tagIds.length > 0) {
      await newPost.setTags(tagIds);
      console.log('ASOCIACION DE TAGS REALIZADA para el post:', newPost.id);
    } else {
      console.log('NO SE ASOCIARON TAGS');
    }
    // Recargar el post con los tags y el nickName del usuario
    const postWithTags = await Post.findByPk(newPost.id, {
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    console.log('POST CREADO CON TAGS:', postWithTags.tags);
    res.status(201).json({
      id: postWithTags.id,
      text: postWithTags.text,
      imageUrl: postWithTags.imageUrl,
      userId: postWithTags.userId,
      nickName: postWithTags.user ? postWithTags.user.nickName : 'Usuario',
      tags: postWithTags.tags ? postWithTags.tags.map(t => ({ id: t.id, name: t.name })) : []
    });
  } catch (error) {
    console.error('Error en createPost:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los posts con el nickName del usuario
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ],
      order: [['id', 'DESC']]
    });
    const result = posts.map(p => ({
      id: p.id,
      text: p.text,
      imageUrl: p.imageUrl,
      userId: p.userId,
      nickName: p.user ? p.user.nickName : 'Usuario',
      tags: Array.isArray(p.tags) ? p.tags.map(t => ({ id: t.id, name: t.name })) : []
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts' });
  }
};

// Obtener todos los posts de un usuario
exports.getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.findAll({
      where: { userId },
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ],
      order: [['id', 'DESC']]
    });
    const result = posts.map(p => ({
      id: p.id,
      text: p.text,
      imageUrl: p.imageUrl,
      userId: p.userId,
      nickName: p.user ? p.user.nickName : 'Usuario',
      tags: p.tags ? p.tags.map(t => ({ id: t.id, name: t.name })) : []
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts del usuario' });
  }
};

// Obtener posts que tengan al menos uno de los tags indicados
exports.getPostsByTags = async (req, res) => {
  try {
    // Espera query param: tags=1,2,3
    let tagIds = req.query.tags;
    if (!tagIds) return res.status(400).json({ error: 'Faltan tags' });
    if (typeof tagIds === 'string') tagIds = tagIds.split(',').map(Number);
    if (!Array.isArray(tagIds) || tagIds.length === 0) return res.status(400).json({ error: 'Faltan tags' });

    // Buscar posts que tengan al menos uno de los tags indicados, pero incluir todos los tags asociados a cada post
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        {
          model: Tag,
          as: 'tags',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          // El filtro se hace en 'required: true' y 'where', pero luego se incluyen todos los tags
          where: { id: tagIds },
          required: true
        }
      ],
      order: [['id', 'DESC']]
    });

    // Para cada post, volver a buscar todos los tags asociados (sin filtro)
    const postsWithAllTags = await Promise.all(posts.map(async p => {
      const fullPost = await Post.findByPk(p.id, {
        include: [
          { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
        ]
      });
      return {
        id: p.id,
        text: p.text,
        imageUrl: p.imageUrl,
        userId: p.userId,
        nickName: p.user ? p.user.nickName : 'Usuario',
        tags: Array.isArray(fullPost.tags) ? fullPost.tags.map(t => ({ id: t.id, name: t.name })) : []
      };
    }));
    res.json(postsWithAllTags);
  } catch (error) {
    res.status(500).json({ error: 'Error al filtrar posts por tags' });
  }
};

// Eliminar un post por ID
exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    // Eliminar entidades relacionadas
    await Promise.all([
      Comment.destroy({ where: { postId: id } }),
      Like.destroy({ where: { postId: id } }),
      Image.destroy({ where: { postId: id } }),
      Report.destroy({ where: { postId: id } })
    ]);
    // Eliminar relación con tags (tabla intermedia)
    if (post.setTags) await post.setTags([]);

    await post.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el post' });
  }
};

// Editar un post existente
exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id, {
      include: [
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    if (!post) return res.status(404).json({ error: 'Post no encontrado' });

    // Actualizar texto
    if (typeof req.body.text === 'string') {
      post.text = req.body.text;
    }

    // Actualizar imagen
    if (req.body.removeImage === 'true') {
      // Eliminar referencia a la imagen
      post.imageUrl = null;
      // Aquí podrías eliminar el archivo físico si lo deseas
    } else if (req.file) {
      // Nueva imagen subida
      post.imageUrl = `/uploads/${encodeURIComponent(req.file.filename)}`;
    }

    // Actualizar tags
    let tagIds = [];
    if (req.body.tags) {
      try {
        tagIds = JSON.parse(req.body.tags);
      } catch (e) { tagIds = []; }
      if (Array.isArray(tagIds)) {
        await post.setTags(tagIds);
      }
    }

    await post.save();
    // Recargar post con usuario y tags
    const updatedPost = await Post.findByPk(post.id, {
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    res.json({
      id: updatedPost.id,
      text: updatedPost.text,
      imageUrl: updatedPost.imageUrl,
      userId: updatedPost.userId,
      nickName: updatedPost.user ? updatedPost.user.nickName : 'Usuario',
      tags: updatedPost.tags ? updatedPost.tags.map(t => ({ id: t.id, name: t.name })) : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el post' });
  }
};

// Obtener varios posts por IDs
exports.getPostsByIds = async (req, res) => {
  try {
    let ids = req.query.ids;
    if (!ids) return res.status(400).json({ error: 'Faltan ids' });
    if (typeof ids === 'string') ids = ids.split(',').map(Number);
    if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: 'Faltan ids' });
    const posts = await Post.findAll({
      where: { id: ids },
      include: [
        { model: User, as: 'user', attributes: ['nickName'] },
        { model: Tag, as: 'tags', attributes: ['id', 'name'], through: { attributes: [] } }
      ]
    });
    const result = posts.map(p => ({
      id: p.id,
      text: p.text,
      imageUrl: p.imageUrl,
      userId: p.userId,
      nickName: p.user ? p.user.nickName : 'Usuario',
      tags: Array.isArray(p.tags) ? p.tags.map(t => ({ id: t.id, name: t.name })) : []
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener posts por ids' });
  }
};

