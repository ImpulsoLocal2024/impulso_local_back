const express = require('express');
const permissionController = require('../controllers/permissionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para crear un nuevo permiso
router.post('/', authenticateJWT, permissionController.createPermission);

// Ruta para obtener todos los permisos
router.get('/', authenticateJWT, permissionController.getPermissions);

// Ruta para actualizar un permiso
router.put('/:id', authenticateJWT, permissionController.updatePermission);

// Ruta para eliminar un permiso
router.delete('/:id', authenticateJWT, permissionController.deletePermission);

module.exports = router;
