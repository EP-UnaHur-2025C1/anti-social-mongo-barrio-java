const {Tag, Post, User} = require('../db/models');

// Crear un nuevo tag
exports.createTag = async (req, res) => {
    try {
        const { name } = req.body;
        const tag = await Tag.create({ name });
        res.status(201).json(tag);
    } catch (error){
        console.error('Error al crear el tag:', error);
        res.status(500).json({ error: 'Error al crear el tag' });
    }
};

// Obtener todos los tags 
exports.getAllTags = async (req, res) => {
    try {
        const tags = await Tag.findAll();
        res.json(tags);
    } catch (error) {
        console.error('Error al obtener tags:', error);
        res.status(500).json({error: 'Error al obtener tags'});
    }
};

// Asociar tags a un post
exports.addTagsToPost = async (req, res) => {
    try {
        const { tagIds } = req.body; // Array de Ids
        const { postId } = req.params;

        const post = await Post.findByPk(postId);
        if (!post) return res.status(404).json({ error: 'Post no encontrado' });
        
        await post.setTags(tagIds); // Reemplaza los tags actuales
        res.json({ mensaje: 'Tags asociados correctamente' });
    } catch (error) {
        console.error('Error al asociar tags al post:', error);
        res.status(500).json({ error: 'Error al asociar tags'});
    }
};

// Obtener tags de un post
exports.getTagsOfPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findByPk(postId, {
            include: {
                model: Tag,
                as: 'tags',
                through: { attributes: []}, // Para que no devuelva info de la tabla intermedia
            },
        });

        if(!post) return res.status(404).json({ error: 'Post no encontrado' });

        res.json(post.tags)

    } catch (error) {
        console.error('Error al obtener tags del post:', error);
        res.status(500).json({ error: 'Error al obtener tags' });
    }
};

// Obtener posts de un tags especifico

exports.getPostsByTag = async (req, res) => {
    try {
        const { tagId } = req.params;

        const tag = await Tag.findByPk(tagId, {
            include: {
                model: Post,
                as: 'posts',
                include: {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username'],
                },
                through: { attributes: [] },
            },
        });

        if(!tag) {
            return res.status(404).json({ error: 'Tag no encontrado'});
        }
        res.json(tag.posts);
    } catch (error) {
        console.error('Error al obtener postspor tag:', error);
        res.status(500).json({ error: 'error al obtener los posts' });
    }
};
































