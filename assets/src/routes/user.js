const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { User, Post } = require('../db/models');
const validateUser = require('../middlewares/validateUser');
const uploadProfileImage = require('../middlewares/multerProfileImage');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestionar usuarios
*/

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               account_device_token:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       400:
 *         description: Datos inválidos
*/

// Crear usuario
router.post('/', uploadProfileImage.single('foto'), validateUser, userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtener todos los usuarios con sus posts
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
*/

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Post, as: 'posts' }]
    });
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({error: 'Error al obtener usuarios'});
  }
});

/**
 * @swagger
 * /users/all:
 *   get:
 *     summary: Obtener todos los usuarios (id y nickName)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios (id y nickName)
*/

// Obtener todos los usuarios (id y nickName)
router.get('/all', require('../controllers/userController').getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
*/

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor'});
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               account_device_token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       400:
 *         description: Falta de campos para actualizar
 *       404:
 *         description: Usuario no encontrado
*/

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, account_device_token } = req.body;
    const user = await User.findByPk(id);
    if (!user){
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (!email && !account_device_token){
      return res.status(400).json({ error: 'Se requiere al menos un campo para actualizar'});
    }
    if (email) user.email = email;
    if (account_device_token) user.account_device_token = account_device_token;
    await user.save();
    res.json({ mensaje: 'Usuario actualizado correctamente', user});
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor'});
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       404:
 *         description: Usuario no encontrado
*/

// Eliminar usuario (borrado en cascada manual)
router.delete('/:id', require('../controllers/userController').deleteUserCascade);

router.post('/:id/follow', userController.followUser);
router.post('/:id/unfollow', userController.unfollowUser);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

module.exports = router;