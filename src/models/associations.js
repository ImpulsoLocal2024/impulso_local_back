const Role = require('./Role');
const Permission = require('./Permission');

// Definir la relación muchos a muchos con alias en minúsculas
Role.belongsToMany(Permission, { through: 'role_permissions', foreignKey: 'role_id', as: 'permissions' });
Permission.belongsToMany(Role, { through: 'role_permissions', foreignKey: 'permission_id', as: 'roles' });

module.exports = { Role, Permission };
