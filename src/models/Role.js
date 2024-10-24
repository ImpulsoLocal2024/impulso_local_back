const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Role = sequelize.define('Role', {
  role_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'roles',
  timestamps: false,
});

module.exports = Role;
