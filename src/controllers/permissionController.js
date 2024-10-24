const Permission = require('../models/Permission');

// Crear un nuevo permiso
exports.createPermission = async (req, res) => {
  const { permission_name } = req.body;
  try {
    const newPermission = await Permission.create({ permission_name });
    res.status(201).json({ message: 'Permiso creado con éxito', permission: newPermission });
  } catch (error) {
    res.status(500).json({ message: 'Error creando permiso', error: error.message });
  }
};

// Obtener todos los permisos
exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo permisos', error: error.message });
  }
};

// Actualizar un permiso
exports.updatePermission = async (req, res) => {
  const { id } = req.params;
  const { permission_name } = req.body;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    permission.permission_name = permission_name || permission.permission_name;

    await permission.save();
    res.status(200).json({ message: 'Permiso actualizado', permission });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando permiso', error: error.message });
  }
};

// Eliminar un permiso
exports.deletePermission = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: 'Permiso no encontrado' });
    }

    await permission.destroy();
    res.status(200).json({ message: 'Permiso eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando permiso', error: error.message });
  }
};

// Crear permisos para las tablas
const createTablePermissions = async () => {
  try {
    await Permission.create({ permission_name: 'view_tables' });
    await Permission.create({ permission_name: 'manage_tables' });
    console.log('Permisos para tablas creados con éxito');
  } catch (error) {
    console.error('Error creando permisos:', error.message);
  }
};

createTablePermissions();

