const { DataTypes } = require('sequelize');
const sequelize = require('../utils/sequelize');

const Permission = sequelize.define('Permission', {
  permission_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  tableName: 'permissions',
  timestamps: false,
});

module.exports = Permission;
