const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Asignar permisos a un rol
exports.assignPermissionsToRole = async (req, res) => {
  const { roleId, permissionIds } = req.body; // Lista de IDs de permisos

  // Validar que se proporcionen los IDs de rol y permisos
  if (!roleId || !permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
    return res.status(400).json({ message: 'Se deben proporcionar el ID del rol y una lista de IDs de permisos válidos.' });
  }

  try {
    // Buscar el rol por su ID
    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    // Buscar los permisos por sus IDs
    const permissions = await Permission.findAll({ where: { id: permissionIds } });

    if (permissions.length === 0) {
      return res.status(404).json({ message: 'Permisos no encontrados' });
    }

    // Asignar permisos al rol
    await role.setPermissions(permissions);

    res.status(200).json({ message: 'Permisos asignados con éxito', role });
  } catch (error) {
    console.error('Error asignando permisos:', error);
    res.status(500).json({ message: 'Error asignando permisos', error: error.message });
  }
};
