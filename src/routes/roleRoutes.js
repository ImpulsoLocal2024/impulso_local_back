const express = require('express');
const roleController = require('../controllers/roleController');
const { authenticateJWT } = require('../middlewares/authMiddleware'); // Importar solo authenticateJWT

const router = express.Router();

// Ruta para crear un nuevo rol
router.post('/', authenticateJWT, roleController.createRole);

// Ruta para obtener todos los roles
router.get('/', authenticateJWT, roleController.getRoles);

// Ruta para actualizar un rol
router.put('/:id', authenticateJWT, roleController.updateRole);

// Ruta para eliminar un rol
router.delete('/:id', authenticateJWT, roleController.deleteRole);

module.exports = router;
