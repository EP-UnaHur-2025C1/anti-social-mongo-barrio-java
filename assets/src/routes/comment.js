const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const validateComment = require('../middlewares/validateComment');

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Endpoints para gestionar comentarios
*/

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - userId
 *               - postId
 *             properties:
 *               text:
 *                 type: string
 *               userId:
 *                 type: integer
 *               postId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comentario creado
 *       400:
 *         description: Datos inválidos
*/

// Obtener todos los comentarios (para el frontend, con nickName)
router.get('/all', commentController.getAllComments);

// Crear un comentario
router.post('/', validateComment, commentController.createComment);

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Obtener comentario por ID
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario
 *     responses:
 *       200:
 *         description: Comentario encontrado
 *       404:
 *         description: Comentario no encontrado
*/

// Obtener comentario por ID
router.get('/:id', commentController.getCommentById);

/**
 * @swagger
 * /comments/post/{postId}:
 *   get:
 *     summary: Obtener todos los comentarios de un post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *       404:
 *         description: Post no encontrado o sin comentarios
*/

// Obtener todos los comentarios de un post
router.get('/post/:postId', commentController.getCommentsByPostId);

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Actualizar un comentario
 *     tags: [Comments]
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
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comentario actualizado
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Comentario no encontrado
*/

// Actualizar comentario
router.put('/:id', commentController.updateComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del comentario a eliminar
 *     responses:
 *       200:
 *         description: Comentario eliminado
 *       404:
 *         description: Comentario no encontrado
*/

// Eliminar comentario
router.delete('/:id', commentController.deleteComment);

// Obtener todos los comentarios de un usuario
router.get('/user/:id', commentController.getCommentsByUser);

module.exports = router;
