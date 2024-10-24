const Role = require('../models/Role');

// Crear un nuevo rol
exports.createRole = async (req, res) => {
  const { role_name, description } = req.body;
  try {
    const newRole = await Role.create({ role_name, description });
    res.status(201).json({ message: 'Rol creado con éxito', role: newRole });
  } catch (error) {
    res.status(500).json({ message: 'Error creando rol', error: error.message });
  }
};

// Obtener todos los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo roles', error: error.message });
  }
};

// Actualizar un rol
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name, description } = req.body;
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    role.role_name = role_name || role.role_name;
    role.description = description || role.description;

    await role.save();
    res.status(200).json({ message: 'Rol actualizado', role });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando rol', error: error.message });
  }
};

// Eliminar un rol
exports.deleteRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Rol no encontrado' });
    }

    await role.destroy();
    res.status(200).json({ message: 'Rol eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando rol', error: error.message });
  }
};
