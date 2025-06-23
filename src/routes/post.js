const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const db = require('../db/models');
const multer = require("multer");
const path = require("path");
const validatePost = require('../middlewares/validatePost');
const { ifError } = require('assert');
const fs = require('fs');

// Multer storage personalizado para guardar con extensión original y nombre único
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints para gestionar publicaciones
*/


/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Obtener todos los posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Lista de posts
*/

// Obtener todos los posts con nickName
router.get('/', require('../controllers/postController').getAllPosts);
router.get('/user/:userId', require('../controllers/postController').getPostsByUser);
router.get('/by-tags', postController.getPostsByTags);
router.get('/by-ids', postController.getPostsByIds);


/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crear un nuevo post
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - userId
 *             properties:
 *               text:
 *                 type: string
 *               userId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Post creado
 *       400:
 *         description: Datos inválidos
*/

// Cambia el orden: primero upload.single('image'), luego validatePost
router.post('/create', upload.single('image'), validatePost, postController.createPost);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Obtener un post por ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Post encontrado
 *       404:
 *         description: Post no encontrado
*/

// Obtener un post por ID
router.get('/:id', async (req, res) => {
  try {
    const post = await db.Post.findByPk(req.params.id);
    if(!post){
      return res.status(404).json({ error: 'Post no encontrado' });
    }
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el post'});
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Actualizar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Post no encontrado
*/

//Actualizar un post
router.put('/:id', upload.single('image'), postController.updatePost);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Eliminar un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post eliminado
 *       404:
 *         description: Post no encontrado
*/

// Eliminar un post por ID
router.delete('/:id', postController.deletePost);

//Eliminar un post

router.delete('/:id', async (req,res) => {
  try {
    const post = await db.Post.findByPk(req.params.id);
    if(!post){
      return res.status(404).json({ error: 'Post no encontrado'});
    }
    await post.destroy();
    res.json({ mensaje: 'Post eliminado correctamente'});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el post'});
  }
});

// Endpoint temporal para ver los valores de imageUrl de todos los posts
router.get('/debug/image-urls', async (req, res) => {
  try {
    const posts = await db.Post.findAll({ attributes: ['id', 'text', 'imageUrl'] });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint temporal para eliminar todos los posts que no tengan imagen válida
router.delete('/debug/clean-invalid', async (req, res) => {
  try {
    const posts = await db.Post.findAll();
    let deleted = 0;
    for (const post of posts) {
      if (post.imageUrl) {
        const filePath = path.join(__dirname, '../../', post.imageUrl);
        if (!fs.existsSync(filePath)) {
          await post.destroy();
          deleted++;
        }
      } else {
        await post.destroy();
        deleted++;
      }
    }
    res.json({ mensaje: `Posts inválidos eliminados: ${deleted}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;