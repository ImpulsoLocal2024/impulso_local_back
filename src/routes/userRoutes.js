// routes.js

const express = require('express');
const userController = require('../controllers/userController');
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware'); // Importar el middleware de permisos

const router = express.Router();

// Ruta para obtener los asesores (definida antes de las rutas con parámetros dinámicos)
router.get('/asesors', authenticateJWT, authorizePermission('view_users'), userController.getAsesors);

// Ruta para crear un nuevo usuario (solo accesible con el permiso "manage_users")
router.post('/', authenticateJWT, authorizePermission('manage_users'), userController.createUser);

// Ruta para login (No se necesita protección en esta ruta)
router.post('/login', userController.login);

// Ruta protegida para obtener todos los usuarios (solo accesible con el permiso "view_users")
router.get('/', authenticateJWT, authorizePermission('view_users'), userController.getUsers);

// Ruta para obtener un usuario por ID (solo accesible con el permiso "view_users")
router.get('/:id', authenticateJWT, authorizePermission('view_users'), userController.getUserById);

// Ruta para actualizar un usuario (solo accesible con el permiso "manage_users")
router.put('/:id', authenticateJWT, authorizePermission('manage_users'), userController.updateUser);

// Ruta para eliminar un usuario (solo accesible con el permiso "manage_users")
router.delete('/:id', authenticateJWT, authorizePermission('manage_users'), userController.deleteUser);

// Ruta para solicitar la recuperación de contraseña (pública, sin protección)
router.post('/forgot-password', userController.forgotPassword);

// Ruta para restablecer la contraseña (pública, sin protección)
router.post('/reset-password/:token', userController.resetPassword);

// Ruta para cambiar el estado del usuario
router.put('/:id/toggle-status', userController.toggleUserStatus);

module.exports = router;
