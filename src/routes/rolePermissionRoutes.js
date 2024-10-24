const express = require('express');
const rolePermissionController = require('../controllers/rolePermissionController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ruta para asignar permisos a un rol
router.post('/assign', authenticateJWT, rolePermissionController.assignPermissionsToRole);

module.exports = router;
