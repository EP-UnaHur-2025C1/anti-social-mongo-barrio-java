const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Endpoints para gestión de imágenes
*/

/**
 * @swagger
 * /images/{filename}:
 *   get:
 *     summary: Obtener imagen por nombre de archivo
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo de imagen
 *     responses:
 *       200:
 *         description: Imagen mostrada
 *       404:
 *         description: Imagen no encontrada
*/

// Mostrar imagen
router.get('/:filename', imageController.getImage);

/**
 * @swagger
 * /images/{filename}:
 *   delete:
 *     summary: Eliminar una imagen
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del archivo de imagen
 *     responses:
 *       200:
 *         description: Imagen eliminada correctamente
 *       404:
 *         description: Imagen no encontrada
*/

//Eliminar imagen
router.delete('/:filename', imageController.deleteImage);

/**
 * @swagger
 * /images/uplpad:
 *   post:
 *     summary: Subir una imagen
 *     tags: [Images]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Imagen subida correctamente
 *       400:
 *         description: No se subió ningún archivo
*/

// Subir imagen
router.post('/upload', imageController.upload.single('image'), imageController.uploadImage);

module.exports = router;