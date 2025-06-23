const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tagController');
const validateTag = require('../middlewares/validateTag');

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Endpoints para gestionar tags y su relación con posts
*/

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Crear un nuevo tag
 *     tags: [Tags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag creado correctamente
 *       400:
 *         description: Nombre del tag inválido o repetido
*/

// Crear un tag
router.post('/', validateTag, tagController.createTag);

/**
 * @swagger
 * /tags:
 *   get:
 *     summary: Listar todos los tags
 *     tags: [Tags]
 *     responses:
 *       200:
 *         description: Lista de tags existentes
*/

// Listar todos los tags
router.get('/', tagController.getAllTags);

/**
 * @swagger
 * /tags/post/{postId}:
 *   post:
 *     summary: Asociar uno o más tags a un post
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               tags: ["javascript", "nodejs"]
 *     responses:
 *       200:
 *         description: Tags asociados correctamente
 *       400:
 *         description: Error en los datos
*/

// Asociar tags a un post
router.post('/post/:postId', tagController.addTagsToPost);

/**
 * @swagger
 * /tags/post/{postId}:
 *   get:
 *     summary: Obtener todos los tags asociados a un post
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del post
 *     responses:
 *       200:
 *         description: Lista de tags asociados
 *       404:
 *         description: Post no encontrado
*/

//Obtener tags de un post 
router.get('/post/:postId', tagController.getTagsOfPost);

/**
 * @swagger
 * /tags/{tagId}/posts:
 *   get:
 *     summary: Obtener todos los posts asociados a un tag
 *     tags: [Tags]
 *     parameters:
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tag
 *     responses:
 *       200:
 *         description: Lista de posts asociados
 *       404:
 *         description: Tag no encontrado
*/

//Obtener los posts de un tag especifico
router.get('/:tagId/posts', tagController.getPostsByTag);

module.exports = router;